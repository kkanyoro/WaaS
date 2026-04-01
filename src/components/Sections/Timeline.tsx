"use client";

import { siteConfig } from "@/config/weddingConfig";
import ScrollReveal from "@/components/Layout/ScrollReveal";

// SMART ICON HELPER
// Reads the event title and returns a matching minimalist SVG icon
const getEventIcon = (eventName: string) => {
    const name = eventName.toLowerCase();
    const iconClass = "w-4 h-4 text-primary";

    // Arrival / Welcome / Seating / Church(church icon)
    if (name.includes("arrival") || name.includes("welcome") || name.includes("seating") || name.includes("church")) {
        return (
            <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v5" />
                <path d="M10 5h4" />
                <path d="M7 10l5-5 5 5" />
                <path d="M5 10h14v10H5z" />
                <path d="M10 20v-4h4v4" />
            </svg>
        );
    }




    // Rings / Ceremony
    if (name.includes("ceremony") || name.includes("vow") || name.includes("ring")) {
        return (
            <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="12" r="6" />
                <circle cx="15" cy="12" r="6" />
            </svg>
        );
    }
    // Drinks / Cocktail Hour
    if (name.includes("cocktail") || name.includes("drink") || name.includes("bar")) {
        return (
            <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 22h8 M12 11v11 M3 3l18 0l-7 8v0l-4 0l-7-8z" />
            </svg>
        );
    }
    // Dinner / Food
    if (name.includes("dinner") || name.includes("eat") || name.includes("reception") || name.includes("food")) {
        return (
            <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2 M7 2v20 M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
            </svg>
        );
    }
    // Music / Dancing / Party
    if (name.includes("dance") || name.includes("party") || name.includes("music") || name.includes("dj")) {
        return (
            <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18V5l12-2v13 M9 9l12-2 M6 15a3 3 0 1 0 3 3v-3H6Zm12-2a3 3 0 1 0 3 3v-3h-3Z" />
            </svg>
        );
    }
    // Photos
    if (name.includes("photo") || name.includes("picture")) {
        return (
            <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z M12 13m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0" />
            </svg>
        );
    }
    // Default Fallback
    return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
    );
};

export default function Timeline() {
    return (
        <section className="relative min-h-screen flex items-center justify-center py-24 px-6 md:px-12 z-10 bg-[#fffdf7]/50">
            <ScrollReveal className="max-w-4xl mx-auto w-full flex flex-col items-center">

                {/* Section Header */}
                <div className="text-center space-y-2 mb-16">
                    <h3 className="font-calligraphy text-4xl md:text-5xl text-primary drop-shadow-sm">
                        Order of Events
                    </h3>
                    <div className="w-30 h-[1px] bg-primary/50 mx-auto mt-2" />
                </div>

                {/* The Timeline Container */}
                <div className="relative w-full max-w-2xl mx-auto">
                    {/* The vertical line running down the middle */}
                    <div className="absolute left-[19px] md:left-1/2 top-0 bottom-0 w-[1px] bg-primary/30 md:-translate-x-1/2" />

                    <div className="space-y-12">
                        {siteConfig.content.schedule.map((item, index) => {
                            const isEven = index % 2 === 0;

                            return (
                                <div key={index} className="relative flex items-center md:justify-between w-full">

                                    {/* Icon container */}
                                    <div className="absolute left-0 md:left-1/2 w-10 h-10 rounded-full bg-[#fffdf7] border border-primary/40 shadow-sm md:-translate-x-1/2 z-10 flex items-center justify-center">
                                        {getEventIcon(item.event)}
                                    </div>

                                    {/* Desktop empty spacer */}
                                    <div className="hidden md:block w-5/12" />

                                    {/* Content card */}
                                    <div className={`w-full pl-14 md:pl-0 md:w-5/12 ${isEven ? "md:text-right md:pr-14 md:mr-auto" : "md:text-left md:pl-14 md:ml-auto"}`}>
                                        <span className="font-calligraphy text-2xl text-primary mb-1 block">
                                            {item.time}
                                        </span>
                                        <h4 className="text-xl font-serif font-bold text-gray-900 mb-2">
                                            {item.event}
                                        </h4>
                                        {item.description && (
                                            <p className="text-gray-600 font-light text-sm leading-relaxed">
                                                {item.description}
                                            </p>
                                        )}
                                    </div>

                                </div>
                            );
                        })}
                    </div>
                </div>

            </ScrollReveal>
        </section>
    );
}