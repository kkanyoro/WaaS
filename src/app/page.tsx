"use client";

import { useState } from "react";
import { siteConfig } from "@/config/weddingConfig";
import { motion, AnimatePresence } from "framer-motion";

import Gatekeeper from "@/components/Entrance/Gatekeeper";
import BackgroundLayer from "@/components/Layout/BackgroundLayer";
import AudioPlayer from "@/components/Layout/AudioPlayer";
import FloatingRSVP from "@/components/RSVP/FloatingRSVP";

import Hero from "@/components/Sections/Hero";
import Story from "@/components/Sections/Story";
import Timeline from "@/components/Sections/Timeline";
import Venue from "@/components/Sections/Venue";
import BridalTeam from "@/components/Sections/BridalTeam";
import Guestbook from "@/components/Sections/Guestbook";
import Gallery from "@/components/Sections/Gallery";

const Navbar = () => {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      const navHeight = 60;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <nav className="fixed top-0 inset-x-0 z-40 bg-white/70 backdrop-blur-md border-b border-gray-100/50 shadow-sm transition-all duration-500">
      <ul className="flex justify-center gap-6 md:gap-12 py-4 text-[10px] md:text-xs tracking-widest uppercase text-gray-600 font-medium">
        <li><a href="#home" onClick={(e) => handleScroll(e, 'home')} className="hover:text-primary transition-colors">Home</a></li>
        <li><a href="#details" onClick={(e) => handleScroll(e, 'details')} className="hover:text-primary transition-colors">Details</a></li>
        <li><a href="#party" onClick={(e) => handleScroll(e, 'party')} className="hover:text-primary transition-colors">Wedding Party</a></li>
      </ul>
    </nav>
  );
};

const DressCode = () => (
  <section className="py-6 md:py-24 text-center flex flex-col items-center px-4">
    <h2 className="font-serif text-gray-900 mb-4">Dress Code</h2>
    <p className="text-gray-600 font-light mb-6 md:mb-8 max-w-lg mx-auto">{siteConfig.dressCode.description}</p>
    <div className="flex gap-4 md:gap-6 justify-center">
      {siteConfig.dressCode.colors.map(c => (
        <div key={c.name} className="flex flex-col items-center gap-2 md:gap-3">
          <div className="w-8 h-8 md:w-16 md:h-16 rounded-full shadow-inner border border-gray-200" style={{ backgroundColor: c.hex }} />
          <span className="text-[8px] md:text-[10px] uppercase tracking-widest text-gray-500">{c.name}</span>
        </div>
      ))}
    </div>
  </section>
);

const FAQs = () => (
  <section className="py-6 md:py-24 max-w-3xl mx-auto px-4">
    <h2 className="font-serif text-gray-900 mb-4 md:mb-8 text-center">FAQs</h2>
    <div className="space-y-4 md:space-y-6">
      {siteConfig.faqs.map((faq, i) => (
        <div key={i} className="border-b border-gray-200 pb-3 md:pb-4">
          <h4 className="font-serif text-base md:text-xl text-gray-800 mb-1 md:mb-2">{faq.question}</h4>
          <p className="text-xs md:text-base text-gray-600 font-light">{faq.answer}</p>
        </div>
      ))}
    </div>
  </section>
);

export default function Home() {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <main className="relative min-h-screen bg-transparent text-gray-900 overflow-x-hidden selection:bg-primary/30">
      <BackgroundLayer />
      <AudioPlayer />
      <FloatingRSVP />

      <Gatekeeper>
        <div className="relative z-10 w-full pt-16 md:pt-20">

          <Navbar />

          <div id="home" className="relative w-full">
            <Hero />
          </div>

          {/* THE REVEAL BUTTON */}
          <AnimatePresence>
            {!isRevealed && (
              <motion.div
                exit={{ opacity: 0, height: 0, scale: 0.9 }}
                className="flex justify-center pb-12 md:pb-24 pt-4 md:pt-8"
              >
                <button
                  onClick={() => setIsRevealed(true)}
                  className="px-8 py-3 border border-primary text-primary rounded-full uppercase tracking-widest text-xs font-medium hover:bg-primary hover:text-white transition-colors bg-white/50 backdrop-blur-sm"
                >
                  See Full Details
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* THE HIDDEN CONTENT */}
          <AnimatePresence>
            {isRevealed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="overflow-hidden [&_section]:!min-h-[50vh] md:[&_section]:!min-h-screen [&_section]:!py-8 md:[&_section]:!py-24 [&_.mb-12]:!mb-6 md:[&_.mb-12]:!mb-12 [&_h2]:!text-3xl md:[&_h2]:!text-5xl [&_h3]:!text-xl md:[&_h3]:!text-4xl [&_p]:!text-xs md:[&_p]:!text-base"
              >
                <Story />
                <Timeline />
                <Gallery />

                <div id="details">
                  <Venue />
                  <DressCode />
                  <FAQs />
                </div>

                <div id="party">
                  <BridalTeam />
                </div>

                <Guestbook />

                <div className="h-[15vh] flex items-center justify-center text-primary/50 font-serif text-lg md:text-3xl pb-20">
                  See you there.
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </Gatekeeper>
    </main>
  );
}