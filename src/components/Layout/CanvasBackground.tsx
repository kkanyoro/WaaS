"use client";

import { useEffect, useRef } from "react";
import { siteConfig } from "@/config/weddingConfig";

export default function CanvasBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Read effect from config
        const effectType = siteConfig.features.bgAsset;

        let animationFrameId: number;
        let particles: Particle[] = [];

        class Particle {
            x: number;
            y: number;
            radius: number;
            vx: number;
            vy: number;
            alpha: number;
            color: string;

            constructor() {
                this.x = Math.random() * canvas!.width;
                this.y = Math.random() * canvas!.height;
                this.radius = Math.random() * 3 + 1;

                // PHYSICS TOGGLE
                if (effectType === "snow") {
                    // SNOW PHYSICS
                    this.vx = (Math.random() - 0.5) * 2; // sway left/right
                    this.vy = Math.random() * 1 + 0.5; // falling speed
                    this.alpha = Math.random() * 0.5; // transparency
                    this.color = "#ffffff";
                } else {
                    // FIREFLIES PHYSICS
                    this.vx = (Math.random() - 0.5) * 1.5; // Increased horizontal drift
                    this.vy = (Math.random() - 0.5) * 1 - 0.5; // Increased upward drift
                    this.alpha = Math.random() * 0.5; // transparency

                    // Firefly bioluminescence colors
                    const fireflyColors = ["#e4e956", "#f2f58e", "#d4e848", "#fffcd6"];
                    this.color = fireflyColors[Math.floor(Math.random() * fireflyColors.length)];
                }
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.alpha;
                ctx.fill();

                ctx.shadowBlur = effectType === "snow" ? 5 : 12;
                ctx.shadowColor = this.color;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Wrap around screen edges horizontally
                if (this.x < 0) this.x = canvas!.width;
                if (this.x > canvas!.width) this.x = 0;

                // Wrap around vertically depending on gravity
                if (effectType === "snow") {
                    // Snow falls to bottom, respawns top
                    if (this.y > canvas!.height) this.y = 0;
                } else {
                    // Fireflies float to top, respawn bottom
                    if (this.y < 0) this.y = canvas!.height;
                    if (this.y > canvas!.height) this.y = 0;

                    // Pulse opacity for fireflies
                    this.alpha += (Math.random() - 0.5) * 0.05;
                    if (this.alpha < 0.2) this.alpha = 0.2;
                    if (this.alpha > 1) this.alpha = 1;
                }

                this.draw();
            }
        }

        function initParticles() {
            particles = [];
            // Particle density
            let particleCount = window.innerWidth < 768 ? 80 : 250;
            if (effectType === "snow") particleCount *= 1;

            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        function animate() {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((particle) => particle.update());
            animationFrameId = requestAnimationFrame(animate);
        }

        // Initialize and setup listeners after everything is defined
        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();
        animate();

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full block pointer-events-none"
        />
    );
}