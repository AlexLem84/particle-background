import React, { useRef, useLayoutEffect } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Standalone particle background component for easy website integration
export interface ParticleBackgroundConfig {
  variation?: number;
  darkBackground?: boolean;
  noise?: boolean;
  customColors?: {
    red: number;
    green: number;
    blue: number;
  } | null;
  colorPalette?: Array<{
    red: number;
    green: number;
    blue: number;
    name: string;
  }> | null;
  noiseType?: string;
  noiseStrength?: number;
  position?: 'fixed' | 'absolute' | 'relative';
  scrollTrigger?: boolean;
  scrollTriggerOpacity?: number;
}

// Default configuration
const defaultConfig: ParticleBackgroundConfig = {
  variation: 0,
  darkBackground: false,
  noise: true,
  customColors: { red: 0.45, green: 0.18, blue: 0.82 },
  colorPalette: null,
  noiseType: 'gradient',
  noiseStrength: 0.5,
  position: 'fixed',
  scrollTrigger: false,
  scrollTriggerOpacity: 0.5
};

export default function ParticleBackgroundStandalone(config: ParticleBackgroundConfig = {}) {
  const mergedConfig = { ...defaultConfig, ...config };
  
  // This component can be used in two ways:
  // 1. As a React component: <ParticleBackgroundStandalone {...config} />
  // 2. As a vanilla JS function: ParticleBackgroundStandalone(config)
  
  if (typeof window === 'undefined') {
    // Server-side rendering
    return null;
  }

  // Create a container element
  const container = document.createElement('div');
  container.style.position = mergedConfig.position || 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100%';
  container.style.height = '100%';
  container.style.pointerEvents = 'none';
  container.style.zIndex = '-1';
  
  // Add to body
  document.body.appendChild(container);

  // Initialize the particle system
  const initParticleSystem = () => {
    // This would contain the same WebGL logic as KotaBackground
    // For now, we'll create a simple placeholder
    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    
    container.appendChild(canvas);
    
    // Add noise overlay if enabled
    if (mergedConfig.noise) {
      const noiseOverlay = document.createElement('div');
      noiseOverlay.style.position = 'absolute';
      noiseOverlay.style.top = '0';
      noiseOverlay.style.left = '0';
      noiseOverlay.style.width = '100%';
      noiseOverlay.style.height = '100%';
      noiseOverlay.style.background = 'rgba(255,255,255,0.02)';
      noiseOverlay.style.pointerEvents = 'none';
      noiseOverlay.setAttribute('data-noise-type', mergedConfig.noiseType || 'gradient');
      
      container.appendChild(noiseOverlay);
    }
  };

  // Initialize
  initParticleSystem();

  // Return cleanup function
  return () => {
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
  };
}

// Export configuration helper
export function createParticleConfig(settings: any): ParticleBackgroundConfig {
  return {
    variation: settings.variation || 0,
    darkBackground: settings.darkBackground || false,
    noise: settings.noise !== false,
    customColors: settings.customColors || null,
    colorPalette: settings.colorPalette || null,
    noiseType: settings.noiseType || 'gradient',
    noiseStrength: settings.noiseStrength || 0.5,
    position: settings.position || 'fixed',
    scrollTrigger: settings.scrollTrigger || false,
    scrollTriggerOpacity: settings.scrollTriggerOpacity || 0.5
  };
}

// Export preset loader
export function loadParticlePreset(presetData: any) {
  return createParticleConfig(presetData);
}
