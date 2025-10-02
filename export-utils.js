/**
 * Enhanced Export Utilities for Particle Background
 * Provides multiple export formats and integration methods
 */

export class ParticleExporter {
  constructor() {
    this.exportFormats = {
      'html': this.exportAsHTML,
      'react': this.exportAsReact,
      'vue': this.exportAsVue,
      'astro': this.exportAsAstro,
      'vanilla': this.exportAsVanilla,
      'json': this.exportAsJSON,
      'config': this.exportAsConfig
    };
  }

  /**
   * Export particle configuration as HTML with embedded script
   */
  exportAsHTML(config, options = {}) {
    const {
      title = 'Particle Background',
      includeControls = true,
      includeThreeJS = true,
      minify = false
    } = options;

    const threeJSScript = includeThreeJS ? `
    <script type="module">
      import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';
      window.THREE = THREE;
    </script>
    ` : '';

    const controlsHTML = includeControls ? `
    <div class="particle-controls" style="position: fixed; top: 20px; right: 20px; z-index: 1000; background: rgba(0,0,0,0.8); padding: 15px; border-radius: 10px; color: white;">
      <h3 style="margin: 0 0 10px 0; font-size: 16px;">Particle Controls</h3>
      <button onclick="changeMotionType('organic')" style="margin: 2px; padding: 5px 10px; background: #0066ff; color: white; border: none; border-radius: 5px; cursor: pointer;">Organic</button>
      <button onclick="changeMotionType('wave')" style="margin: 2px; padding: 5px 10px; background: #0066ff; color: white; border: none; border-radius: 5px; cursor: pointer;">Wave</button>
      <button onclick="changeMotionType('spiral')" style="margin: 2px; padding: 5px 10px; background: #0066ff; color: white; border: none; border-radius: 5px; cursor: pointer;">Spiral</button>
      <button onclick="changeMotionType('3d')" style="margin: 2px; padding: 5px 10px; background: #0066ff; color: white; border: none; border-radius: 5px; cursor: pointer;">3D</button>
      <br>
      <button onclick="changeColors('blue')" style="margin: 2px; padding: 5px 10px; background: #8a2be2; color: white; border: none; border-radius: 5px; cursor: pointer;">Blue</button>
      <button onclick="changeColors('purple')" style="margin: 2px; padding: 5px 10px; background: #8a2be2; color: white; border: none; border-radius: 5px; cursor: pointer;">Purple</button>
      <button onclick="changeColors('pink')" style="margin: 2px; padding: 5px 10px; background: #8a2be2; color: white; border: none; border-radius: 5px; cursor: pointer;">Pink</button>
      <button onclick="changeColors('rainbow')" style="margin: 2px; padding: 5px 10px; background: #8a2be2; color: white; border: none; border-radius: 5px; cursor: pointer;">Rainbow</button>
    </div>
    ` : '';

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            overflow-x: hidden;
        }
        
        .particle-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            pointer-events: none;
        }
        
        .content {
            position: relative;
            z-index: 1;
            padding: 2rem;
            color: white;
            text-align: center;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        
        h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        }
        
        p {
            font-size: 1.2rem;
            max-width: 600px;
            margin: 0 auto;
            line-height: 1.6;
        }
    </style>
