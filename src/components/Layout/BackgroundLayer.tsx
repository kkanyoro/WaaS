"use client";

import { siteConfig } from "@/config/weddingConfig";
import { motion } from "framer-motion";
import CanvasBackground from "./CanvasBackground";

export default function BackgroundLayer() {
    const { backgroundType, bgAsset } = siteConfig.features;

    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            {/* Fallback base color */}
            <div className="absolute inset-0 bg-background" />

            {/* Image Background */}
            {backgroundType === "image" && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.2 }}
                    transition={{ duration: 2 }}
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-multiply dark:mix-blend-screen dark:opacity-20"
                    style={{ backgroundImage: `url('${bgAsset}')` }}
                />
            )}

            {/* Canvas/Animation */}
            {backgroundType === "canvas" && (
                <>
                    {/* Blurred Background Image */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.8 }}
                        transition={{ duration: 2 }}
                        // Scale 105% prevents white borders when blurring an element
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-sm scale-105 opacity-80"
                        style={{
                            backgroundImage: bgAsset === "snow"
                                ? "url('https://plus.unsplash.com/premium_photo-1745177059210-161f7146fafe?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" // Moody winter forest
                                : "url('https://plus.unsplash.com/premium_photo-1745177059210-161f7146fafe?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"  // Dark enchanted forest
                        }}
                    />

                    {/* Particle Engine */}
                    <div className="absolute inset-0 opacity-100 mix-blend-screen">
                        <CanvasBackground />
                    </div>
                </>
            )}

            {/* Video option to be added */}

            {/* Subtle gradient overlay for text to be readable */}
            <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
        </div>
    );
}