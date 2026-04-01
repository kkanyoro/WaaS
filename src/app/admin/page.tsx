"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

type RSVP = {
    id: string;
    created_at: string;
    name: string;
    is_attending: boolean;
    extra_guests_count: number;
    extra_guest_names: string[];
};

// Type for Gifts
type Gift = {
    id: string;
    created_at: string;
    sender_name: string;
    phone: string;
    amount: number;
    status: string;
    receipt_number: string;
};

export default function AdminDashboard() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passcode, setPasscode] = useState("");
    const [authError, setAuthError] = useState("");

    const [rsvps, setRsvps] = useState<RSVP[]>([]);
    const [gifts, setGifts] = useState<Gift[]>([]); // State for Gifts
    const [isLoading, setIsLoading] = useState(true);

    // Filter States
    const [activeTab, setActiveTab] = useState<"rsvps" | "gifts">("rsvps"); // Master toggle
    const [filter, setFilter] = useState<"all" | "attending" | "not attending">("all");

    const handleLogin = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        const correctPasscode = process.env.NEXT_PUBLIC_DASHBOARD_PASSCODE;

        if (passcode === correctPasscode) {
            setIsAuthenticated(true);
            setAuthError("");
            sessionStorage.setItem("isAdminAuthed", "true");
        } else {
            setAuthError("Incorrect passcode.");
            setPasscode("");
        }
    };

    useEffect(() => {
        if (sessionStorage.getItem("isAdminAuthed") === "true") {
            setIsAuthenticated(true);
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            const fetchData = async () => {
                // Fetch both tables at once
                const [rsvpRes, giftRes] = await Promise.all([
                    supabase.from("rsvps").select("*").order("created_at", { ascending: false }),
                    supabase.from("mpesa_transactions").select("*").order("created_at", { ascending: false })
                ]);

                if (!rsvpRes.error) setRsvps(rsvpRes.data || []);
                if (!giftRes.error) setGifts(giftRes.data || []);

                setIsLoading(false);
            };
            fetchData();
        }
    }, [isAuthenticated]);

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#fffdf7] flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-primary/10 text-center">
                    <h2 className="text-3xl font-serif text-gray-900 mb-2">Dashboard Access</h2>
                    <p className="text-gray-500 font-light mb-8">Enter the passcode to view dashboard.</p>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password"
                            value={passcode}
                            onChange={(e) => setPasscode(e.target.value)}
                            placeholder="Enter Passcode"
                            className="w-full text-center tracking-widest bg-gray-50 border border-gray-200 py-3 rounded-lg focus:outline-none focus:border-primary transition-colors text-gray-800"
                        />
                        {authError && <p className="text-red-500 text-sm">{authError}</p>}
                        <button type="submit" className="w-full py-3 bg-primary text-[#fffdf7] rounded-lg tracking-widest uppercase text-sm hover:bg-primary/90 transition-colors">
                            Login
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // Calculations: RSVPs
    const totalResponses = rsvps.length;
    const attendingCount = rsvps.filter(r => r.is_attending).length;
    const declinedCount = totalResponses - attendingCount;
    const totalHeadcount = rsvps
        .filter(r => r.is_attending)
        .reduce((sum, rsvp) => sum + 1 + rsvp.extra_guests_count, 0);

    const filteredRsvps = rsvps.filter(r => {
        if (filter === "attending") return r.is_attending;
        if (filter === "not attending") return !r.is_attending;
        return true;
    });

    // Calculations: Gifts
    const completedGifts = gifts.filter(g => g.status === "completed");
    const totalRaised = completedGifts.reduce((sum, g) => sum + Number(g.amount), 0);

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-12 text-gray-900 selection:bg-primary/30">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header & Navigation */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-serif text-gray-900 mb-1">Dashboard</h1>
                        <p className="text-sm text-gray-500 font-light">Real-time tracking for your big day.</p>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        {/* Master View Toggle */}
                        <div className="flex bg-gray-200/50 p-1 rounded-full flex-1 md:flex-none">
                            <button
                                onClick={() => setActiveTab("rsvps")}
                                className={`flex-1 md:px-6 py-2 rounded-full text-xs uppercase tracking-widest transition-all ${activeTab === "rsvps" ? "bg-white shadow-sm text-primary font-medium" : "text-gray-500 hover:text-gray-900"
                                    }`}
                            >
                                Guest List
                            </button>
                            <button
                                onClick={() => setActiveTab("gifts")}
                                className={`flex-1 md:px-6 py-2 rounded-full text-xs uppercase tracking-widest transition-all ${activeTab === "gifts" ? "bg-white shadow-sm text-green-600 font-medium" : "text-gray-500 hover:text-gray-900"
                                    }`}
                            >
                                Gifts
                            </button>
                        </div>

                        <button
                            onClick={() => {
                                sessionStorage.removeItem("isAdminAuthed");
                                setIsAuthenticated(false);
                                setPasscode("");
                            }}
                            className="px-5 py-2 border border-gray-300 rounded-full text-xs uppercase tracking-widest text-gray-600 hover:bg-gray-100 transition-colors hidden md:block"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* RSVP VIEW */}
                {activeTab === "rsvps" && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                        {/* Stats */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                            <CompactStatCard title="Headcount" value={totalHeadcount} highlight />
                            <CompactStatCard title="Responses" value={totalResponses} />
                            <CompactStatCard title="Attending" value={attendingCount} />
                            <CompactStatCard title="Not Attending" value={declinedCount} />
                        </div>

                        {/* Table */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                            <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-center md:justify-start">
                                <div className="inline-flex bg-gray-200/50 p-1 rounded-lg w-full md:w-auto">
                                    {(["all", "attending", "not attending"] as const).map((f) => (
                                        <button
                                            key={f}
                                            onClick={() => setFilter(f)}
                                            className={`flex-1 md:px-6 py-2 rounded-md text-xs uppercase tracking-widest transition-all ${filter === f
                                                ? "bg-white shadow-sm text-primary font-medium"
                                                : "text-gray-500 hover:text-gray-900"
                                                }`}
                                        >
                                            {f}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-white border-b border-gray-100 text-[10px] md:text-xs uppercase tracking-widest text-gray-400">
                                            <th className="p-4 font-medium">Guest Name</th>
                                            <th className="p-4 font-medium text-center">Status</th>
                                            <th className="p-4 font-medium text-center">Party Size</th>
                                            <th className="p-4 font-medium text-right">Details</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {isLoading ? (
                                            <tr><td colSpan={4} className="p-8 text-center text-gray-400">Loading data...</td></tr>
                                        ) : filteredRsvps.length === 0 ? (
                                            <tr><td colSpan={4} className="p-8 text-center text-gray-400">No RSVPs Yet.</td></tr>
                                        ) : (
                                            filteredRsvps.map((rsvp) => <RSVPRow key={rsvp.id} rsvp={rsvp} />)
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* GIFTS VIEW */}
                {activeTab === "gifts" && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
                            <div className="p-6 rounded-xl border bg-[#52B44B] border-[#52B44B] text-white flex flex-col justify-center">
                                <h3 className="text-xs uppercase tracking-widest mb-1 text-white/80">Total Received (KES)</h3>
                                <p className="text-4xl md:text-5xl font-serif">
                                    {totalRaised.toLocaleString()}
                                </p>
                            </div>
                            <div className="p-6 rounded-xl border bg-white border-gray-100 text-gray-900 flex flex-col justify-center">
                                <h3 className="text-xs uppercase tracking-widest mb-1 text-gray-400">Contributors</h3>
                                <p className="text-4xl md:text-5xl font-serif">
                                    {completedGifts.length}
                                </p>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                                <h3 className="text-sm font-medium text-gray-700">Transactions</h3>
                            </div>
                            <div className="overflow-x-auto hide-scrollbar">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-white border-b border-gray-100 text-[10px] md:text-xs uppercase tracking-widest text-gray-400">
                                            <th className="p-4 font-medium">Name & Contact</th>
                                            <th className="p-4 font-medium text-right">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {isLoading ? (
                                            <tr><td colSpan={2} className="p-8 text-center text-gray-400">Loading data...</td></tr>
                                        ) : completedGifts.length === 0 ? (
                                            <tr><td colSpan={2} className="p-8 text-center text-gray-400">No gifts recorded yet.</td></tr>
                                        ) : (
                                            completedGifts.map((gift) => (
                                                <tr key={gift.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="p-4">
                                                        <p className="font-serif text-base text-gray-900 leading-tight">
                                                            {gift.sender_name || "Anonymous"}
                                                        </p>
                                                        <p className="text-xs text-gray-500 font-mono mt-1">
                                                            +{gift.phone}
                                                        </p>
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <p className="font-medium text-green-600 leading-tight">
                                                            KES {gift.amount.toLocaleString()}
                                                        </p>
                                                        <p className="text-[10px] text-gray-400 font-mono uppercase mt-1">
                                                            {gift.receipt_number || "PENDING"}
                                                        </p>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Mobile Logout (shown at bottom on mobile) */}
                <button
                    onClick={() => {
                        sessionStorage.removeItem("isAdminAuthed");
                        setIsAuthenticated(false);
                        setPasscode("");
                    }}
                    className="w-full py-3 border border-gray-300 rounded-full text-xs uppercase tracking-widest text-gray-600 hover:bg-gray-100 transition-colors md:hidden"
                >
                    Logout
                </button>

            </div>
        </div>
    );
}

// Stat Card
function CompactStatCard({ title, value, highlight = false }: { title: string, value: number, highlight?: boolean }) {
    return (
        <div className={`p-4 md:p-5 rounded-xl border ${highlight ? 'bg-primary border-primary text-[#fffdf7]' : 'bg-white border-gray-100 text-gray-900'}`}>
            <h3 className={`text-[10px] md:text-xs uppercase tracking-widest mb-1 ${highlight ? 'text-[#fffdf7]/80' : 'text-gray-400'}`}>
                {title}
            </h3>
            <p className="text-2xl md:text-3xl font-serif">
                {value}
            </p>
        </div>
    );
}

// Expandable Row Component
function RSVPRow({ rsvp }: { rsvp: RSVP }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasExtras = rsvp.extra_guests_count > 0 && rsvp.is_attending;

    return (
        <>
            <tr
                onClick={() => hasExtras && setIsExpanded(!isExpanded)}
                className={`transition-colors ${hasExtras ? "cursor-pointer hover:bg-gray-50" : "hover:bg-gray-50/50"}`}
            >
                <td className="p-4 font-serif text-base md:text-lg text-gray-800">{rsvp.name}</td>

                <td className="p-4 text-center">
                    <span className={`inline-block px-2 py-1 rounded-md text-[10px] md:text-xs font-medium tracking-wide uppercase ${rsvp.is_attending ? "bg-green-50 text-green-600 border border-green-100" : "bg-red-50 text-red-500 border border-red-100"
                        }`}>
                        {rsvp.is_attending ? "Attending" : "Not Attending"}
                    </span>
                </td>

                <td className="p-4 text-center text-gray-600 text-sm md:text-base">
                    {rsvp.is_attending ? 1 + rsvp.extra_guests_count : 0}
                </td>

                <td className="p-4 text-right">
                    {hasExtras ? (
                        <button className="p-2 text-gray-400 hover:text-primary transition-colors">
                            <motion.svg
                                animate={{ rotate: isExpanded ? 180 : 0 }}
                                className="w-5 h-5 inline-block"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </motion.svg>
                        </button>
                    ) : (
                        <span className="text-gray-300 text-sm">-</span>
                    )}
                </td>
            </tr>

            {/* Expandable Sub-Row for Extra Guests */}
            <AnimatePresence>
                {isExpanded && hasExtras && (
                    <motion.tr
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        <td colSpan={4} className="p-0 border-none">
                            <div className="bg-gray-50 px-6 py-4 border-l-2 mx-4 my-2 rounded-r-lg border-primary">
                                <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Extra Guests</p>
                                <ul className="space-y-1">
                                    {rsvp.extra_guest_names.map((guestName, idx) => (
                                        <li key={idx} className="text-sm text-gray-700 font-serif flex items-center gap-2">
                                            <div className="w-1 h-1 rounded-full bg-primary/40" />
                                            {guestName}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </td>
                    </motion.tr>
                )}
            </AnimatePresence>
        </>
    );
}