"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { siteConfig } from "@/config/weddingConfig";

// TYPEWRITER HELPER
const TypewriterText = ({ text, isOpen, delay = 0, className = "" }: { text: string, isOpen: boolean, delay?: number, className?: string }) => {
    const characters = Array.from(text);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: delay },
        },
    };

    const charVariants = {
        hidden: { opacity: 0, display: "none" },
        visible: { opacity: 1, display: "inline-block" },
    };

    return (
        <motion.span variants={containerVariants} initial="hidden" animate={isOpen ? "visible" : "hidden"} className={className}>
            {characters.map((char, index) => (
                <motion.span key={index} variants={charVariants}>
                    {char === " " ? "\u00A0" : char}
                </motion.span>
            ))}
        </motion.span>
    );
};

// MAIN CURTAINS
interface CurtainsProps {
    onOpenComplete: () => void;
}

export default function Curtains({ onOpenComplete }: CurtainsProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => {
        if (isOpen) return;
        setIsOpen(true);

        // Slow dramatic reveal
        setTimeout(() => {
            onOpenComplete();
        }, 8000);
    };

    // SVG PATH KEYFRAMES (0 to 1 objectBoundingBox coordinates)
    const leftPath = {
        closed: "M 0 0 L 1 0 Q 1 0.5 1 1 L 0 1 Z",
        open: [
            "M 0 0 L 1 0 Q 1 0.5 1 1 L 0 1 Z",              // 0% - Start
            "M 0 0 L 0.5 0 Q 0.1 0.5 0.5 1 L 0 1 Z",        // 40% - Pulling middle hard
            "M 0 0 L 0.1 0 Q -0.1 0.5 0.1 1 L 0 1 Z",       // 70% - Over-pull (Sway left)
            "M 0 0 L 0.25 0 Q 0.1 0.5 0.25 1 L 0 1 Z",      // 100% - Settle
        ]
    };

    const rightPath = {
        closed: "M 0 0 L 1 0 L 1 1 L 0 1 Q 0 0.5 0 0 Z",
        open: [
            "M 0 0 L 1 0 L 1 1 L 0 1 Q 0 0.5 0 0 Z",          // 0% - Start
            "M 0.5 0 L 1 0 L 1 1 L 0.5 1 Q 0.9 0.5 0.5 0 Z",  // 40% - Pulling middle hard
            "M 0.9 0 L 1 0 L 1 1 L 0.9 1 Q 1.1 0.5 0.9 0 Z",  // 70% - Over-pull (Sway right)
            "M 0.75 0 L 1 0 L 1 1 L 0.75 1 Q 0.9 0.5 0.75 0 Z", // 100% - Settle
        ]
    };

    return (
        <div className="relative w-full h-screen overflow-hidden flex items-center justify-center">

            {/* Inline SVGs to define clipping masks */}
            <svg className="absolute w-0 h-0">
                <defs>
                    <clipPath id="left-curtain-clip" clipPathUnits="objectBoundingBox">
                        <motion.path
                            initial="closed"
                            animate={isOpen ? "open" : "closed"}
                            variants={{ closed: { d: leftPath.closed }, open: { d: leftPath.open as any } }}
                            transition={{ duration: 4.5, ease: "easeInOut", times: [0, 0.4, 0.7, 1] }}
                        />
                    </clipPath>
                    <clipPath id="right-curtain-clip" clipPathUnits="objectBoundingBox">
                        <motion.path
                            initial="closed"
                            animate={isOpen ? "open" : "closed"}
                            variants={{ closed: { d: rightPath.closed }, open: { d: rightPath.open as any } }}
                            transition={{ duration: 4.5, ease: "easeInOut", times: [0, 0.4, 0.7, 1] }}
                        />
                    </clipPath>
                </defs>
            </svg>

            {/* REVEALED BACKGROUND */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 backdrop-blur-xl bg-[#fffdf7]/40">
                {/* Subtle radial glow to highlight the text */}
                <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(circle at center, #d9bf91 0%, transparent 60%)' }} />

                <div className="z-20 text-center px-4">
                    <h2 className="text-4xl md:text-6xl font-serif text-primary mb-4 drop-shadow-sm">
                        <TypewriterText text={siteConfig.coupleNames.toUpperCase()} isOpen={isOpen} delay={1.5} />
                    </h2>
                    <p className="text-xl tracking-widest text-gray-800 mb-6 font-light">
                        <TypewriterText text="ARE GETTING MARRIED" isOpen={isOpen} delay={3.0} />
                    </p>
                    <p className="text-2xl font-serif text-primary/80 italic">
                        <TypewriterText text="You are invited!" isOpen={isOpen} delay={5.5} />
                    </p>
                </div>
            </div>

            {/* LEFT CURTAIN  */}
            <div
                className="absolute left-0 top-0 w-1/2 h-full z-20 pointer-events-none drop-shadow-[10px_0_20px_rgba(0,0,0,0.5)]"
                style={{ clipPath: "url(#left-curtain-clip)" }}
            >
                <div className="absolute inset-0 bg-primary" />
                {/* Simulate folds compressing */}
                <motion.div
                    className="absolute inset-0 origin-left opacity-70"
                    initial={{ scaleX: 1 }}
                    animate={{ scaleX: isOpen ? 0.35 : 1 }}
                    transition={{ duration: 4.5, ease: "easeInOut", times: [0, 0.4, 0.7, 1] }}
                    style={{
                        background: `repeating-linear-gradient(90deg, rgba(0,0,0,0.6) 0%, rgba(255,255,255,0.1) 8%, rgba(0,0,0,0.5) 16%, rgba(255,255,255,0.05) 24%, rgba(0,0,0,0.6) 32%)`
                    }}
                />
            </div>

            {/* RIGHT CURTAIN */}
            <div
                className="absolute right-0 top-0 w-1/2 h-full z-20 pointer-events-none drop-shadow-[-10px_0_20px_rgba(0,0,0,0.5)]"
                style={{ clipPath: "url(#right-curtain-clip)" }}
            >
                <div className="absolute inset-0 bg-primary" />
                {/* Inner texture physically squishes to the right */}
                <motion.div
                    className="absolute inset-0 origin-right opacity-70"
                    initial={{ scaleX: 1 }}
                    animate={{ scaleX: isOpen ? 0.35 : 1 }}
                    transition={{ duration: 4.5, ease: "easeInOut", times: [0, 0.4, 0.7, 1] }}
                    style={{
                        background: `repeating-linear-gradient(90deg, rgba(0,0,0,0.6) 0%, rgba(255,255,255,0.1) 8%, rgba(0,0,0,0.5) 16%, rgba(255,255,255,0.05) 24%, rgba(0,0,0,0.6) 32%)`
                    }}
                />
            </div>

            {/* TRIGGER BUTTON */}
            <motion.button
                onClick={handleOpen}
                animate={isOpen ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="z-30 relative flex items-center justify-center cursor-pointer pointer-events-auto"
            >
                {/* Heart Container */}
                <div className="relative w-17 h-17 flex items-center justify-center p-2">

                    {/* HEART CSS SHAPE */}
                    <div
                        className="absolute inset-0 bg-[#7a1010] border border-[#4a0808] before:content-[''] before:absolute before:inset-0 before:bg-[#7a1010] before:rounded-full before:-translate-y-1/2 after:content-[''] after:absolute after:inset-0 after:bg-[#7a1010] after:rounded-full after:translate-x-1/2"
                        style={{
                            transform: 'rotate(-45deg)',
                            boxShadow: "inset -5px -5px 15px rgba(0,0,0,0.6), inset 2px 2px 8px rgba(255,100,100,0.15), 0 10px 25px rgba(0,0,0,0.5)"
                        }}
                    />

                    {/* Initials + CTA in heart */}
                    <div className="z-10 flex flex-col items-center justify-center select-none leading-none">
                        <span className="text-[#e0aa3e] font-calligraphy text-[20px] mt-[-2px] drop-shadow-md">
                            {siteConfig.coupleNames.split('&').map(name => name.trim()[0]).join(' & ')}
                        </span>
                        <span className="text-[#e0aa3e] text-[7px] uppercase tracking-[0.18em] mt-5 drop-shadow-md">
                            OPEN
                        </span>
                    </div>

                </div>
            </motion.button>

        </div>
    );
}