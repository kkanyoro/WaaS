"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { siteConfig } from "@/config/weddingConfig";
import ScrollReveal from "@/components/Layout/ScrollReveal";

export default function Story() {
    const imageRef = useRef<HTMLDivElement>(null);

    // Track scroll progress specifically for the image parallax
    const { scrollYProgress } = useScroll({
        target: imageRef,
        // "start end" = top of section hits bottom of viewport
        // "end start" = bottom of section hits top of viewport
        offset: ["start end", "end start"],
    });

    // Slightly delayed image parallax effect
    const imageY = useTransform(scrollYProgress, [0, 1], [50, -50]);

    return (
        <section
            className="relative min-h-screen flex items-center justify-center py-24 px-6 md:px-12 z-10"
        >
            <ScrollReveal
                className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center"
            >

                {/* LEFT SIDE */}
                <div className="relative flex justify-center md:justify-end">
                    {/* Decorative background shape */}
                    <div className="absolute top-4 -left-4 w-full h-full max-w-[400px] border border-primary/30 rounded-t-full rounded-b-md z-0" />

                    <motion.div
                        ref={imageRef} // Attached ref for parallax tracking
                        style={{ y: imageY, position: "relative" }}
                        className="relative z-10 w-full max-w-[400px] aspect-[3/4] overflow-hidden rounded-t-full rounded-b-md shadow-2xl"
                    >
                        {/* Image */}
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: "url(images/story.jpg)" }}
                        />
                        {/* Subtle inner shadow to feel inset */}
                        <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.2)] pointer-events-none" />
                    </motion.div>
                </div>

                {/* RIGHT SIDE */}
                <div className="flex flex-col text-center md:text-left space-y-6">
                    <div className="space-y-2">
                        <h3 className="font-calligraphy text-4xl md:text-5xl text-primary drop-shadow-sm">
                            How we met
                        </h3>
                        <h2 className="text-3xl md:text-5xl font-serif tracking-wide text-gray-900">
                            OUR STORY
                        </h2>
                    </div>

                    <div className="w-16 h-[1px] bg-primary/50 mx-auto md:mx-0" />

                    {/* Split the story by paragraphs */}
                    <div className="space-y-4 text-gray-700 leading-relaxed font-light text-lg">
                        {siteConfig.content.story.split('\n').map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                        ))}
                    </div>
                </div>

            </ScrollReveal>
        </section>
    );
}