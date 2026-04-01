"use client";

import { useState, useEffect } from "react";
import { siteConfig } from "@/config/weddingConfig";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "@/components/Layout/ScrollReveal";

export default function Gifting() {
    // Name State added
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [amount, setAmount] = useState("");
    const [phoneError, setPhoneError] = useState("");

    const [status, setStatus] = useState("idle");
    const [errorMessage, setErrorMessage] = useState("");
    const [receipt, setReceipt] = useState("");
    const [checkoutRequestId, setCheckoutRequestId] = useState("");

    const normalizeKenyanMobile = (value: string) => {
        let digits = value.replace(/\D+/g, "");
        if (digits.startsWith("0") && digits.length === 10) {
            digits = `254${digits.slice(1)}`;
        } else if ((digits.startsWith("7") || digits.startsWith("1")) && digits.length === 9) {
            digits = `254${digits}`;
        } else if (digits.startsWith("2540") && digits.length === 13) {
            digits = `254${digits.slice(4)}`;
        }
        return digits;
    };

    const isValidKenyanMobile = (value: string) => /^254(7|1)\d{8}$/.test(value);

    useEffect(() => {
        if (status !== "waiting_for_pin" || !checkoutRequestId) return;

        const channel = supabase
            .channel(`mpesa-${checkoutRequestId}`)
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "mpesa_transactions",
                    filter: `checkout_request_id=eq.${checkoutRequestId}`,
                },
                (payload) => {
                    const updatedRow = payload.new;
                    if (updatedRow.status === "completed") {
                        setReceipt(updatedRow.receipt_number);
                        setStatus("success");
                    } else if (updatedRow.status === "failed") {
                        setErrorMessage("Transaction was cancelled or failed.");
                        setStatus("error");
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [status, checkoutRequestId]);

    const handleSTKPush = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Require name in the form submission
        if (!phone || !amount || !name.trim()) return;

        const formattedPhone = normalizeKenyanMobile(phone);
        if (!isValidKenyanMobile(formattedPhone)) {
            setPhoneError("Enter a valid Safaricom mobile number (e.g. 712345678 or 0712345678).");
            setStatus("error");
            setErrorMessage("Please correct the phone number and try again.");
            return;
        }

        setStatus("loading");
        setErrorMessage("");
        setPhoneError("");

        try {
            const response = await fetch("/api/mpesa/stkpush", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: formattedPhone, amount, name: name.trim() }),
            });

            const data = await response.json();

            if (data.success) {
                setCheckoutRequestId(data.checkoutRequestId);
                setStatus("waiting_for_pin");
            } else {
                throw new Error(data.error || "Failed to initiate payment");
            }
        } catch (err: any) {
            setErrorMessage(err.message || "Something went wrong.");
            setStatus("error");
        }
    };

    const resetForm = () => {
        setName("");
        setPhone("");
        setAmount("");
        setStatus("idle");
        setErrorMessage("");
        setPhoneError("");
    };

    if (!siteConfig.mpesa.enabled) return null;

    return (
        <section className="relative min-h-screen flex items-center justify-center py-24 px-4 z-10 bg-[#fffdf7]">
            <ScrollReveal className="max-w-xl mx-auto w-full">

                {/* Section Header */}
                <div className="text-center space-y-2 mb-12">
                    <h3 className="font-calligraphy text-4xl md:text-5xl text-primary drop-shadow-sm">
                        Gift the Couple
                    </h3>
                    <div className="w-30 h-[1px] bg-primary/50 mx-auto mt-2" />
                </div>

                {/* Interactive Card */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden relative min-h-[400px] flex flex-col justify-center">
                    <div className="h-2 w-full bg-[#52B44B]" />

                    <div className="p-8 md:p-12">
                        <AnimatePresence mode="wait">

                            {/* IDLE STATE */}
                            {status === "idle" && (
                                <motion.div
                                    key="idle"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="space-y-6 text-center"
                                >
                                    <p className="text-gray-600 font-light leading-relaxed mb-6">
                                        {siteConfig.mpesa.message}
                                    </p>

                                    <form onSubmit={handleSTKPush} className="space-y-5 text-left">

                                        {/* Name Input Field */}
                                        <div>
                                            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Your Name</label>
                                            <div className="flex items-center border-b border-gray-300 py-2 focus-within:border-[#52B44B] transition-colors">
                                                <input
                                                    type="text"
                                                    required
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    className="w-full bg-transparent focus:outline-none text-gray-800 text-lg tracking-wider"
                                                    placeholder="e.g. Kevin Kanyoro"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">M-Pesa Phone Number</label>
                                            <div className="flex items-center border-b border-gray-300 py-2 focus-within:border-[#52B44B] transition-colors">
                                                <span className="text-gray-500 mr-2">+254</span>
                                                <input
                                                    type="tel"
                                                    required
                                                    value={phone}
                                                    onChange={(e) => {
                                                        setPhone(e.target.value);
                                                        if (phoneError) setPhoneError("");
                                                    }}
                                                    onBlur={() => {
                                                        if (!phone) return;
                                                        const formattedPhone = normalizeKenyanMobile(phone);
                                                        if (!isValidKenyanMobile(formattedPhone)) {
                                                            setPhoneError("Use 7XXXXXXXX, 1XXXXXXXX, 07XXXXXXXX, or 01XXXXXXXX.");
                                                            return;
                                                        }
                                                        setPhone(formattedPhone.slice(3));
                                                        setPhoneError("");
                                                    }}
                                                    className="w-full bg-transparent focus:outline-none text-gray-800 text-lg tracking-wider"
                                                    placeholder="712 345 678"
                                                />
                                            </div>
                                            {phoneError && (
                                                <p className="text-xs text-red-500 mt-2">{phoneError}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Amount (KES)</label>
                                            <div className="flex items-center border-b border-gray-300 py-2 focus-within:border-[#52B44B] transition-colors">
                                                <span className="text-gray-500 mr-2 font-serif font-bold">KES</span>
                                                <input
                                                    type="number"
                                                    required
                                                    min="1"
                                                    value={amount}
                                                    onChange={(e) => setAmount(e.target.value)}
                                                    className="w-full bg-transparent focus:outline-none text-gray-800 text-lg tracking-wider"
                                                    placeholder="1000"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            className="w-full mt-6 py-4 bg-[#52B44B] text-white rounded-xl tracking-widest uppercase text-sm font-medium hover:bg-[#43963e] transition-colors shadow-lg shadow-green-500/30"
                                        >
                                            Send via STK Push (Prompt)
                                        </button>
                                    </form>

                                    {/* Manual Fallback info */}
                                    <div className="pt-6 border-t border-gray-100 mt-6">
                                        <p className="text-xs text-gray-400 uppercase tracking-widest">Or pay manually</p>
                                        <p className="text-sm text-gray-600 mt-1 font-serif">
                                            {siteConfig.mpesa.type === "paybill" ? "Paybill: " : "Till: "}
                                            <span className="font-bold text-gray-900">{siteConfig.mpesa.number}</span>
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            {/* LOADING STATE */}
                            {status === "loading" && (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="flex flex-col items-center justify-center space-y-6 py-10"
                                >
                                    <div className="w-12 h-12 border-4 border-gray-100 border-t-[#52B44B] rounded-full animate-spin" />
                                    <p className="text-gray-600 font-light animate-pulse">Connecting to Safaricom...</p>
                                </motion.div>
                            )}

                            {/* WAITING FOR PIN STATE */}
                            {status === "waiting_for_pin" && (
                                <motion.div
                                    key="waiting"
                                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                                    className="flex flex-col items-center justify-center text-center space-y-6 py-8"
                                >
                                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center relative">
                                        <div className="absolute inset-0 border-2 border-[#52B44B] rounded-full animate-ping opacity-20" />
                                        <svg className="w-10 h-10 text-[#52B44B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-serif text-gray-900 mb-2">Check Your Phone</h4>
                                        <p className="text-gray-500 font-light text-sm px-4">
                                            An M-Pesa prompt has been sent to your phone. Please enter your PIN to send the gift.
                                        </p>
                                    </div>
                                    <p className="text-xs text-primary/60 italic animate-pulse">Waiting for confirmation...</p>

                                    <button onClick={resetForm} className="text-xs text-gray-400 uppercase tracking-widest mt-8 hover:text-gray-800 transition-colors">
                                        Cancel
                                    </button>
                                </motion.div>
                            )}

                            {/* SUCCESS STATE */}
                            {status === "success" && (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                    className="flex flex-col items-center justify-center text-center py-8"
                                >
                                    <div className="w-20 h-20 bg-green-100 text-[#52B44B] rounded-full flex items-center justify-center mb-6">
                                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    <h4 className="text-3xl font-serif text-gray-900 mb-2">Thank You!</h4>
                                    <p className="text-gray-600 font-light mb-6">Your generous gift has been received.</p>
                                    <div className="bg-gray-50 px-6 py-4 rounded-xl border border-gray-100 w-full">
                                        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Receipt Number</p>
                                        <p className="font-mono text-xl text-gray-800 tracking-wider font-bold">{receipt}</p>
                                    </div>
                                    <button onClick={resetForm} className="mt-8 text-sm text-primary uppercase tracking-widest hover:underline">
                                        Send another gift
                                    </button>
                                </motion.div>
                            )}

                            {/* ERROR STATE */}
                            {status === "error" && (
                                <motion.div
                                    key="error"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="flex flex-col items-center justify-center text-center py-8"
                                >
                                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
                                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </div>
                                    <h4 className="text-xl font-serif text-gray-900 mb-2">Transaction Failed</h4>
                                    <p className="text-gray-500 font-light text-sm px-4 mb-8">{errorMessage}</p>
                                    <button onClick={resetForm} className="px-8 py-3 bg-gray-900 text-white rounded-full uppercase tracking-widest text-xs hover:bg-gray-800 transition-colors">
                                        Try Again
                                    </button>
                                </motion.div>
                            )}

                        </AnimatePresence>
                    </div>
                </div>
            </ScrollReveal>
        </section>
    );
}