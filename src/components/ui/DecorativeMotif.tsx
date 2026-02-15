'use client';

interface MotifProps {
  type: string;
  className?: string;
  color?: string;
}

function OmSymbol({ color = 'currentColor' }: { color?: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M100 15c-8 0-15 4-20 10-6 7-9 16-9 26 0 14 6 26 16 35 5 4 8 10 8 16 0 8-4 15-11 19-7 5-16 7-25 7-12 0-23-5-30-14-8-9-12-21-12-34 0-15 5-29 14-40 10-12 23-20 38-23"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.9"
      />
      <path
        d="M125 52c12 0 22 5 29 14 7 9 11 20 11 33 0 16-6 30-17 41-11 11-25 17-41 17-13 0-24-4-33-13"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.9"
      />
      <path
        d="M100 160c0 8 3 15 8 20 5 5 12 8 19 8"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.9"
      />
      <circle cx="130" cy="30" r="6" fill={color} opacity="0.9" />
      <path
        d="M120 18c4-4 10-4 14 0"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}

function LotusFlower({ color = 'currentColor' }: { color?: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Center petal */}
      <ellipse cx="100" cy="85" rx="15" ry="45" fill={color} opacity="0.3" />
      {/* Left petals */}
      <ellipse cx="100" cy="85" rx="15" ry="45" fill={color} opacity="0.25" transform="rotate(-30 100 120)" />
      <ellipse cx="100" cy="85" rx="15" ry="45" fill={color} opacity="0.2" transform="rotate(-60 100 120)" />
      {/* Right petals */}
      <ellipse cx="100" cy="85" rx="15" ry="45" fill={color} opacity="0.25" transform="rotate(30 100 120)" />
      <ellipse cx="100" cy="85" rx="15" ry="45" fill={color} opacity="0.2" transform="rotate(60 100 120)" />
      {/* Outer petals */}
      <ellipse cx="100" cy="80" rx="12" ry="50" fill={color} opacity="0.15" transform="rotate(-45 100 120)" />
      <ellipse cx="100" cy="80" rx="12" ry="50" fill={color} opacity="0.15" transform="rotate(45 100 120)" />
      <ellipse cx="100" cy="80" rx="12" ry="50" fill={color} opacity="0.12" transform="rotate(-75 100 120)" />
      <ellipse cx="100" cy="80" rx="12" ry="50" fill={color} opacity="0.12" transform="rotate(75 100 120)" />
      {/* Center circle */}
      <circle cx="100" cy="110" r="10" fill={color} opacity="0.4" />
      {/* Water line */}
      <path d="M30 150 Q65 140 100 150 Q135 160 170 150" stroke={color} strokeWidth="2" opacity="0.2" fill="none" />
      <path d="M20 160 Q60 148 100 160 Q140 172 180 160" stroke={color} strokeWidth="1.5" opacity="0.15" fill="none" />
    </svg>
  );
}

function Flame({ color = 'currentColor' }: { color?: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer flame */}
      <path
        d="M100 20 C85 60 55 80 55 120 C55 150 75 175 100 180 C125 175 145 150 145 120 C145 80 115 60 100 20Z"
        fill={color}
        opacity="0.2"
      />
      {/* Middle flame */}
      <path
        d="M100 45 C90 70 70 90 70 120 C70 145 83 162 100 165 C117 162 130 145 130 120 C130 90 110 70 100 45Z"
        fill={color}
        opacity="0.25"
      />
      {/* Inner flame */}
      <path
        d="M100 70 C95 85 82 100 82 118 C82 135 90 148 100 150 C110 148 118 135 118 118 C118 100 105 85 100 70Z"
        fill={color}
        opacity="0.35"
      />
      {/* Core */}
      <ellipse cx="100" cy="135" rx="10" ry="15" fill={color} opacity="0.5" />
      {/* Base/diya */}
      <path d="M75 180 Q100 170 125 180" stroke={color} strokeWidth="3" opacity="0.3" fill="none" />
      <ellipse cx="100" cy="183" rx="28" ry="5" fill={color} opacity="0.15" />
    </svg>
  );
}

