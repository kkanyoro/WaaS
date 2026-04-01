"use client";

import { useState } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { siteConfig } from "@/config/weddingConfig";

type EmblemType = "rose" | "heart" | "star" | "initials";

interface EnvelopeProps {
    onOpenComplete: () => void;
    emblem?: EmblemType;
}

const TypewriterText = ({ text, isOpen, delay = 0, className = "" }: { text: string, isOpen: boolean, delay?: number, className?: string }) => {
    const characters = Array.from(text);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1, // Speed of the typing
                delayChildren: delay,  // When to start typing
            },
        },
    };

    const charVariants = {
        hidden: { opacity: 0, display: "none" },
        visible: { opacity: 1, display: "inline-block" },
    };

    return (
        <motion.span
            variants={containerVariants}
            initial="hidden"
            animate={isOpen ? "visible" : "hidden"}
            className={className}
        >
            {characters.map((char, index) => (
                <motion.span key={index} variants={charVariants}>
                    {/* Replace standard spaces with non-breaking spaces so words don't collapse */}
                    {char === " " ? "\u00A0" : char}
                </motion.span>
            ))}
        </motion.span>
    );
};

export default function Envelope({
    onOpenComplete,
    emblem = "initials",
}: EnvelopeProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Cursor-based lighting
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springConfig = { damping: 25, stiffness: 150 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    const rotateX = useTransform(springY, [-200, 200], [8, -8]);
    const rotateY = useTransform(springX, [-200, 200], [-8, 8]);

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left - rect.width / 2);
        mouseY.set(e.clientY - rect.top - rect.height / 2);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    const handleOpen = () => {
        if (isOpen) return;
        setIsOpen(true);
        setTimeout(() => onOpenComplete(), 8000);
    };

    const getInitials = () => {
        const names = siteConfig.coupleNames.split("&");
        if (names.length === 2) {
            return `${names[0].trim()[0]}&${names[1].trim()[0]}`;
        }
        return siteConfig.coupleNames.substring(0, 2).toUpperCase();
    };

    const renderEmblem = () => {
        if (emblem === "initials") {
            return (
                <span
                    className="text-sm font-serif text-[#5a0d0d] font-bold tracking-tighter opacity-80"
                    style={{ textShadow: "0px 1px 1px rgba(255,255,255,0.2)" }}
                >
                    {getInitials()}
                </span>
            );
        }
        return (
            <svg viewBox="0 0 24 24" className="w-6 h-6 opacity-80">
                <path
                    d="M12 21s-7-4.5-9-9 2-7 5-4c2-3 6-3 8 0 3-3 7 1 5 5-2 4.5-9 8-9 8z"
                    fill="none" stroke="#5a0d0d" strokeWidth="1.5"
                />
            </svg>
        );
    };

    return (
        <div
            className="relative w-[90%] max-w-xl h-80 md:h-[420px] flex items-center justify-center perspective-[1500px]"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <motion.div
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                className="relative w-full h-[80%]"
            >

                {/* Back of Envelope (Deepest Layer) */}
                <div
                    className="absolute inset-0 rounded-md shadow-[0_20px_40px_rgba(0,0,0,0.5)] z-0 bg-[#dcc49a]"
                    style={{
                        backgroundImage: `repeating-linear-gradient(45deg, rgba(0,0,0,0.02) 0px, rgba(0,0,0,0.02) 2px, transparent 2px, transparent 4px)
            `,
                    }}
                />

                {/* Letter */}
                <div className="absolute inset-x-0 bottom-2 top-4 flex justify-center z-10 pointer-events-none">
                    <motion.div
                        initial={{ y: 0 }}
                        animate={{ y: isOpen ? -200 : 0 }}
                        transition={{ delay: 0.5, duration: 2, ease: "easeInOut" }}
                        className="w-[85%] h-full bg-[#b39968] rounded-md shadow-xl p-6 flex flex-col items-center justify-start pt-12"
                        style={{
                            backgroundImage: `repeating-linear-gradient(0deg, rgba(0,0,0,0.03) 0px, rgba(0,0,0,0.03) 1px, transparent 1px, transparent 6px)
              `,
                        }}
                    >
                        <h2 className="text-4xl md:text-4xl font-serif text-primary mb-4 drop-shadow-sm">
                            <TypewriterText text={siteConfig.coupleNames.toUpperCase()} isOpen={isOpen} delay={1.5} />
                        </h2>
                        <p className="text-xl tracking-widest text-gray-800 mb-6 font-light">
                            <TypewriterText text="ARE GETTING MARRIED" isOpen={isOpen} delay={2.5} />
                        </p>
                        <p className="text-2xl font-serif text-primary/80 italic">
                            <TypewriterText text="You are invited!" isOpen={isOpen} delay={5.0} />
                        </p>
                    </motion.div>
                </div>

                {/* Front Flaps */}
                <div className="absolute inset-0 pointer-events-none rounded-md overflow-hidden z-20">

                    {/* Left Flap */}
                    <div className="absolute inset-0 drop-shadow-[3px_0_5px_rgba(0,0,0,0.15)]">
                        <div className="absolute inset-0 bg-[#dcc49a] [clip-path:polygon(0_0,55%_55%,0_100%)]" />
                    </div>

                    {/* Right Flap */}
                    <div className="absolute inset-0 drop-shadow-[-3px_0_5px_rgba(0,0,0,0.15)]">
                        <div className="absolute inset-0 bg-[#dcc49a] [clip-path:polygon(100%_0,100%_100%,45%_55%)]" />
                    </div>

                    {/* Bottom Flap (Sits on top of the side flaps) */}
                    <div className="absolute inset-0 drop-shadow-[0_-4px_6px_rgba(0,0,0,0.2)]">
                        <div className="absolute inset-0 bg-[#dcc49a] [clip-path:polygon(0_100%,100%_100%,50%_45%)]" />
                    </div>

                </div>

                {/* The Top Flap (Animates Open) */}
                <motion.div
                    className="absolute top-[1px] inset-x-0 h-[58%] origin-top drop-shadow-[0_4px_6px_rgba(0,0,0,0.2)]"
                    // Start at zIndex 30 in front of bottom flaps
                    initial={{ rotateX: 0, zIndex: 30 }}
                    animate={{
                        rotateX: isOpen ? 180 : 0,
                        // Drop to zIndex 5 when open behind the letter (z-10)
                        zIndex: isOpen ? 5 : 30
                    }}
                    transition={{
                        rotateX: { duration: 1 },
                        // Snap the zIndex change to the end of the animation
                        zIndex: { delay: 0.1, duration: 0 }
                    }}
                >
                    {/* Inner div handles the actual shape and color so the shadow isn't clipped */}
                    <div
                        className="absolute inset-0 bg-[#dcc49a]"
                        style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
                    />
                </motion.div>

                {/* Wax Seal */}
                <motion.button
                    onClick={handleOpen}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={isOpen ? { scale: 0, opacity: 0, transition: { duration: 0.4 } } : { scale: 1 }}
                    className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-40"
                >
                    <div
                        className="relative w-16 h-16 flex items-center justify-center"
                        style={{
                            borderRadius: "55% 45% 60% 40% / 50% 60% 40% 50%",
                            background: "linear-gradient(145deg,#b91c1c,#7f1010,#4a0808)",
                            boxShadow: "0 10px 15px rgba(0,0,0,0.5), inset 0 -5px 8px rgba(0,0,0,0.7), inset 0 4px 8px rgba(255,255,255,0.3)",
                        }}
                    >
                        <div
                            className="w-10 h-10 flex items-center justify-center"
                            style={{
                                borderRadius: "50%",
                                background: "radial-gradient(circle,#8f1a1a,#5a0d0d)",
                                boxShadow: "inset 0 4px 8px rgba(0,0,0,0.8)",
                            }}
                        >
                            {renderEmblem()}
                        </div>
                        <div className="absolute top-1 left-2 w-6 h-3 bg-white/20 blur-[2px] rounded-full rotate-[-20deg]" />
                    </div>
                </motion.button>

            </motion.div>
        </div>
    );
}