</head>
<body>
    ${threeJSScript}
    
    <!-- Particle Background Container -->
    <div id="particle-background" class="particle-container"></div>
    ${controlsHTML}
    
    <!-- Your Website Content -->
    <div class="content">
        <h1>Your Website Title</h1>
        <p>This is your website content with a beautiful particle background effect. The particles will animate and respond to user interaction, creating an engaging visual experience.</p>
    </div>

    <!-- Particle Background Script -->
    <script src="particle-export.js"></script>
    <script>
        // Your particle configuration
        const particleConfig = ${JSON.stringify(config, null, 2)};
        
        // Initialize particle background
        let particleBG;
        
        function initParticleBackground() {
            particleBG = new ParticleBackground();
            particleBG.init(particleConfig);
        }
        
        // Control functions
        function changeMotionType(type) {
            if (particleBG) {
                particleBG.update({ motionType: type });
            }
        }
        
        function changeColors(theme) {
            const themes = {
                blue: { particleColor: '#0066ff', particleColor2: '#0044cc', particleColor3: '#0088ff' },
                purple: { particleColor: '#8a2be2', particleColor2: '#6a1b9a', particleColor3: '#ba68c8' },
                pink: { particleColor: '#ff69b4', particleColor2: '#e91e63', particleColor3: '#f8bbd9' },
                rainbow: { particleColor: '#ff0000', particleColor2: '#00ff00', particleColor3: '#0000ff' }
            };
            
            if (particleBG && themes[theme]) {
                particleBG.update(themes[theme]);
            }
        }
        
        // Initialize when page loads
        document.addEventListener('DOMContentLoaded', initParticleBackground);
        
        // Cleanup when page unloads
        window.addEventListener('beforeunload', () => {
            if (particleBG) {
                particleBG.destroy();
            }
        });
    </script>
</body>
</html>`;
  }

  /**
   * Export as React component
   */
  exportAsReact(config, options = {}) {
    const { componentName = 'ParticleBackground', includeProps = true } = options;
    
    const propsInterface = includeProps ? `
interface ${componentName}Props {
  numParticles?: number;
  particleSize?: number;
  particleColor?: string;
  particleColor2?: string;
  particleColor3?: string;
  motionType?: string;
  backgroundColor?: string;
  // ... other props
}
` : '';

    return `import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

${propsInterface}
export default function ${componentName}({
  numParticles = ${config.numParticles || 15000},
  particleSize = ${config.particleSize || 1.2},
  particleColor = '${config.particleColor || '#0066ff'}',
  particleColor2 = '${config.particleColor2 || '#8a2be2'}',
  particleColor3 = '${config.particleColor3 || '#ff69b4'}',
  motionType = '${config.motionType || 'organic'}',
  backgroundColor = '${config.backgroundColor || '#0a0a0a'}',
  // ... other props
}: ${componentName}Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const particlesRef = useRef<THREE.Points>();
  const animationIdRef = useRef<number>();

  useEffect(() => {
    // Initialize Three.js scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(backgroundColor);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current,
      antialias: true,
      alpha: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    rendererRef.current = renderer;

    // Create particles with your configuration
    // ... particle creation code ...

    const animate = () => {
      if (particlesRef.current && rendererRef.current && sceneRef.current && cameraRef.current) {
        particlesRef.current.material.uniforms.uTime.value += 0.01;
        rendererRef.current.render(sceneRef.current, cameraRef.current);
        animationIdRef.current = requestAnimationFrame(animate);
      }
    };
    animate();

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [numParticles, particleSize, particleColor, particleColor2, particleColor3, motionType, backgroundColor]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none'
      }}
    />
  );
}`;
  }

  /**
   * Export as Vue component
   */
  exportAsVue(config, options = {}) {
    const { componentName = 'ParticleBackground' } = options;
    
    return `<template>
  <canvas
    ref="canvas"
    :style="{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -1,
      pointerEvents: 'none'
    }"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';