function Conch({ color = 'currentColor' }: { color?: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shell body */}
      <path
        d="M120 30 C150 40 170 70 170 105 C170 145 145 175 110 180 C85 183 65 170 55 150 C45 130 45 105 55 85 C62 72 75 62 90 58"
        fill={color}
        opacity="0.2"
        stroke={color}
        strokeWidth="2"
      />
      {/* Spiral lines */}
      <path d="M120 50 C140 58 155 78 155 105 C155 135 138 160 115 168" stroke={color} strokeWidth="1.5" opacity="0.25" fill="none" />
      <path d="M115 65 C130 72 142 88 142 108 C142 132 128 150 110 155" stroke={color} strokeWidth="1.5" opacity="0.2" fill="none" />
      <path d="M108 78 C120 84 130 96 130 112 C130 128 120 140 108 143" stroke={color} strokeWidth="1.5" opacity="0.2" fill="none" />
      {/* Opening */}
      <path d="M55 85 C48 100 45 115 50 130 C53 140 60 148 70 152" stroke={color} strokeWidth="2" opacity="0.3" fill="none" />
      {/* Tip */}
      <circle cx="120" cy="32" r="4" fill={color} opacity="0.3" />
    </svg>
  );
}

function Mandala({ color = 'currentColor' }: { color?: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer ring */}
      <circle cx="100" cy="100" r="85" stroke={color} strokeWidth="1.5" opacity="0.15" />
      <circle cx="100" cy="100" r="78" stroke={color} strokeWidth="1" opacity="0.12" />
      {/* Middle ring with decorations */}
      <circle cx="100" cy="100" r="65" stroke={color} strokeWidth="1.5" opacity="0.2" />
      {/* Petal ring */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
        <ellipse
          key={angle}
          cx="100"
          cy="40"
          rx="8"
          ry="20"
          fill={color}
          opacity="0.1"
          transform={`rotate(${angle} 100 100)`}
        />
      ))}
      {/* Inner ring */}
      <circle cx="100" cy="100" r="45" stroke={color} strokeWidth="1.5" opacity="0.2" />
      {/* Star pattern */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <line
          key={angle}
          x1="100"
          y1="60"
          x2="100"
          y2="100"
          stroke={color}
          strokeWidth="1"
          opacity="0.15"
          transform={`rotate(${angle} 100 100)`}
        />
      ))}
      {/* Center */}
      <circle cx="100" cy="100" r="25" stroke={color} strokeWidth="1.5" opacity="0.25" />
      <circle cx="100" cy="100" r="12" fill={color} opacity="0.15" />
      <circle cx="100" cy="100" r="5" fill={color} opacity="0.3" />
    </svg>
  );
}

function Wheel({ color = 'currentColor' }: { color?: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer rim */}
      <circle cx="100" cy="100" r="80" stroke={color} strokeWidth="3" opacity="0.25" />
      <circle cx="100" cy="100" r="75" stroke={color} strokeWidth="1" opacity="0.15" />
      {/* Spokes */}
      {[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5].map((angle) => (
        <line
          key={angle}
          x1="100"
          y1="25"
          x2="100"
          y2="100"
          stroke={color}
          strokeWidth="1.5"
          opacity="0.2"
          transform={`rotate(${angle} 100 100)`}
        />
      ))}
      {/* Hub */}
      <circle cx="100" cy="100" r="20" stroke={color} strokeWidth="2" opacity="0.3" />
      <circle cx="100" cy="100" r="8" fill={color} opacity="0.25" />
      {/* Decorative dots on rim */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        return (
          <circle
            key={angle}
            cx={100 + 80 * Math.sin(rad)}
            cy={100 - 80 * Math.cos(rad)}
            r="3"
            fill={color}
            opacity="0.3"
          />
        );
      })}
    </svg>
  );
}

function Lamp({ color = 'currentColor' }: { color?: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Flame */}
      <path
        d="M100 25 C93 45 80 55 80 75 C80 90 89 100 100 102 C111 100 120 90 120 75 C120 55 107 45 100 25Z"
        fill={color}
        opacity="0.3"
      />
      <path
        d="M100 40 C96 52 88 60 88 73 C88 83 93 90 100 91 C107 90 112 83 112 73 C112 60 104 52 100 40Z"
        fill={color}
        opacity="0.4"
      />
      {/* Lamp base top */}
      <ellipse cx="100" cy="108" rx="25" ry="8" fill={color} opacity="0.2" />
      {/* Lamp body */}
      <path d="M75 108 C75 108 70 140 68 155 L132 155 C130 140 125 108 125 108" fill={color} opacity="0.15" />
      {/* Lamp base */}
      <ellipse cx="100" cy="155" rx="35" ry="8" fill={color} opacity="0.2" />
      <ellipse cx="100" cy="165" rx="40" ry="6" fill={color} opacity="0.15" />
      {/* Wick */}
      <line x1="100" y1="100" x2="100" y2="108" stroke={color} strokeWidth="2" opacity="0.3" />
      {/* Glow */}
      <circle cx="100" cy="65" r="30" fill={color} opacity="0.06" />
    </svg>
  );
}

