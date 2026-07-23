"use client";

import { useRef, useState } from "react";
import { siteConfig } from "@/config/weddingConfig";
import { useCountdown } from "@/hooks/useCountdown";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import ScratchCard from "@/components/UI/ScratchCard";

export default function Hero() {
    const containerRef = useRef<HTMLElement>(null);
    const { days, hours, minutes, seconds } = useCountdown(siteConfig.weddingDate);

    const [monthScratched, setMonthScratched] = useState(false);
    const [dayScratched, setDayScratched] = useState(false);
    const [yearScratched, setYearScratched] = useState(false);

    const isDateFullyRevealed = monthScratched && dayScratched && yearScratched;

    const weddingDateObj = new Date(siteConfig.weddingDate);
    const dateData = {
        month: weddingDateObj.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
        day: weddingDateObj.toLocaleDateString("en-US", { day: "2-digit" }),
        year: weddingDateObj.toLocaleDateString("en-US", { year: "numeric" }),
    };

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });
    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
    const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

    return (
        <section
            ref={containerRef}
            // CHANGED: Increased pt-4 md:pt-8 to pt-12 md:pt-16 for more top space
            className="relative flex flex-col items-center justify-center min-h-[calc(100dvh-4rem)] md:min-h-[calc(100dvh-5rem)] px-4 pt-12 md:pt-16 pb-32 text-center z-10 bg-[#fffdf7]/50"
        >
            <motion.div
                style={{ opacity, y }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
                className="max-w-4xl mx-auto space-y-8 w-full"
            >
                <p className="text-xl md:text-2xl tracking-[0.2em] uppercase text-primary">
                    Save the Date!
                </p>

                <h1 className="text-6xl md:text-8xl font-serif text-primary drop-shadow-sm pb-4">
                    {siteConfig.coupleNames}
                </h1>

                {/* Scratch to Reveal */}
                <div className="flex flex-col items-center my-10 max-w-2xl mx-auto w-full">
                    <p className="text-xs md:text-sm uppercase tracking-[0.2em] text-primary/80 mb-6">
                        Scratch to reveal wedding date and location
                    </p>

                    <div className="flex flex-row items-center justify-center gap-3 md:gap-6 w-full">
                        {/* Month Segment */}
                        <ScratchCard onComplete={() => setMonthScratched(true)}>
                            <div className="w-24 h-24 md:w-32 md:h-32 flex items-center justify-center rounded-full bg-[#fffdf7] font-calligraphy text-primary text-3xl md:text-5xl shadow-sm">
                                {dateData.month}
                            </div>
                        </ScratchCard>

                        {/* Day Segment */}
                        <ScratchCard onComplete={() => setDayScratched(true)}>
                            <div className="w-24 h-24 md:w-32 md:h-32 flex items-center justify-center rounded-full bg-[#fffdf7] text-primary font-calligraphy text-3xl md:text-5xl shadow-sm">
                                {dateData.day}
                            </div>
                        </ScratchCard>

                        {/* Year Segment */}
                        <ScratchCard onComplete={() => setYearScratched(true)}>
                            <div className="w-24 h-24 md:w-32 md:h-32 flex items-center justify-center rounded-full bg-[#fffdf7] text-primary font-calligraphy text-3xl md:text-5xl shadow-sm">
                                {dateData.year}
                            </div>
                        </ScratchCard>
                    </div>
                </div>

                {/* Reveal venue */}
                <AnimatePresence>
                    {isDateFullyRevealed && (
                        <motion.div
                            initial={{ opacity: 0, height: 0, y: 10 }}
                            animate={{ opacity: 1, height: "auto", y: 0 }}
                            transition={{ duration: 1 }}
                            className="text-2xl md:text-3xl font-light text-foreground/80 flex items-center justify-center gap-2 overflow-hidden"
                        >
                            <div className="w-6 h-6 text-primary flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
                                </svg>
                            </div>
                            <div className="text-primary font-serif tracking-wide text-2xl md:text-3xl">
                                {siteConfig.venue.name}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Countdown */}
                <div className="pt-10">
                    <div className="inline-block relative p-4 px-6 md:px-12 border border-primary/20 rounded-t-full rounded-b-lg shadow-[0_10px_30px_rgba(0,0,0,0.1)] bg-[#fffdf7]/50 backdrop-blur-sm">
                        <h2 className="text-2xl md:text-4xl font-calligraphy text-primary mb-6 drop-shadow-sm">
                            COUNTDOWN
                        </h2>
                        <div className="flex items-center justify-center gap-3 md:gap-8">
                            {[
                                { label: "Days", value: days },
                                { label: "Hours", value: hours },
                                { label: "Minutes", value: minutes },
                                { label: "Seconds", value: seconds },
                            ].map((item, index) => (
                                <div key={item.label} className="flex items-center">
                                    <div className="flex flex-col items-center min-w-[60px] md:min-w-[70px]">
                                        <span className="text-4xl md:text-6xl font-serif text-primary mb-2 drop-shadow-sm">
                                            {item.value}
                                        </span>
                                        <span className="text-[10px] md:text-xs tracking-widest uppercase text-foreground/60">
                                            {item.label}
                                        </span>
                                    </div>
                                    {index < 3 && <div className="hidden md:block w-[1px] h-12 bg-primary/50 ml-6" />}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Absolute positioned bouncing scroll indicator */}
            {/* CHANGED: Increased bottom-8 to bottom-24 md:bottom-32 to raise it higher */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-24 md:bottom-32 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-primary/70 animate-bounce"
            >
                <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium text-center">
                    Scroll for details
                </span>
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </motion.div>
        </section>
    );
}