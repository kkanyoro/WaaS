"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { siteConfig } from "@/config/weddingConfig";
import Gatekeeper from "@/components/Entrance/Gatekeeper";
import BackgroundLayer from "@/components/Layout/BackgroundLayer";
import AudioPlayer from "@/components/Layout/AudioPlayer";
import FloatingRSVP from "@/components/RSVP/FloatingRSVP";

import Hero from "@/components/Sections/Hero";
import Story from "@/components/Sections/Story";
import Timeline from "@/components/Sections/Timeline";
import Venue from "@/components/Sections/Venue";
import Guestbook from "@/components/Sections/Guestbook";
import Gallery from "@/components/Sections/Gallery";
import GiftingModal from "@/components/Sections/Gifting";

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
        <li><a href="#guestbook" onClick={(e) => handleScroll(e, 'guestbook')} className="hover:text-primary transition-colors">GuestBook</a></li>
      </ul>
    </nav>
  );
};

const FAQs = () => {
  const [isFaqGiftOpen, setIsFaqGiftOpen] = useState(false);

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="py-6 md:py-24 max-w-3xl mx-auto px-4 bg-[#fffdf7]/50"
    >
      <h2 className="font-serif text-gray-900 mb-4 md:mb-8 text-center">FAQs</h2>
      <div className="space-y-4 md:space-y-6">

        {/* Dress Code */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0, ease: "easeOut" }}
          className="border-b border-gray-200 pb-4 md:pb-6"
        >
          <h4 className="font-serif text-base md:text-xl text-gray-800 mb-2">What is the dress code?</h4>
          <p className="text-xs md:text-base text-gray-600 font-light mb-4">{siteConfig.dressCode.description}</p>
          <div className="flex gap-4 md:gap-6">
            {siteConfig.dressCode.colors.map(c => (
              <div key={c.name} className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 md:w-12 md:h-12 rounded-full shadow-inner border border-gray-200" style={{ backgroundColor: c.hex }} />
                <span className="text-[8px] md:text-[10px] uppercase tracking-widest text-gray-500">{c.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {siteConfig.faqs.map((faq, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: (i + 1) * 0.15, ease: "easeOut" }}
            className="border-b border-gray-200 pb-4 md:pb-6 leading-relaxed"
          >
            <h4 className="font-serif text-sm md:text-lg text-gray-800 mb-1.5 md:mb-2.5 tracking-wide">{faq.question}</h4>
            <p className="text-[11px] md:text-sm text-gray-600 font-light leading-6 md:leading-7">{faq.answer}</p>

            {/* THE INJECTED GIFT/TILL BOX */}
            {faq.question.toLowerCase().includes("gift") && (
              <div className="mt-5 p-5 md:p-6 bg-[#fffdf7] border border-primary/20 rounded-xl flex flex-col items-center text-center shadow-sm">
                <button
                  onClick={() => setIsFaqGiftOpen(true)}
                  className="px-8 py-3 bg-primary text-[#fffdf7] font-serif tracking-widest text-[10px] md:text-xs rounded-full shadow-md hover:bg-primary/90 hover:scale-105 transition-all"
                >
                  GIFT THE COUPLE
                </button>
                <span className="text-[8px] md:text-[10px] uppercase tracking-[0.18em] text-gray-500 mt-3 mb-2">
                  Till Number
                </span>
                <span className="font-serif text-2xl md:text-3xl text-primary mb-1 tracking-wide">
                  {siteConfig.mpesa.number}
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Hidden Gifting Modal attached to the FAQ */}
      <GiftingModal isOpen={isFaqGiftOpen} onClose={() => setIsFaqGiftOpen(false)} />
    </motion.section>
  );
};


export default function Home() {
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

          <div className="overflow-hidden [&_section]:!min-h-[50vh] md:[&_section]:!min-h-screen [&_section]:!py-8 md:[&_section]:!py-24 [&_.mb-12]:!mb-6 md:[&_.mb-12]:!mb-12 [&_h2]:!text-3xl md:[&_h2]:!text-5xl [&_h3]:!text-xl md:[&_h3]:!text-4xl [&_p]:!text-xs md:[&_p]:!text-base">
            <Story />

            <div id="details">
              <Timeline />
              <Venue />
              <FAQs />
            </div>

            <div id="guestbook">
              <Guestbook />
            </div>

            <Gallery />

            <div className="h-[15vh] flex items-center justify-center text-primary/50 font-serif text-lg md:text-3xl pb-20">
              See you there.
            </div>
          </div>
        </div>
      </Gatekeeper>
    </main>
  );
}