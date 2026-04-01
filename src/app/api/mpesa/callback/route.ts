import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const callbackData = data.Body.stkCallback;

        const checkoutRequestId = callbackData.CheckoutRequestID;
        const resultCode = callbackData.ResultCode; // 0 - success, else - failure/cancelled

        let status = "failed";
        let receiptNumber = null;

        if (resultCode === 0) {
            status = "completed";
            // Extract the Receipt Number from Safaricom's deeply nested array
            const callbackItems = callbackData.CallbackMetadata.Item;
            const receiptItem = callbackItems.find((item: any) => item.Name === "MpesaReceiptNumber");
            receiptNumber = receiptItem ? receiptItem.Value : null;
        }

        // Update the database, will instantly trigger frontend via WebSockets
        const { error } = await supabase
            .from("mpesa_transactions")
            .update({ status: status, receipt_number: receiptNumber })
            .eq("checkout_request_id", checkoutRequestId);

        if (error) console.error("Database Update Error:", error);

        // Safaricom requires acknowledgement otherwise they keep pinging this URL
        return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });

    } catch (error) {
        console.error("Callback Error:", error);
        return NextResponse.json({ ResultCode: 1, ResultDesc: "Failed to process" });
    }
}