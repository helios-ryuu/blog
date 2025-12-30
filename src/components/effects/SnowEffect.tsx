"use client";

import Snowfall from "react-snowfall";

export default function SnowEffect() {
    return (
        <div
            className="absolute inset-0 pointer-events-none z-50 transition-all duration-300"
            style={{
                top: 'env(safe-area-inset-top)',
                bottom: 'env(safe-area-inset-bottom)',
                maskImage: 'linear-gradient(to bottom, black 0%, black 70%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 70%, transparent 100%)'
            }}
        >
            <Snowfall
                color="white"
                snowflakeCount={30}
                speed={[1.5, 2.5]}
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                }}
            />
        </div>
    );
}
