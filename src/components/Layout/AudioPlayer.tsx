"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

export default function AudioPlayer() {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    // Lower volume slightly for background ambiance
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = 0.2;
        }
    }, []);

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Hidden audio element */}
            <audio ref={audioRef} src="/audio/mbuzi.mp3" loop />

            <motion.button
                onClick={togglePlay}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 rounded-full bg-[#fffdf7] border border-primary/20 shadow-lg flex items-center justify-center text-primary backdrop-blur-md overflow-hidden group"
            >
                {/* Play/Pause Icon */}
                {isPlaying ? (
                    // Playing Animation
                    <div className="flex items-end justify-center space-x-1 w-5 h-5">
                        <motion.div animate={{ height: ["4px", "16px", "4px"] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1 bg-primary rounded-full" />
                        <motion.div animate={{ height: ["12px", "6px", "18px", "12px"] }} transition={{ repeat: Infinity, duration: 0.9 }} className="w-1 bg-primary rounded-full" />
                        <motion.div animate={{ height: ["8px", "14px", "8px"] }} transition={{ repeat: Infinity, duration: 0.7 }} className="w-1 bg-primary rounded-full" />
                    </div>
                ) : (
                    // Paused Icon
                    <svg className="w-5 h-5 ml-1 opacity-80 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                    </svg>
                )}
            </motion.button>
        </div>
    );
}