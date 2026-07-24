"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import GiftingModal from "../Sections/Gifting";

type AttendanceType = "church_only" | "reception_only" | "both" | "none";

export default function FloatingActions() {
    const [isRsvpOpen, setIsRsvpOpen] = useState(false);
    const [isGiftOpen, setIsGiftOpen] = useState(false);

    // Form State
    const [name, setName] = useState("");
    const [attendanceType, setAttendanceType] = useState<AttendanceType | null>(null);
    const [extraCount, setExtraCount] = useState(0);
    const [extraNames, setExtraNames] = useState<string[]>([]);
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleExtraNameChange = (index: number, value: string) => {
        const newNames = [...extraNames];
        newNames[index] = value;
        setExtraNames(newNames);
    };

    const isActuallyAttending = attendanceType === "church_only" || attendanceType === "reception_only" || attendanceType === "both";

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (attendanceType === null || !name.trim()) return;
        setStatus("loading");

        const cleanedExtraNames = isActuallyAttending && extraCount > 0
            ? extraNames.slice(0, extraCount).map(n => n.trim()).filter(n => n !== "")
            : [];

        // UPDATED: Sending attendance_type string instead of boolean
        const { error } = await supabase.from("rsvps").insert([{
            name: name.trim(),
            attendance_type: attendanceType,
            extra_guests_count: isActuallyAttending ? extraCount : 0,
            extra_guest_names: cleanedExtraNames,
        }]);

        if (error) {
            console.error(error);
            setStatus("error");
        } else {
            setStatus("success");
            setTimeout(() => { setIsRsvpOpen(false); setStatus("idle"); }, 3000);
        }
    };

    const rsvpOptions = [
        { id: "church_only", label: "Church Only", sub: "Here for the vows!" },
        { id: "reception_only", label: "Reception Only", sub: "Ready to celebrate!" },
        { id: "both", label: "Attending Both", sub: "Double the fun!" },
        { id: "none", label: "Celebrating in Spirit", sub: "Sadly, can't make it" },
    ];

    return (
        <>
            {/* The Floating Buttons container */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex gap-3 shadow-[0_10px_40px_rgba(0,0,0,0.3)] rounded-full p-1 bg-white/20 backdrop-blur-md border border-white/30">
                <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => setIsRsvpOpen(true)}
                    className="px-6 md:px-8 py-3 md:py-4 bg-primary text-[#fffdf7] font-serif tracking-[0.2em] text-xs md:text-sm rounded-full transition-colors"
                >
                    RSVP
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => setIsGiftOpen(true)}
                    className="px-6 md:px-8 py-3 md:py-4 bg-[#fffdf7] text-primary font-serif tracking-[0.2em] text-xs md:text-sm rounded-full transition-colors"
                >
                    GIFT
                </motion.button>
            </div>

            {/* The RSVP Modal */}
            <AnimatePresence>
                {isRsvpOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsRsvpOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                        <motion.div initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} className="relative w-full max-w-lg bg-[#fffdf7] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                            <button onClick={() => setIsRsvpOpen(false)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-primary transition-colors z-10">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                            <div className="p-8 overflow-y-auto">
                                <h2 className="text-3xl font-serif text-primary text-center mb-2">RSVP</h2>
                                <p className="text-center text-gray-500 font-light mb-8">Will you be joining us on this special occasion?</p>
                                {status === "success" ? (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10">
                                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4"><svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></div>
                                        <h3 className="text-2xl font-serif text-gray-900 mb-2">Thank You!</h3>
                                        <p className="text-gray-600">Your response has been recorded.</p>
                                    </motion.div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div>
                                            <label className="block text-sm uppercase tracking-widest text-gray-500 mb-2">Full Name</label>
                                            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-transparent border-b border-gray-300 py-2 focus:outline-none focus:border-primary transition-colors text-lg" placeholder="e.g. Kevin Kanyoro" />
                                        </div>

                                        {/* RSVP BUTTONS */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                                            {rsvpOptions.map((option) => (
                                                <button
                                                    key={option.id}
                                                    type="button"
                                                    onClick={() => setAttendanceType(option.id as AttendanceType)}
                                                    className={`flex flex-col items-center justify-center py-3 px-2 border rounded-lg transition-all ${attendanceType === option.id
                                                            ? "bg-primary border-primary text-[#fffdf7] shadow-md"
                                                            : "border-gray-300 text-gray-600 hover:border-primary hover:text-primary"
                                                        }`}
                                                >
                                                    <span className="font-serif text-base">{option.label}</span>
                                                    <span className={`text-[9px] uppercase tracking-widest mt-1 ${attendanceType === option.id ? "text-[#fffdf7]/80" : "text-gray-400"}`}>
                                                        {option.sub}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>

                                        {/* EXTRA GUESTS DROPDOWN */}
                                        <AnimatePresence>
                                            {isActuallyAttending && (
                                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-4 overflow-hidden pt-4 border-t border-gray-100">
                                                    <div className="flex items-center justify-between bg-transparent border border-gray-200 rounded-lg p-3">
                                                        <span className="text-sm uppercase tracking-widest text-gray-500">Extra Guests</span>
                                                        <div className="flex items-center gap-4">
                                                            <button type="button" onClick={() => setExtraCount(Math.max(0, extraCount - 1))} disabled={extraCount === 0} className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-500 hover:border-primary hover:text-primary disabled:opacity-30 disabled:hover:border-gray-300 disabled:hover:text-gray-500 transition-colors"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg></button>
                                                            <span className="text-lg font-serif w-4 text-center text-gray-800">{extraCount}</span>
                                                            <button type="button" onClick={() => setExtraCount(Math.min(5, extraCount + 1))} disabled={extraCount === 5} className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-500 hover:border-primary hover:text-primary disabled:opacity-30 transition-colors"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg></button>
                                                        </div>
                                                    </div>
                                                    {Array.from({ length: extraCount }).map((_, index) => (
                                                        <motion.div key={index} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                                                            <label className="block text-xs uppercase tracking-widest text-gray-400 mb-1">Guest {index + 1} Name</label>
                                                            <input type="text" required value={extraNames[index] || ""} onChange={(e) => handleExtraNameChange(index, e.target.value)} className="w-full bg-transparent border-b border-gray-300 py-2 focus:outline-none focus:border-primary text-base" placeholder="Full Name" />
                                                        </motion.div>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                        <button type="submit" disabled={status === "loading" || attendanceType === null || !name.trim()} className="w-full mt-8 py-4 bg-primary text-[#fffdf7] rounded-lg tracking-widest uppercase disabled:opacity-50 transition-opacity flex justify-center items-center">
                                            {status === "loading" ? <div className="w-6 h-6 border-2 border-[#fffdf7] border-t-transparent rounded-full animate-spin" /> : "Submit RSVP"}
                                        </button>
                                        {status === "error" && <p className="text-red-500 text-sm text-center">Something went wrong. Please try again.</p>}
                                    </form>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <GiftingModal isOpen={isGiftOpen} onClose={() => setIsGiftOpen(false)} />
        </>
    );
}