"use client";

import { useRef, ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ScrollRevealProps {
    children: ReactNode;
    className?: string;
}

export default function ScrollReveal({ children, className = "" }: ScrollRevealProps) {
    const ref = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start 70%", "end 30%"],
    });

    const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);
    const y = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [100, 0, 0, -100]);

    return (
        <motion.div
            ref={ref}
            style={{ opacity, y, position: "relative" }}
            // Prepend relative to whatever classes are passed in
            className={`relative ${className}`}
        >
            {children}
        </motion.div>
    );
}