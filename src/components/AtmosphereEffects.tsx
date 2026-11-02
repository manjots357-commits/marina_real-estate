import React, { useMemo } from 'react';

interface AtmosphereEffectsProps {
  showRain?: boolean;
  showEmbers?: boolean;
}

export const AtmosphereEffects: React.FC<AtmosphereEffectsProps> = ({
  showRain = true,
  showEmbers = true,
}) => {
  // Generate random cyber/atmospheric embers
  const embers = useMemo(() => {
    return Array.from({ length: 32 }).map((_, i) => ({
      id: i,
      left: `${(i * 3.1) % 100}%`,
      bottom: `${(i * 7.3) % 25}%`,
      size: `${2 + (i % 4)}px`,
      duration: `${7 + (i % 9)}s`,
      delay: `${(i * 0.45) % 6}s`,
      color:
        i % 3 === 0
          ? 'rgba(0, 240, 255, 0.85)'
          : i % 3 === 1
          ? 'rgba(56, 189, 248, 0.85)'
          : 'rgba(112, 243, 255, 0.9)',
    }));
  }, []);

  // Generate rain streaks
  const rainDrops = useMemo(() => {
    return Array.from({ length: 48 }).map((_, i) => ({
      id: i,
      left: `${(i * 2.1) % 100}%`,
      height: `${30 + (i % 45)}px`,
      width: `${1 + (i % 2) * 0.5}px`,
      duration: `${0.85 + (i % 5) * 0.15}s`,
      delay: `${(i * 0.12) % 2}s`,
      opacity: 0.2 + (i % 4) * 0.08,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {/* Subtle Atmospheric Vignette & Deep Navy Blue Tint */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 40%, rgba(4, 9, 20, 0.05) 0%, rgba(4, 9, 20, 0.65) 75%, rgba(2, 5, 12, 0.95) 100%)',
        }}
      />

      {/* Floating Neon Cyan & Electric Blue Embers */}
      {showEmbers && (
        <div className="absolute inset-0">
          {embers.map((ember) => (
            <div
              key={ember.id}
              className="ember-particle"
              style={{
                left: ember.left,
                bottom: ember.bottom,
                width: ember.size,
                height: ember.size,
                backgroundColor: ember.color,
                boxShadow: `0 0 10px ${ember.color}`,
                animationDuration: ember.duration,
                animationDelay: ember.delay,
              }}
            />
          ))}
        </div>
      )}

      {/* Cinematic Animated Rain Streaks */}
      {showRain && (
        <div className="absolute inset-0">
          {rainDrops.map((drop) => (
            <div
              key={drop.id}
              className="rain-streak"
              style={{
                left: drop.left,
                top: 0,
                width: drop.width,
                height: drop.height,
                animationDuration: drop.duration,
                animationDelay: drop.delay,
                opacity: drop.opacity,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
