/**
 * Particle Background Export - Standalone JavaScript
 * Easy integration for any website
 * 
 * Usage:
 * 1. Include this script in your HTML
 * 2. Call ParticleBackground.init(config) to start
 * 3. Use ParticleBackground.update(config) to change settings
 * 4. Use ParticleBackground.destroy() to remove
 */

class ParticleBackground {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.particles = null;
    this.animationId = null;
    this.mouse = { x: 0, y: 0 };
    this.targetMouse = { x: 0, y: 0 };
    this.container = null;
    this.config = {};
  }

  // Default configuration
  static getDefaultConfig() {
    return {
      numParticles: 15000,
      particleSize: 1.2,
      particleColor: '#0066ff',
      particleColor2: '#8a2be2',
      particleColor3: '#ff69b4',
      colorVariation: 0.05,
      gradientIntensity: 1.0,
      noiseScale: 1.5,
      noiseSpeed: 0.015,
      motionMagnitude: 0.8,
      interactionRadius: 80,
      interactionStrength: 40,
      backgroundColor: '#0a0a0a',
      motionType: 'organic',
      spiralSpeed: 0.3,
      waveAmplitude: 8.0,
      waveFrequency: 0.08,
      orbitRadius: 15.0,
      orbitSpeed: 0.2,
      position: 'fixed',
      zIndex: -1
    };
  }

  // Initialize the particle system
  async init(config = {}) {
    // Load Three.js if not already loaded
    if (typeof THREE === 'undefined') {
      await this.loadThreeJS();
    }

    this.config = { ...ParticleBackground.getDefaultConfig(), ...config };
    
    // Create container
    this.container = document.createElement('div');
    this.container.style.position = this.config.position;
    this.container.style.top = '0';
    this.container.style.left = '0';
    this.container.style.width = '100%';
    this.container.style.height = '100%';
    this.container.style.zIndex = this.config.zIndex;
    this.container.style.pointerEvents = 'none';
    
    document.body.appendChild(this.container);

    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    this.container.appendChild(canvas);

    // Initialize Three.js
    this.initThreeJS(canvas);
    this.setupEventListeners();
    this.animate();

    return this;
  }

  // Load Three.js from CDN
  async loadThreeJS() {
    return new Promise((resolve, reject) => {
      if (typeof THREE !== 'undefined') {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.type = 'module';
      script.innerHTML = `
        import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';
        window.THREE = THREE;
        window.dispatchEvent(new CustomEvent('threejs-loaded'));
      `;
      document.head.appendChild(script);

      window.addEventListener('threejs-loaded', resolve);
      setTimeout(() => reject(new Error('Failed to load Three.js')), 10000);
    });
  }

  // Initialize Three.js scene
  initThreeJS(canvas) {
    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(this.config.backgroundColor);

    // Camera
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 50;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ 
      canvas: canvas,
      antialias: true,
      alpha: true
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x000000, 0.08);

    // Create particles
    this.createParticles();
  }

  // Create particle system
  createParticles() {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.config.numParticles * 3);
    const randoms = new Float32Array(this.config.numParticles);

    for (let i = 0; i < this.config.numParticles; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
      randoms[i] = Math.random();
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0.0 },
        uMouse: { value: new THREE.Vector3() },
        uPixelRatio: { value: window.devicePixelRatio },
        uSize: { value: this.config.particleSize },
        uColor: { value: new THREE.Color(this.config.particleColor) },
        uColor2: { value: new THREE.Color(this.config.particleColor2) },
        uColor3: { value: new THREE.Color(this.config.particleColor3) },
        uColorVariation: { value: this.config.colorVariation },
        uGradientIntensity: { value: this.config.gradientIntensity },
        uNoiseScale: { value: this.config.noiseScale },
        uNoiseSpeed: { value: this.config.noiseSpeed },
        uMotionMagnitude: { value: this.config.motionMagnitude },
        uInteractionRadius: { value: this.config.interactionRadius },
        uInteractionStrength: { value: this.config.interactionStrength },
        uMotionType: { value: this.getMotionTypeValue(this.config.motionType) },
        uSpiralSpeed: { value: this.config.spiralSpeed },
        uWaveAmplitude: { value: this.config.waveAmplitude },
        uWaveFrequency: { value: this.config.waveFrequency },
        uOrbitRadius: { value: this.config.orbitRadius },
        uOrbitSpeed: { value: this.config.orbitSpeed },
      },
      vertexShader: this.getVertexShader(),
      fragmentShader: this.getFragmentShader(),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  // Get motion type value
  getMotionTypeValue(type) {
    const motionTypes = {
      'noise': 0,
      'spiral': 1,
      'wave': 2,
      'orbit': 3,
      'swirl': 4,
      'pulse': 5,
      'combined': 6,
      'organic': 7,
      '3d': 8
    };
    return motionTypes[type] || 0;
  }

  // Vertex shader (simplified version)
  getVertexShader() {
    return `
      uniform float uTime;
      uniform vec3 uMouse;
      uniform float uPixelRatio;
      uniform float uSize;
      uniform float uNoiseScale;
      uniform float uNoiseSpeed;
      uniform float uMotionMagnitude;
      uniform float uInteractionRadius;
      uniform float uInteractionStrength;
      uniform int uMotionType;
      uniform float uSpiralSpeed;
      uniform float uWaveAmplitude;
      uniform float uWaveFrequency;
      uniform float uOrbitRadius;
      uniform float uOrbitSpeed;

      attribute float aRandom;

      float random(vec3 st) {
          return fract(sin(dot(st.xyz, vec3(12.9898,78.233,45.164))) * 43758.5453123);
      }

      float noise(vec3 st) {
          vec3 i = floor(st);
          vec3 f = fract(st);
          
          float a = random(i);
          float b = random(i + vec3(1.0, 0.0, 0.0));
          float c = random(i + vec3(0.0, 1.0, 0.0));
          float d = random(i + vec3(1.0, 1.0, 0.0));
          float e = random(i + vec3(0.0, 0.0, 1.0));
          float f_val = random(i + vec3(1.0, 0.0, 1.0));
          float g = random(i + vec3(0.0, 1.0, 1.0));
          float h = random(i + vec3(1.0, 1.0, 1.0));
          
          vec3 u = f * f * (3.0 - 2.0 * f);
          
          return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y + (e - a) * u.z * (1.0 - u.x) * (1.0 - u.y) + (f_val - b) * u.x * u.z * (1.0 - u.y) + (g - c) * u.y * u.z * (1.0 - u.x) + (h - d) * u.x * u.y * u.z;
      }

      void main() {
          vec3 displacedPosition = position;
          float time = uTime * uNoiseSpeed;
          
          float noise1 = noise(displacedPosition * uNoiseScale + time);
          float noise2 = noise(displacedPosition * uNoiseScale * 2.0 + time * 1.3);
          float noise3 = noise(displacedPosition * uNoiseScale * 0.5 + time * 0.7);
          
          if (uMotionType == 0) {
              float wave1 = sin(displacedPosition.x * 0.02 + time * 0.5) * 8.0;
              float wave2 = sin(displacedPosition.x * 0.01 + time * 0.3) * 4.0;
              float wave3 = sin(displacedPosition.x * 0.03 + time * 0.7) * 3.0;
              displacedPosition.y += (wave1 + wave2 + wave3) * uMotionMagnitude;
              displacedPosition.z += sin(displacedPosition.x * 0.005 + time * 0.2) * uMotionMagnitude * 1.5;
          } else if (uMotionType == 7) {
              displacedPosition.z += (noise1 + noise2 * 0.7 + noise3 * 0.3) * uMotionMagnitude;
              displacedPosition.x += (noise2 + noise1 * 0.5) * uMotionMagnitude * 0.8;
              displacedPosition.y += (noise3 + noise2 * 0.4) * uMotionMagnitude * 0.8;
          }

          float dist = distance(displacedPosition.xy, uMouse.xy);
          if (dist < uInteractionRadius) {
              float ripple = sin(dist * 0.1 - uTime * 2.0) * smoothstep(uInteractionRadius, 0.0, dist);
              displacedPosition.y += ripple * uInteractionStrength * 0.1;
          }

          vec4 modelViewPosition = modelViewMatrix * vec4(displacedPosition, 1.0);
          float distanceScale = 300.0 / -modelViewPosition.z;
          gl_PointSize = uSize * uPixelRatio * distanceScale;
          gl_Position = projectionMatrix * modelViewPosition;
      }
    `;
  }

  // Fragment shader
  getFragmentShader() {
    return `
      uniform vec3 uColor;
      uniform vec3 uColor2;
      uniform vec3 uColor3;
      uniform float uColorVariation;
      uniform float uGradientIntensity;
      uniform float uTime;

      void main() {
          float r = 0.5;
          vec2 cxy = 2.0 * gl_PointCoord - 1.0;
          float dist = length(cxy);
          
          float alpha = 1.0 - smoothstep(0.0, r, dist);
          float innerGlow = 1.0 - smoothstep(0.0, r * 0.3, dist);
          alpha = max(alpha, innerGlow * 0.4);
          
          float gradient = (gl_PointCoord.y + 1.0) * 0.5;
          gradient = clamp(gradient, 0.0, 1.0);
          
          vec3 finalColor;
          if (gradient < 0.5) {
              float t = gradient * 2.0;
              finalColor = mix(uColor, uColor2, t);
          } else {
              float t = (gradient - 0.5) * 2.0;
              finalColor = mix(uColor2, uColor3, t);
          }
          
          float variation = sin(gl_PointCoord.x * 3.0 + uTime * 0.3) * uColorVariation * 0.05;
          finalColor += vec3(variation, variation * 0.3, -variation * 0.2);
          
          float distanceAlpha = 1.0 - smoothstep(0.0, 1.0, dist);
          alpha *= distanceAlpha;
          
          gl_FragColor = vec4(finalColor, alpha);
      }
    `;
  }

  // Setup event listeners
  setupEventListeners() {
    window.addEventListener('resize', () => this.onWindowResize());
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    window.addEventListener('mouseleave', () => this.onMouseLeave());
  }

  // Window resize handler
  onWindowResize() {
    if (!this.camera || !this.renderer) return;
    
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    
    if (this.particles) {
      this.particles.material.uniforms.uPixelRatio.value = window.devicePixelRatio;
    }
  }

  // Mouse move handler
  onMouseMove(event) {
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, this.camera);
    
    const intersectionPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const intersects = new THREE.Vector3();
    raycaster.ray.intersectPlane(intersectionPlane, intersects);

    if (intersects) {
      this.targetMouse.x = intersects.x;
      this.targetMouse.y = intersects.y;
    }
  }

  // Mouse leave handler
  onMouseLeave() {
    this.targetMouse.x = 0;
    this.targetMouse.y = 0;
  }

  // Animation loop
  animate() {
    if (!this.particles || !this.renderer || !this.scene || !this.camera) {
      return;
    }

    this.particles.material.uniforms.uTime.value += 0.01;

    // Smooth mouse interpolation
    this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.1;
    this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.1;
    this.particles.material.uniforms.uMouse.value.set(this.mouse.x, this.mouse.y, 0);

    this.renderer.render(this.scene, this.camera);
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  // Update configuration
  update(newConfig) {
    this.config = { ...this.config, ...newConfig };
    
    if (this.particles) {
      // Update uniforms
      Object.keys(newConfig).forEach(key => {
        const uniform = this.particles.material.uniforms[`u${key.charAt(0).toUpperCase() + key.slice(1)}`];
        if (uniform) {
          if (key.includes('Color')) {
            uniform.value.set(newConfig[key]);
          } else {
            uniform.value = newConfig[key];
          }
        }
      });
    }

    if (newConfig.backgroundColor && this.scene) {
      this.scene.background = new THREE.Color(newConfig.backgroundColor);
    }
  }

  // Destroy the particle system
  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    if (this.particles) {
      this.particles.geometry.dispose();
      this.particles.material.dispose();
    }

    if (this.renderer) {
      this.renderer.dispose();
    }

    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }

    // Remove event listeners
    window.removeEventListener('resize', this.onWindowResize);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseleave', this.onMouseLeave);
  }
}

// Export for use
window.ParticleBackground = ParticleBackground;

// Auto-initialize if data attributes are present
document.addEventListener('DOMContentLoaded', () => {
  const particleElements = document.querySelectorAll('[data-particle-background]');
  
  particleElements.forEach(element => {
    const config = {};
    
    // Parse data attributes
    Object.keys(element.dataset).forEach(key => {
      if (key.startsWith('particle')) {
        const propName = key.replace('particle', '').toLowerCase();
        let value = element.dataset[key];
        
        // Try to parse as JSON, fallback to string
        try {
          value = JSON.parse(value);
        } catch (e) {
          // Keep as string
        }
        
        config[propName] = value;
      }
    });
    
    // Initialize particle background
    const particleBG = new ParticleBackground();
    particleBG.init(config);
    
    // Store reference for later use
    element._particleBackground = particleBG;
  });
});

