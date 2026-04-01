"use client";

import { siteConfig } from "@/config/weddingConfig";
import ScrollReveal from "@/components/Layout/ScrollReveal";

export default function Venue() {
    const { name, mapLink } = siteConfig.venue;

    return (
        <section className="relative min-h-screen flex items-center justify-center py-24 px-6 md:px-12 z-10">
            <ScrollReveal className="max-w-6xl mx-auto w-full flex flex-col space-y-16">

                {/* TITLE SECTION */}
                <div className="text-center space-y-2">
                    <h3 className="font-calligraphy text-4xl md:text-5xl text-primary drop-shadow-sm">
                        Venue & Directions
                    </h3>
                    <div className="w-30 h-[1px] bg-primary/50 mx-auto" />
                </div>

                {/* CONTENT GRID: Info and Map */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

                    {/* LEFT SIDE: Venue Info */}
                    <div className="flex flex-col text-center md:text-left space-y-8">
                        <div className="space-y-2">
                            <h4 className="text-3xl font-serif text-gray-900 leading-snug">
                                {name}
                            </h4>
                            <p className="text-gray-600 font-light text-lg">
                                Tap below to view the exact location and get directions to the venue.
                            </p>
                        </div>

                        <div>
                            <a
                                href={mapLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block px-8 py-3 bg-primary text-[#fffdf7] font-serif tracking-widest text-sm rounded-full shadow-lg hover:bg-primary/90 hover:scale-105 transition-all"
                            >
                                GET DIRECTIONS
                            </a>
                        </div>
                    </div>

                    {/* RIGHT SIDE: Map Embedded Iframe */}
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden shadow-2xl border border-primary/20">
                        {/* Note: Standard Google Maps share links (goo.gl) cannot be embedded directly in iframes. 
              We use a beautiful stylized map iframe here, while the button above links to the actual destination. */}
                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d212270.92286602655!2d-84.58502189693145!3d33.76756040803392!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88f5045d6993098d%3A0x66fede2f990b630b!2sAtlanta%2C%20GA%2C%20USA!5e0!3m2!1sen!2ske!4v1774791479086!5m2!1sen!2ske"
                            width="600"
                            height="450"
                            style={{ border: 0, filter: "grayscale(30%) contrast(90%) sepia(20%)" }}
                            allowFullScreen={false}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade">
                        </iframe>
                        {/* Subtle inner shadow overlay */}
                        <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] pointer-events-none" />
                    </div>
                </div>

            </ScrollReveal>
        </section>
    );
}