const props = defineProps({
  numParticles: { type: Number, default: ${config.numParticles || 15000} },
  particleSize: { type: Number, default: ${config.particleSize || 1.2} },
  particleColor: { type: String, default: '${config.particleColor || '#0066ff'}' },
  particleColor2: { type: String, default: '${config.particleColor2 || '#8a2be2'}' },
  particleColor3: { type: String, default: '${config.particleColor3 || '#ff69b4'}' },
  motionType: { type: String, default: '${config.motionType || 'organic'}' },
  backgroundColor: { type: String, default: '${config.backgroundColor || '#0a0a0a'}' }
});

const canvas = ref<HTMLCanvasElement>();
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let particles: THREE.Points;
let animationId: number;

onMounted(() => {
  // Initialize Three.js scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(props.backgroundColor);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 50;

  renderer = new THREE.WebGLRenderer({ 
    canvas: canvas.value,
    antialias: true,
    alpha: true
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Create particles with your configuration
  // ... particle creation code ...

  const animate = () => {
    if (particles && renderer && scene && camera) {
      particles.material.uniforms.uTime.value += 0.01;
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    }
  };
  animate();
});

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
});
</script>`;
  }

  /**
   * Export as Astro component
   */
  exportAsAstro(config, options = {}) {
    return `---
// Astro component with your particle configuration
---

<canvas
  id="particle-canvas"
  style="
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    pointer-events: none;
  "
></canvas>

<script>
  import * as THREE from 'three';

  // Your particle configuration
  const config = ${JSON.stringify(config, null, 2)};

  // Initialize particle system
  function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(config.backgroundColor);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvas,
      antialias: true,
      alpha: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Create particles with your configuration
    // ... particle creation code ...

    function animate() {
      requestAnimationFrame(animate);
      if (particles) {
        particles.material.uniforms.uTime.value += 0.01;
        renderer.render(scene, camera);
      }
    }
    animate();
  }

  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', initParticles);
</script>`;
  }

  /**
   * Export as vanilla JavaScript
   */
  exportAsVanilla(config, options = {}) {
    const { includeThreeJS = true } = options;
    
    const threeJSScript = includeThreeJS ? `
    <script type="module">
      import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';
      window.THREE = THREE;
    </script>
    ` : '';

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Particle Background</title>
    <style>
        body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
        .particle-container { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; }
        .content { position: relative; z-index: 1; padding: 2rem; color: white; text-align: center; }
    </style>
</head>
<body>
    ${threeJSScript}
    
    <div id="particle-background" class="particle-container"></div>
    <div class="content">
        <h1>Your Website</h1>
        <p>Content with particle background</p>
    </div>

    <script>
        // Your particle configuration
        const config = ${JSON.stringify(config, null, 2)};
        
        // Initialize when Three.js is loaded
        function initParticles() {
            if (typeof THREE === 'undefined') {
                setTimeout(initParticles, 100);
                return;
            }
            
            // Initialize particle system with your config
            // ... implementation ...
        }
        
        document.addEventListener('DOMContentLoaded', initParticles);
    </script>
</body>
</html>`;
  }

  /**
   * Export as JSON configuration
   */
  exportAsJSON(config, options = {}) {
    const { includeMetadata = true } = options;
    
    const exportData = {
      ...config,
      ...(includeMetadata && {
        _metadata: {
          exportedAt: new Date().toISOString(),
          version: '1.0.0',
          format: 'particle-config'
        }
      })
    };
    
    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Export as configuration object
   */
  exportAsConfig(config, options = {}) {
    const { format = 'object' } = options;
    
    if (format === 'object') {
      return config;
    } else if (format === 'string') {
      return `const particleConfig = ${JSON.stringify(config, null, 2)};`;
    }
    
    return config;
  }

  /**
   * Export in multiple formats
   */
  exportMultiple(config, formats = ['html', 'react', 'json'], options = {}) {
    const results = {};
    
    formats.forEach(format => {
      if (this.exportFormats[format]) {
        results[format] = this.exportFormats[format](config, options);
      }
    });
    
    return results;
  }

  /**
   * Create download links for exports
   */
  createDownloadLinks(config, formats = ['html', 'react', 'json']) {
    const links = [];
    
    formats.forEach(format => {
      if (this.exportFormats[format]) {
        const content = this.exportFormats[format](config);
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        links.push({
          format,
          url,
          filename: `particle-background.${format === 'json' ? 'json' : format === 'react' ? 'tsx' : 'html'}`
        });
      }
    });
    
    return links;
  }
}

// Export the class
export default ParticleExporter;

