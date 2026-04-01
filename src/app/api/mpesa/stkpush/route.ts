import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
    try {
        const { phone, amount, name } = await req.json();

        // Normalize to digits and enforce Kenya mobile format: 2547XXXXXXXX or 2541XXXXXXXX
        const rawPhone = String(phone ?? "");
        let formattedPhone = rawPhone.replace(/\D+/g, "");

        if (formattedPhone.startsWith("0") && formattedPhone.length === 10) {
            formattedPhone = `254${formattedPhone.slice(1)}`;
        } else if ((formattedPhone.startsWith("7") || formattedPhone.startsWith("1")) && formattedPhone.length === 9) {
            formattedPhone = `254${formattedPhone}`;
        }

        if (!/^254(7|1)\d{8}$/.test(formattedPhone)) {
            return NextResponse.json(
                { success: false, error: "Invalid phone number. Use a valid Kenyan mobile number." },
                { status: 400 }
            );
        }

        // Safaricom Credentials
        const consumerKey = process.env.MPESA_CONSUMER_KEY!;
        const consumerSecret = process.env.MPESA_CONSUMER_SECRET!;
        const passkey = process.env.MPESA_PASSKEY!;
        const shortcode = process.env.MPESA_SHORTCODE!;
        const callbackUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/mpesa/callback`;

        // Generate Timestamps & Passwords
        const date = new Date();
        const timestamp =
            date.getFullYear().toString() +
            ("0" + (date.getMonth() + 1)).slice(-2) +
            ("0" + date.getDate()).slice(-2) +
            ("0" + date.getHours()).slice(-2) +
            ("0" + date.getMinutes()).slice(-2) +
            ("0" + date.getSeconds()).slice(-2);

        const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");
        const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

        // Get OAuth Token from Daraja
        const tokenResponse = await fetch("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
            headers: { Authorization: `Basic ${auth}` },
        });
        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok) throw new Error("Failed to get Daraja Token");

        // Trigger the STK Push
        const stkPayload = {
            BusinessShortCode: shortcode,
            Password: password,
            Timestamp: timestamp,
            TransactionType: "CustomerPayBillOnline",
            Amount: Math.ceil(Number(amount)),
            PartyA: formattedPhone,
            PartyB: shortcode,
            PhoneNumber: formattedPhone,
            CallBackURL: callbackUrl,
            AccountReference: "Wedding Gift",
            TransactionDesc: "Gift for the couple",
        };

        const stkResponse = await fetch("https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${tokenData.access_token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(stkPayload),
        });

        const stkData = await stkResponse.json();

        if (stkData.ResponseCode === "0") {
            const { error } = await supabase.from("mpesa_transactions").insert([{
                checkout_request_id: stkData.CheckoutRequestID,
                phone: formattedPhone,
                amount: Math.ceil(Number(amount)),
                status: "pending",
                guest_name: name || "Anonymous Guest"
            }]);

            if (error) throw error;

            return NextResponse.json({ success: true, checkoutRequestId: stkData.CheckoutRequestID });
        } else {
            throw new Error(stkData.errorMessage || "STK Push Failed");
        }

    } catch (error: any) {
        console.error("STK Push Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}