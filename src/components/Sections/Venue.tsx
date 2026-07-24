"use client";

import { siteConfig } from "@/config/weddingConfig";
import ScrollReveal from "@/components/Layout/ScrollReveal";

export default function Venue() {
    const { church, reception } = siteConfig.venues;

    return (
        <section className="relative min-h-screen flex items-center justify-center py-12 md:py-24 px-6 md:px-12 z-10">
            <ScrollReveal className="max-w-6xl mx-auto w-full flex flex-col space-y-12 md:space-y-16">

                <div className="text-center space-y-2">
                    <h3 className="font-calligraphy text-4xl md:text-5xl text-primary drop-shadow-sm">
                        Venues & Directions
                    </h3>
                    <div className="w-32 h-[1px] bg-primary/50 mx-auto" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">

                    {/* CHURCH */}
                    <div className="flex flex-col space-y-6">
                        <div className="text-center md:text-left space-y-2">
                            <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-primary/70 font-medium">
                                Church Service
                            </span>
                            <h4 className="text-2xl md:text-3xl font-serif text-gray-900 leading-snug">
                                {church.name}
                            </h4>
                            <p className="text-gray-600 font-light text-sm md:text-base">
                                Tap below to view the exact location and get directions to the church.
                            </p>
                        </div>

                        <div className="text-center md:text-left">
                            <a
                                href={church.mapLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block px-8 py-3 bg-primary text-[#fffdf7] font-serif tracking-widest text-xs md:text-sm rounded-full shadow-md hover:bg-primary/90 hover:scale-105 transition-all"
                            >
                                GET DIRECTIONS
                            </a>
                        </div>

                        {/* Church Map Embedded Iframe */}
                        <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden shadow-xl border border-primary/20 mt-4">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1447.1698344061122!2d37.072851557586525!3d-1.0420781590633785!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f4e8d76df125b%3A0x12999f3c96410432!2sChrisco%20Church%20-%20Thika%20(The%20Joyful%20Assembly)!5e0!3m2!1sen!2ske!4v1784930088254!5m2!1sen!2ske"
                                className="absolute inset-0 w-full h-full"
                                style={{ border: 0, filter: "grayscale(30%) contrast(90%) sepia(20%)" }}
                                allowFullScreen={false}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade">
                            </iframe>
                            <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] pointer-events-none" />
                        </div>
                    </div>

                    {/* RECEPTION  */}
                    <div className="flex flex-col space-y-6">
                        <div className="text-center md:text-left space-y-2">
                            <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-primary/70 font-medium">
                                Reception
                            </span>
                            <h4 className="text-2xl md:text-3xl font-serif text-gray-900 leading-snug">
                                {reception.name}
                            </h4>
                            <p className="text-gray-600 font-light text-sm md:text-base">
                                Tap below to view the exact location and get directions to the reception.
                            </p>
                        </div>

                        <div className="text-center md:text-left">
                            <a
                                href={reception.mapLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block px-8 py-3 bg-primary text-[#fffdf7] font-serif tracking-widest text-xs md:text-sm rounded-full shadow-md hover:bg-primary/90 hover:scale-105 transition-all"
                            >
                                GET DIRECTIONS
                            </a>
                        </div>

                        {/* Reception Map Embedded Iframe */}
                        <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden shadow-xl border border-primary/20 mt-4">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.207785784146!2d37.0777369!3d-1.0023554!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f4c55c0000001%3A0x3926f072e020c78c!2sKenya%20Agricultural%20Research%20Institute%20-%20Thika!5e0!3m2!1sen!2ske!4v1784714066514!5m2!1sen!2ske"
                                className="absolute inset-0 w-full h-full"
                                style={{ border: 0, filter: "grayscale(30%) contrast(90%) sepia(20%)" }}
                                allowFullScreen={false}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade">
                            </iframe>
                            <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] pointer-events-none" />
                        </div>
                    </div>

                </div>
            </ScrollReveal>
        </section>
    );
}