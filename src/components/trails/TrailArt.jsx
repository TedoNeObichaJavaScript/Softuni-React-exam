import { useId } from 'react';
import './TrailArt.css';

const PALETTES = [
  {
    name: 'sage',
    sky: ['#e5ead6', '#f7f4e8'],
    sun: '#fbf1cf',
    layers: ['#cbd4b2', '#a6b889', '#789163', '#4a6743'],
  },
  {
    name: 'alpine',
    sky: ['#d3e3ee', '#f2f5f2'],
    sun: '#fdf6e0',
    layers: ['#b6cbdb', '#87a7c0', '#567e9c', '#2c536f'],
  },
  {
    name: 'dusk',
    sky: ['#ddd5e6', '#f8e8dc'],
    sun: '#f9d7ab',
    layers: ['#c4b8d3', '#9c8bb3', '#6e5e8f', '#423960'],
  },
  {
    name: 'ochre',
    sky: ['#f1dfc0', '#fbf4e5'],
    sun: '#f6c76f',
    layers: ['#e2c595', '#c99c5e', '#9b6c3b', '#5b3f25'],
  },
  {
    name: 'pine',
    sky: ['#cfe1dc', '#edf2ec'],
    sun: '#f7f1d8',
    layers: ['#a1bfb6', '#6c988b', '#3d6e60', '#1a4438'],
  },
];

const RIDGES = [
  'M0 150 L40 118 L78 136 L130 84 L176 128 L214 102 L262 140 L310 92 L356 126 L400 108 L400 250 L0 250 Z',
  'M0 172 L52 138 L96 160 L150 116 L204 158 L246 134 L300 170 L348 128 L400 154 L400 250 L0 250 Z',
  'M0 200 Q60 166 120 190 T240 186 T360 178 T400 184 L400 250 L0 250 Z',
  'M0 228 Q90 204 180 222 T400 212 L400 250 L0 250 Z',
];

function hashSeed(seed) {
  const text = String(seed ?? '');
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 31 + text.charCodeAt(i)) % 100000;
  }
  return hash;
}

export default function TrailArt({ seed, title, className = '' }) {
  const gradientId = `trail-art-sky${useId()}`;
  const hash = hashSeed(seed ?? title);
  const palette = PALETTES[hash % PALETTES.length];
  const sunX = 70 + (hash % 7) * 42;
  const isMirrored = hash % 2 === 1;

  return (
    <svg
      className={`trail-art ${className}`}
      viewBox="0 0 400 250"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={palette.sky[0]} />
          <stop offset="100%" stopColor={palette.sky[1]} />
        </linearGradient>
      </defs>
      <rect width="400" height="250" fill={`url(#${gradientId})`} />
      <circle cx={sunX} cy="66" r="26" fill={palette.sun} opacity="0.95" />
      <g transform={isMirrored ? 'translate(400 0) scale(-1 1)' : undefined}>
        {RIDGES.map((ridge, index) => (
          <path key={ridge} d={ridge} fill={palette.layers[index]} />
        ))}
      </g>
    </svg>
  );
}