function Veena({ color = 'currentColor' }: { color?: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Resonator (top) */}
      <circle cx="60" cy="55" r="30" fill={color} opacity="0.15" stroke={color} strokeWidth="1.5" />
      <circle cx="60" cy="55" r="20" stroke={color} strokeWidth="1" opacity="0.12" />
      {/* Neck */}
      <line x1="85" y1="70" x2="155" y2="140" stroke={color} strokeWidth="4" opacity="0.2" strokeLinecap="round" />
      {/* Resonator (bottom) */}
      <circle cx="155" cy="145" r="25" fill={color} opacity="0.15" stroke={color} strokeWidth="1.5" />
      {/* Strings */}
      <line x1="80" y1="62" x2="148" y2="130" stroke={color} strokeWidth="0.8" opacity="0.2" />
      <line x1="82" y1="67" x2="150" y2="135" stroke={color} strokeWidth="0.8" opacity="0.2" />
      <line x1="84" y1="72" x2="152" y2="140" stroke={color} strokeWidth="0.8" opacity="0.2" />
      <line x1="86" y1="77" x2="154" y2="145" stroke={color} strokeWidth="0.8" opacity="0.2" />
      {/* Tuning pegs */}
      {[40, 48, 56, 64].map((y) => (
        <circle key={y} cx={42} cy={y} r="3" fill={color} opacity="0.25" />
      ))}
      {/* Musical notes decoration */}
      <circle cx="120" cy="80" r="4" fill={color} opacity="0.12" />
      <circle cx="140" cy="95" r="3" fill={color} opacity="0.1" />
      <circle cx="105" cy="100" r="3.5" fill={color} opacity="0.1" />
    </svg>
  );
}

function Book({ color = 'currentColor' }: { color?: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Book cover (back) */}
      <path d="M45 40 L45 165 L155 165 L155 40 Z" fill={color} opacity="0.1" stroke={color} strokeWidth="1.5" />
      {/* Book cover (front) */}
      <path d="M40 35 L40 160 L150 160 L150 35 Z" fill={color} opacity="0.15" stroke={color} strokeWidth="1.5" />
      {/* Spine */}
      <line x1="40" y1="35" x2="45" y2="40" stroke={color} strokeWidth="1.5" opacity="0.2" />
      <line x1="40" y1="160" x2="45" y2="165" stroke={color} strokeWidth="1.5" opacity="0.2" />
      {/* Pages */}
      {[50, 55, 60, 65].map((x) => (
        <line key={x} x1={x} y1="42" x2={x} y2="157" stroke={color} strokeWidth="0.5" opacity="0.1" />
      ))}
      {/* Text lines */}
      {[70, 82, 94, 106, 118, 130].map((y) => (
        <line key={y} x1="70" y1={y} x2="130" y2={y} stroke={color} strokeWidth="1" opacity="0.12" />
      ))}
      {/* Om on cover */}
      <text x="95" y="100" textAnchor="middle" fill={color} opacity="0.25" fontSize="28" fontFamily="serif">
        ॐ
      </text>
    </svg>
  );
}

