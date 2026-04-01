"use client";

import React, { useRef, useEffect, useState, ReactNode } from "react";

interface ScratchCardProps {
    children: ReactNode;
    coverColor?: string;
    onComplete: () => void;
}

export default function ScratchCard({
    children,
    coverColor = "#dcc49a",
    onComplete
}: ScratchCardProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isComplete, setIsComplete] = useState(false);

    // Use refs to track drawing state synchronously inside event listeners
    const isDrawing = useRef(false);
    const isCompleteRef = useRef(false);

    // Keep ref synced with the state for observer to know when to stop redrawing
    useEffect(() => {
        isCompleteRef.current = isComplete;
    }, [isComplete]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        const ctx = canvas?.getContext("2d", { willReadFrequently: true });

        if (!canvas || !ctx || !container) return;

        const drawCover = () => {
            // 1. Abort if already scratched off or if container has no physical size yet
            if (isCompleteRef.current) return;
            if (container.offsetWidth === 0 || container.offsetHeight === 0) return;

            canvas.width = container.offsetWidth;
            canvas.height = container.offsetHeight;

            ctx.fillStyle = coverColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const grd = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 5, canvas.width / 2, canvas.height / 2, canvas.width);
            grd.addColorStop(0, "rgba(255,255,255,0.2)");
            grd.addColorStop(1, "rgba(0,0,0,0.1)");
            ctx.fillStyle = grd;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        };

        // Use ResizeObserver to detect when the text loads
        const observer = new ResizeObserver(() => {
            // requestAnimationFrame ensures browser finishes painting
            requestAnimationFrame(() => drawCover());
        });

        observer.observe(container);

        // Force redraw when custom fonts finish loading
        if (typeof document !== "undefined" && document.fonts) {
            document.fonts.ready.then(() => {
                requestAnimationFrame(() => drawCover());
            });
        }

        return () => {
            observer.disconnect();
        };
    }, [coverColor]);

    const checkPercentage = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d", { willReadFrequently: true });
        if (!canvas || !ctx || isComplete) return;

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        let total = pixels.length / 4;
        let cleared = 0;

        for (let i = 3; i < pixels.length; i += 4) {
            if (pixels[i] < 128) cleared++;
        }

        const percentage = cleared / total;

        if (percentage > 0.6) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.style.opacity = "0";
            setIsComplete(true);
            onComplete();
        }
    };

    const scratch = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx || isComplete) return;

        const rect = canvas.getBoundingClientRect();

        let clientX, clientY;
        if ("touches" in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        const x = clientX - rect.left;
        const y = clientY - rect.top;

        ctx.globalCompositeOperation = "destination-out";
        ctx.lineWidth = 40;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        if (!isDrawing.current) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            isDrawing.current = true;
        } else {
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    };

    const stopScratching = () => {
        if (!isDrawing.current) return;
        isDrawing.current = false;
        checkPercentage();
    };

    return (
        <div ref={containerRef} className="relative select-none overflow-hidden group rounded-full">
            <div className="z-0 transition-all duration-1000">
                {children}
            </div>

            <canvas
                ref={canvasRef}
                className="absolute inset-0 z-10 block transition-opacity duration-500 cursor-crosshair group-active:scale-[1.01] touch-none"
                onMouseMove={scratch}
                onMouseDown={scratch}
                onMouseUp={stopScratching}
                onMouseLeave={stopScratching}
                onTouchMove={scratch}
                onTouchStart={scratch}
                onTouchEnd={stopScratching}
            />
        </div>
    );
}