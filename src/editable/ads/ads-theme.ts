// ✏️ EDITABLE — theme the ads to match this site. Devs own this file.
// You control the LOOK here (radius, border, shadow, background, label color).
// You CANNOT change the ad's shape/fit from here — that stays locked in
// src/lib/ad-slots.ts, so the ad always displays correctly no matter what.

import type { AdSkin } from '@/lib/ads/ad-frame'

/*
  Slot 5 ad skin — matches the reference visual language:
  soft whitesmoke surface, hairline border, orange label pill,
  pill-forward radii, minimal shadow so ads sit naturally on the page.
*/
export const adSkin: AdSkin = {
  radius: '20px',
  border: '1px solid #dddddd',
  shadow: '0 8px 24px -12px rgba(22, 22, 22, 0.10)',
  background: '#ffffff',
  labelClassName: 'bg-[#ff742e] text-white',
}

export const adSkinBySlot: Partial<Record<string, AdSkin>> = {
  sidebar: {
    radius: '20px',
    shadow: '0 6px 18px -10px rgba(22, 22, 22, 0.10)',
    border: '1px solid #dddddd',
    background: '#ffffff',
  },
  popup: { radius: '30px' },
  header: { radius: '30px', background: '#faf5ee', border: '1px solid #e8e8e8' },
  footer: { radius: '20px', background: '#ffffff', border: '1px solid #dddddd' },
  rail: { radius: '20px' },
  feature: { radius: '30px', background: '#ffffff', border: '1px solid #dddddd' },
  interstitial: { radius: '30px', shadow: '0 30px 80px rgba(22, 22, 22, 0.35)' },
  anchor: { radius: '20px', shadow: '0 10px 30px rgba(22, 22, 22, 0.18)' },
}

/** Merge site default + per-slot override for a slot. */
export function skinFor(slot: string): AdSkin {
  return { ...adSkin, ...(adSkinBySlot[slot] ?? {}) }
}