function Bell({ color = 'currentColor' }: { color?: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Handle */}
      <path d="M90 30 Q100 20 110 30" stroke={color} strokeWidth="3" opacity="0.3" fill="none" />
      <line x1="100" y1="30" x2="100" y2="50" stroke={color} strokeWidth="2" opacity="0.25" />
      {/* Bell body */}
      <path
        d="M60 130 C60 80 75 50 100 50 C125 50 140 80 140 130 L150 145 L50 145 Z"
        fill={color}
        opacity="0.15"
        stroke={color}
        strokeWidth="1.5"
      />
      {/* Bell rim */}
      <ellipse cx="100" cy="145" rx="50" ry="8" fill={color} opacity="0.2" />
      {/* Clapper */}
      <line x1="100" y1="120" x2="100" y2="155" stroke={color} strokeWidth="2" opacity="0.25" />
      <circle cx="100" cy="158" r="6" fill={color} opacity="0.25" />
      {/* Decorative bands */}
      <ellipse cx="100" cy="90" rx="28" ry="4" stroke={color} strokeWidth="1" opacity="0.12" fill="none" />
      <ellipse cx="100" cy="115" rx="38" ry="5" stroke={color} strokeWidth="1" opacity="0.12" fill="none" />
      {/* Sound waves */}
      <path d="M45 120 Q35 110 45 100" stroke={color} strokeWidth="1" opacity="0.1" fill="none" />
      <path d="M35 125 Q22 110 35 95" stroke={color} strokeWidth="1" opacity="0.08" fill="none" />
      <path d="M155 120 Q165 110 155 100" stroke={color} strokeWidth="1" opacity="0.1" fill="none" />
      <path d="M165 125 Q178 110 165 95" stroke={color} strokeWidth="1" opacity="0.08" fill="none" />
    </svg>
  );
}

function Scroll({ color = 'currentColor' }: { color?: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Scroll body */}
      <path d="M50 45 L50 155 Q50 165 60 165 L140 165 Q150 165 150 155 L150 45" fill={color} opacity="0.1" />
      {/* Top roll */}
      <ellipse cx="100" cy="40" rx="55" ry="12" fill={color} opacity="0.2" stroke={color} strokeWidth="1.5" />
      <ellipse cx="100" cy="40" rx="55" ry="8" fill={color} opacity="0.1" />
      {/* Bottom roll */}
      <ellipse cx="100" cy="168" rx="50" ry="10" fill={color} opacity="0.15" stroke={color} strokeWidth="1.5" />
      {/* Text lines */}
      {[65, 78, 91, 104, 117, 130, 143].map((y) => (
        <line key={y} x1="70" y1={y} x2={130 - (y % 20)} y2={y} stroke={color} strokeWidth="1" opacity="0.12" />
      ))}
      {/* Roll ends */}
      <circle cx="48" cy="40" r="5" fill={color} opacity="0.2" />
      <circle cx="152" cy="40" r="5" fill={color} opacity="0.2" />
      <circle cx="52" cy="168" r="4" fill={color} opacity="0.15" />
      <circle cx="148" cy="168" r="4" fill={color} opacity="0.15" />
    </svg>
  );
}

function PeacockFeather({ color = 'currentColor' }: { color?: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Feather shaft */}
      <path d="M100 190 Q98 120 95 60 Q94 40 100 20" stroke={color} strokeWidth="1.5" opacity="0.25" fill="none" />
      {/* Eye of feather */}
      <ellipse cx="100" cy="75" rx="30" ry="40" fill={color} opacity="0.1" />
      <ellipse cx="100" cy="75" rx="22" ry="30" fill={color} opacity="0.15" />
      <ellipse cx="100" cy="75" rx="14" ry="20" fill={color} opacity="0.2" />
      <ellipse cx="100" cy="72" rx="7" ry="10" fill={color} opacity="0.3" />
      {/* Barbs */}
      {[50, 60, 70, 80, 90, 100, 110, 120, 130].map((y) => (
        <g key={y}>
          <line x1={100 - (130 - y) * 0.4} y1={y - 5} x2="98" y2={y} stroke={color} strokeWidth="0.5" opacity="0.1" />
          <line x1={100 + (130 - y) * 0.4} y1={y - 5} x2="102" y2={y} stroke={color} strokeWidth="0.5" opacity="0.1" />
        </g>
      ))}
    </svg>
  );
}

const MOTIF_COMPONENTS: Record<string, React.FC<{ color?: string }>> = {
  om: OmSymbol,
  lotus: LotusFlower,
  flame: Flame,
  conch: Conch,
  mandala: Mandala,
  peacock: PeacockFeather,
  veena: Veena,
  book: Book,
  lamp: Lamp,
  wheel: Wheel,
  bell: Bell,
  scroll: Scroll,
};

export function DecorativeMotif({ type, className = '', color }: MotifProps) {
  const Component = MOTIF_COMPONENTS[type];
  if (!Component) return null;

  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden="true">
      <Component color={color} />
    </div>
  );
}
