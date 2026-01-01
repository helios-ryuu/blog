"use client";

import { useEffect, useState } from "react";
import Confetti from "react-confetti";

export default function ConfettiEffect() {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const updateDimensions = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        updateDimensions();
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, []);

    return (
        <div
            className="absolute inset-0 pointer-events-none z-50"
            style={{
                top: 'env(safe-area-inset-top)',
                bottom: 'env(safe-area-inset-bottom)',
                maskImage: 'linear-gradient(to bottom, black 0%, black 70%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 70%, transparent 100%)'
            }}
        >
            <Confetti
                width={dimensions.width}
                height={dimensions.height}
                numberOfPieces={20}
                gravity={0.1}
                wind={0.01}
                colors={['#f59e0b', '#ef4444', '#ec4899', '#8b5cf6', '#3b82f6', '#22c55e']}
                recycle={true}
                tweenDuration={10}
            />
        </div>
    );
}
