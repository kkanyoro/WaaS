"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import ScrollReveal from "@/components/Layout/ScrollReveal";

type GuestbookEntry = {
    id: string;
    name: string;
    message: string;
    created_at: string;
};

export default function Guestbook() {
    const [entries, setEntries] = useState<GuestbookEntry[]>([]);
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const sortedEntries = useMemo(
        () => [...entries].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
        [entries]
    );

    useEffect(() => {
        // Fetch initial existing messages
        const fetchMessages = async () => {
            const { data } = await supabase
                .from("guestbook")
                .select("*")
                .order("created_at", { ascending: false });

            if (data) setEntries(data);
        };

        fetchMessages();

        // Subscribe to real-time changes
        // When anyone anywhere inserts a new row, this triggers instantly
        const channel = supabase
            .channel("realtime-guestbook")
            .on("postgres_changes", { event: "INSERT", schema: "public", table: "guestbook" }, (payload) => {
                setEntries((prev) => [payload.new as GuestbookEntry, ...prev]);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!name.trim() || !message.trim()) return;

        setIsSubmitting(true);

        const { error } = await supabase
            .from("guestbook")
            .insert([{ name: name.trim(), message: message.trim() }]);

        if (!error) {
            // Clear the form on success
            setName("");
            setMessage("");
        } else {
            console.error("Error submitting message:", error);
        }

        setIsSubmitting(false);
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center py-24 px-6 md:px-12 z-10 bg-[#fffdf7]/50">
            <ScrollReveal className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

                {/* LEFT SIDE: The Form */}
                <div className="flex flex-col space-y-8 sticky top-24">
                    <div className="space-y-2 text-center lg:text-left">
                        <h3 className="font-calligraphy text-4xl md:text-5xl text-primary drop-shadow-sm">
                            Leave some love
                        </h3>
                        <h2 className="text-3xl md:text-5xl font-serif tracking-wide text-gray-900 uppercase">
                            Digital Guestbook
                        </h2>
                        <div className="w-16 h-[1px] bg-primary/50 mx-auto lg:mx-0 mt-4" />
                    </div>

                    <p className="text-gray-600 font-light text-lg text-center lg:text-left">
                        Whether you are celebrating with us in person or in spirit, we would love to read your well wishes!
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl shadow-xl border border-primary/10">
                        <div>
                            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Your Name</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-transparent border-b border-gray-300 py-2 focus:outline-none focus:border-primary transition-colors text-gray-800"
                                placeholder="e.g. Kevin Kanyoro"
                            />
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Your Message</label>
                            <textarea
                                required
                                rows={4}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full bg-transparent border-b border-gray-300 py-2 focus:outline-none focus:border-primary transition-colors resize-none text-gray-800"
                                placeholder="Wishing you a lifetime of happiness..."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting || !name.trim() || !message.trim()}
                            className="w-full py-4 bg-primary text-[#fffdf7] rounded-lg tracking-widest uppercase text-sm disabled:opacity-50 transition-opacity flex justify-center items-center hover:bg-primary/90"
                        >
                            {isSubmitting ? (
                                <div className="w-5 h-5 border-2 border-[#fffdf7] border-t-transparent rounded-full animate-spin" />
                            ) : (
                                "Sign Guestbook"
                            )}
                        </button>
                    </form>
                </div>

                {/* RIGHT SIDE: Live Feed */}
                <div className="relative h-[600px] rounded-2xl overflow-hidden bg-white/50 border border-primary/20 shadow-inner p-2 md:p-6">
                    {/* Fade overlay at top and bottom for seamless scrolling effect */}
                    <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-[#fffdf7] to-transparent z-10 pointer-events-none rounded-t-2xl" />
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#fffdf7] to-transparent z-10 pointer-events-none rounded-b-2xl" />

                    <div className="h-full overflow-y-auto space-y-6 px-4 py-8 custom-scrollbar">
                        {sortedEntries.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 font-light space-y-4">
                                <svg className="w-12 h-12 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                                <p>Be the first to leave a message!</p>
                            </div>
                        ) : (
                            <AnimatePresence>
                                {sortedEntries.map((entry) => (
                                    <motion.div
                                        key={entry.id}
                                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                                    >
                                        <p className="text-gray-700 font-light leading-relaxed mb-4">
                                            "{entry.message}"
                                        </p>
                                        <div className="flex items-center justify-between text-xs tracking-widest uppercase">
                                            <span className="text-primary font-medium">{entry.name}</span>
                                            {/*Date and time*/}
                                            <span className="text-gray-400">
                                                {new Date(entry.created_at).toLocaleString(undefined, {
                                                    month: "2-digit", // e.g. 07
                                                    day: "2-digit",   // e.g. 09
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        )}
                    </div>
                </div>

            </ScrollReveal>
        </section>
    );
}