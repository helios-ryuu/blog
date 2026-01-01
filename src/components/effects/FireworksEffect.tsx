"use client";

import { Fireworks } from "@fireworks-js/react";

export default function FireworksEffect() {
    return (
        <Fireworks
            options={{
                rocketsPoint: {
                    min: 0,
                    max: 100,
                },
                hue: {
                    min: 0,
                    max: 360,
                },
                delay: {
                    min: 30,
                    max: 60,
                },
                acceleration: 1.005,
                friction: 0.97,
                gravity: 1.5,
                particles: 60,
                explosion: 4,
                intensity: 10,
                flickering: 50,
                opacity: 0.6,
                traceLength: 2,
                brightness: {
                    min: 50,
                    max: 80,
                },
                decay: {
                    min: 0.015,
                    max: 0.03,
                },
            }}
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
            }}
        />
    );
}

