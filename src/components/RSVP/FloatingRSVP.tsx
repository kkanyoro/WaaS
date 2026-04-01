"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function FloatingRSVP() {
    const [isOpen, setIsOpen] = useState(false);

    // Form State
    const [name, setName] = useState("");
    const [isAttending, setIsAttending] = useState<boolean | null>(null);
    const [extraCount, setExtraCount] = useState(0);
    const [extraNames, setExtraNames] = useState<string[]>([]);

    // Submission State
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    // Handle dynamic extra guest name inputs
    const handleExtraNameChange = (index: number, value: string) => {
        const newNames = [...extraNames];
        newNames[index] = value;
        setExtraNames(newNames);
    };

    // The Supabase Submission Function
    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validation: Ensure they picked attending or not
        if (isAttending === null || !name.trim()) return;

        setStatus("loading");

        // Clean up the extra names array to match the exact count they selected
        const cleanedExtraNames = isAttending && extraCount > 0
            ? extraNames.slice(0, extraCount).map(n => n.trim()).filter(n => n !== "")
            : [];

        // Insert into Supabase
        const { error } = await supabase
            .from("rsvps")
            .insert([
                {
                    name: name.trim(),
                    is_attending: isAttending,
                    extra_guests_count: isAttending ? extraCount : 0,
                    extra_guest_names: cleanedExtraNames,
                }
            ]);

        if (error) {
            console.error(error);
            setStatus("error");
        } else {
            setStatus("success");
            // Close modal automatically after 3 seconds
            setTimeout(() => {
                setIsOpen(false);
                setStatus("idle");
            }, 3000);
        }
    };

    return (
        <>
            {/* Floating button */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(true)}
                    className="px-8 py-4 bg-primary text-[#fffdf7] font-serif tracking-[0.2em] text-sm md:text-base rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.3)] hover:bg-primary/90 transition-colors border border-primary/50 backdrop-blur-md"
                >
                    RSVP
                </motion.button>
            </div>

            {/* Modal Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-6">
                        {/* Darkened Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />

                        {/* Modal Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 50, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.95 }}
                            className="relative w-full max-w-lg bg-[#fffdf7] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-primary transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <div className="p-8 overflow-y-auto">
                                <h2 className="text-3xl font-serif text-primary text-center mb-2">RSVP</h2>
                                <p className="text-center text-gray-500 font-light mb-8">Will you be joining us on this special occasion?</p>

                                {status === "success" ? (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10">
                                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                        <h3 className="text-2xl font-serif text-gray-900 mb-2">Thank You!</h3>
                                        <p className="text-gray-600">Your response has been recorded.</p>
                                    </motion.div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">

                                        {/* Name Input */}
                                        <div>
                                            <label className="block text-sm uppercase tracking-widest text-gray-500 mb-2">Full Name</label>
                                            <input
                                                type="text"
                                                required
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full bg-transparent border-b border-gray-300 py-2 focus:outline-none focus:border-primary transition-colors text-lg"
                                                placeholder="e.g. Kevin Kanyoro"
                                            />
                                        </div>

                                        {/* Attendance Toggle */}
                                        <div className="flex gap-4 pt-2">
                                            <button
                                                type="button"
                                                onClick={() => setIsAttending(true)}
                                                className={`flex-1 py-3 border rounded-lg transition-all ${isAttending === true ? 'bg-primary border-primary text-[#fffdf7] shadow-md' : 'border-gray-300 text-gray-600 hover:border-primary'}`}
                                            >
                                                Attending
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setIsAttending(false)}
                                                className={`flex-1 py-3 border rounded-lg transition-all ${isAttending === false ? 'bg-gray-800 border-gray-800 text-white shadow-md' : 'border-gray-300 text-gray-600 hover:border-gray-800'}`}
                                            >
                                                Can't make it
                                            </button>
                                        </div>

                                        {/* Conditional Plus Ones (Only show if attending) */}
                                        <AnimatePresence>
                                            {isAttending === true && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="space-y-4 overflow-hidden pt-4 border-t border-gray-100"
                                                >
                                                    {/* Custom Stepper for Plus Ones */}
                                                    <div className="flex items-center justify-between bg-transparent border border-gray-200 rounded-lg p-3">
                                                        <span className="text-sm uppercase tracking-widest text-gray-500">Extra Guests</span>
                                                        <div className="flex items-center gap-4">
                                                            {/* Minus Button */}
                                                            <button
                                                                type="button"
                                                                onClick={() => setExtraCount(Math.max(0, extraCount - 1))}
                                                                disabled={extraCount === 0}
                                                                className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-500 hover:border-primary hover:text-primary disabled:opacity-30 disabled:hover:border-gray-300 disabled:hover:text-gray-500 transition-colors"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                                                </svg>
                                                            </button>

                                                            {/* Number Display */}
                                                            <span className="text-lg font-serif w-4 text-center text-gray-800">
                                                                {extraCount}
                                                            </span>

                                                            {/* Plus Button (Capped at 5 to prevent UI breaking) */}
                                                            <button
                                                                type="button"
                                                                onClick={() => setExtraCount(Math.min(5, extraCount + 1))}
                                                                disabled={extraCount === 5}
                                                                className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-500 hover:border-primary hover:text-primary disabled:opacity-30 transition-colors"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Map out inputs for guest names based on the count */}
                                                    {Array.from({ length: extraCount }).map((_, index) => (
                                                        <motion.div
                                                            key={index}
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                        >
                                                            <label className="block text-xs uppercase tracking-widest text-gray-400 mb-1">Guest {index + 1} Name</label>
                                                            <input
                                                                type="text"
                                                                required
                                                                value={extraNames[index] || ""}
                                                                onChange={(e) => handleExtraNameChange(index, e.target.value)}
                                                                className="w-full bg-transparent border-b border-gray-300 py-2 focus:outline-none focus:border-primary text-base"
                                                                placeholder="Full Name"
                                                            />
                                                        </motion.div>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            disabled={status === "loading" || isAttending === null || !name.trim()}
                                            className="w-full mt-8 py-4 bg-primary text-[#fffdf7] rounded-lg tracking-widest uppercase disabled:opacity-50 transition-opacity flex justify-center items-center"
                                        >
                                            {status === "loading" ? (
                                                <div className="w-6 h-6 border-2 border-[#fffdf7] border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                "Submit RSVP"
                                            )}
                                        </button>
                                        {status === "error" && <p className="text-red-500 text-sm text-center">Something went wrong. Please try again.</p>}
                                    </form>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}