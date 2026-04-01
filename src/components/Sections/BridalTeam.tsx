"use client";

import { siteConfig } from "@/config/weddingConfig";
import ScrollReveal from "@/components/Layout/ScrollReveal";

export default function BridalTeam() {
    return (
        <section className="relative min-h-screen flex items-center justify-center py-24 px-6 md:px-12 z-10">
            <ScrollReveal className="max-w-6xl mx-auto w-full flex flex-col items-center">

                {/* Section header */}
                <div className="text-center space-y-2 mb-20">
                    <h3 className="font-calligraphy text-4xl md:text-5xl text-primary drop-shadow-sm">
                        Our Bridal Team
                    </h3>
                    <div className="w-30 h-[1px] bg-primary/50 mx-auto mt-2" />
                </div>

                {/* Typography grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-12 w-full max-w-5xl">
                    {siteConfig.content.bridalTeam.map((person, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center text-center space-y-1 group"
                        >
                            <h4 className="text-3xl font-serif text-gray-900 group-hover:text-primary transition-colors duration-300">
                                {person.name}
                            </h4>

                            <div className="flex flex-col items-center space-y-3">
                                <span className="text-sm font-light text-primary uppercase tracking-[0.2em]">
                                    {person.role}
                                </span>
                                {/* Decorative dot under each role */}
                                <div className="w-1 h-1 rounded-full bg-primary/40" />
                            </div>
                        </div>
                    ))}
                </div>

            </ScrollReveal>
        </section>
    );
}