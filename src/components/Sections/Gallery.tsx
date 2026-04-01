"use client";

import { useRef, useEffect } from "react";
import { siteConfig } from "@/config/weddingConfig";
import ScrollReveal from "@/components/Layout/ScrollReveal";

export default function Gallery() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll logic
    useEffect(() => {
        const interval = setInterval(() => {
            if (scrollContainerRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;

                // If end, scroll back to beginning
                if (scrollLeft + clientWidth >= scrollWidth - 10) {
                    scrollContainerRef.current.scrollTo({ left: 0, behavior: "smooth" });
                } else {
                    // Otherwise, scroll right by one image width (approx 300px)
                    scrollContainerRef.current.scrollBy({ left: 320, behavior: "smooth" });
                }
            }
        }, 3000); // Scrolls every 3 seconds

        return () => clearInterval(interval);
    }, []);

    // Manual scroll buttons
    const scroll = (direction: "left" | "right") => {
        if (scrollContainerRef.current) {
            const scrollAmount = direction === "left" ? -320 : 320;
            scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    };

    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center py-24 z-10 overflow-hidden bg-[#fffdf7]/30">
            <ScrollReveal className="w-full flex flex-col items-center">

                {/* Section Header */}
                <div className="text-center space-y-2 mb-16 px-6">
                    <h3 className="font-calligraphy text-4xl md:text-5xl text-primary drop-shadow-sm">
                        Our Gallery
                    </h3>
                    <div className="w-30 h-[1px] bg-primary/50 mx-auto mt-2" />
                </div>

                {/* Scrolling Carousel */}
                <div className="relative w-full max-w-7xl mx-auto px-4 md:px-12 group">

                    {/* Desktop Navigation Arrows (Hidden on mobile) */}
                    <button
                        onClick={() => scroll("left")}
                        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur border border-primary/20 rounded-full items-center justify-center text-primary shadow-lg z-20 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>

                    <button
                        onClick={() => scroll("right")}
                        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur border border-primary/20 rounded-full items-center justify-center text-primary shadow-lg z-20 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>

                    {/* Image Container */}
                    <div
                        ref={scrollContainerRef}
                        className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-8 pt-4 px-4"
                    >
                        {siteConfig.gallery.images.map((src, index) => (
                            <div
                                key={index}
                                className="snap-center shrink-0 w-[280px] md:w-[350px] aspect-[4/5] rounded-2xl overflow-hidden shadow-md border border-gray-100 relative group/img"
                            >
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover/img:scale-110"
                                    style={{ backgroundImage: `url(${src})` }}
                                />
                                {/* Subtle overlay for depth */}
                                <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.1)] pointer-events-none" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* The Guest Upload CTA */}
                <div className="mt-16 px-6 max-w-2xl text-center">
                    <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-primary/10 relative overflow-hidden">
                        {/* Decorative watermark icon */}
                        <svg className="absolute -right-8 -bottom-8 w-40 h-40 text-primary/5 rotate-12 pointer-events-none" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M4 4h16v16H4V4zm2 4v10h12V8H6zm3 2h6v2H9v-2zm0 4h4v2H9v-2z" />
                        </svg>

                        <h4 className="text-2xl font-serif text-gray-900 mb-3 relative z-10">
                            Capture the Magic
                        </h4>
                        <p className="text-gray-600 font-light mb-8 relative z-10">
                            We know you'll be taking beautiful photos too! Help us build our memory collection by uploading your snaps directly to our shared album.
                        </p>

                        <a
                            href={siteConfig.gallery.guestAlbumLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-[#fffdf7] rounded-full text-sm uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 relative z-10"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            Upload Your Photos
                        </a>
                    </div>
                </div>

            </ScrollReveal>
        </section>
    );
}