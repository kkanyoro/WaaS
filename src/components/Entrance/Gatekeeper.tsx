"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { siteConfig } from "@/config/weddingConfig";
import Envelope from "./Envelope";
import Curtains from "./Curtains";

export default function Gatekeeper({ children }: { children: React.ReactNode }) {
    // State to track if entrance animation is complete
    const [isEntered, setIsEntered] = useState(false);

    return (
        <>
            {/* Allow components to animate out */}
            <AnimatePresence>
                {!isEntered && (
                    <motion.div
                        key="entrance-gate"
                        // Fade entire entrance layer away when isEntered becomes true
                        exit={{ opacity: 0, transition: { duration: 1 } }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/5 backdrop-blur-sm"
                    >
                        {siteConfig.entrance.type === "envelope" ? (
                            <Envelope onOpenComplete={() => setIsEntered(true)} />
                        ) : (
                            <Curtains onOpenComplete={() => setIsEntered(true)} />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* The main website content. It's always there, just hidden behind the Gatekeeper initially */}
            <div className={isEntered ? "block" : "hidden md:block overflow-hidden h-screen"}>
                {children}
            </div>
        </>
    );
}