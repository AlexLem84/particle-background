import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ParticleBackgroundProps {
  numParticles?: number;
  particleSize?: number;
  particleColor?: string;
  particleColor2?: string;
  particleColor3?: string;
  colorVariation?: number;
  gradientIntensity?: number;
  noiseScale?: number;
  noiseSpeed?: number;
  motionMagnitude?: number;
  interactionRadius?: number;
  interactionStrength?: number;
  backgroundColor?: string;
  motionType?: string;
  spiralSpeed?: number;
  waveAmplitude?: number;
  waveFrequency?: number;
  orbitRadius?: number;
  orbitSpeed?: number;
}

export default function ParticleBackground({
  numParticles = 15000,
  particleSize = 1.2,
  particleColor = '#0066ff', // Blue
  particleColor2 = '#8a2be2', // Purple  
  particleColor3 = '#ff69b4', // Pink
  colorVariation = 0.05,
  gradientIntensity = 1.0,
  noiseScale = 1.5,
  noiseSpeed = 0.015,
  motionMagnitude = 0.8,
  interactionRadius = 80,
  interactionStrength = 40,
  backgroundColor = '#0a0a0a',
  motionType = 'noise',
  spiralSpeed = 0.3,
  waveAmplitude = 8.0,
  waveFrequency = 0.08,
  orbitRadius = 15.0,
  orbitSpeed = 0.2
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const particlesRef = useRef<THREE.Points>();
  const animationIdRef = useRef<number>();
  const mouseRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const targetMouseRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const [isInitialized, setIsInitialized] = useState(false);

  // Helper function to convert motion type string to number
  const getMotionTypeValue = (type: string): number => {
    const motionTypes: { [key: string]: number } = {
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
  };

  // GLSL Shaders - Optimized for smooth wave-like motion
  const vertexShader = `
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

    // Optimized noise function for smoother motion
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

    // Spiral motion
    vec3 spiralMotion(vec3 pos, float time, float speed) {
        float angle = time * speed + pos.x * 0.01 + pos.y * 0.01;
        float radius = length(pos.xy);
        float spiralZ = sin(angle + radius * 0.1) * 5.0;
        return vec3(pos.x, pos.y, pos.z + spiralZ);
    }

    // Wave motion
    vec3 waveMotion(vec3 pos, float time, float amplitude, float frequency) {
        float wave1 = sin(pos.x * frequency + time) * amplitude;
        float wave2 = cos(pos.y * frequency + time * 0.7) * amplitude * 0.5;
        return vec3(pos.x, pos.y, pos.z + wave1 + wave2);
    }

    // Orbital motion
    vec3 orbitalMotion(vec3 pos, float time, float radius, float speed) {
        float angle = time * speed + aRandom * 6.28;
        float orbitX = cos(angle) * radius;
        float orbitY = sin(angle) * radius;
        return vec3(pos.x + orbitX, pos.y + orbitY, pos.z);
    }

    // Swirl motion
    vec3 swirlMotion(vec3 pos, float time, float speed) {
        float angle = atan(pos.y, pos.x) + time * speed;
        float radius = length(pos.xy);
        float swirlX = cos(angle) * radius;
        float swirlY = sin(angle) * radius;
        return vec3(swirlX, swirlY, pos.z + sin(angle + time) * 3.0);
    }

    // Pulsing motion
    vec3 pulsingMotion(vec3 pos, float time, float speed) {
        float pulse = sin(time * speed + aRandom * 6.28) * 0.5 + 0.5;
        return vec3(pos.x * pulse, pos.y * pulse, pos.z + pulse * 10.0);
    }

    void main() {
        vec3 displacedPosition = position;

        // Enhanced organic movement with multiple noise layers
        float time = uTime * uNoiseSpeed;
        
        // Primary noise for main movement
        float noise1 = noise(displacedPosition * uNoiseScale + time);
        float noise2 = noise(displacedPosition * uNoiseScale * 2.0 + time * 1.3);
        float noise3 = noise(displacedPosition * uNoiseScale * 0.5 + time * 0.7);
        
        // Apply different motion types based on uMotionType
        if (uMotionType == 0) {
            // Smooth wave motion like the original source code
            float wave1 = sin(displacedPosition.x * 0.02 + time * 0.5) * 8.0;
            float wave2 = sin(displacedPosition.x * 0.01 + time * 0.3) * 4.0;
            float wave3 = sin(displacedPosition.x * 0.03 + time * 0.7) * 3.0;
            displacedPosition.y += (wave1 + wave2 + wave3) * uMotionMagnitude;
            
            // Enhanced Z movement for depth with organic feel
            displacedPosition.z += sin(displacedPosition.x * 0.005 + time * 0.2) * uMotionMagnitude * 1.5;
            displacedPosition.z += cos(displacedPosition.y * 0.003 + time * 0.15) * uMotionMagnitude * 1.0;
        } else if (uMotionType == 1) {
            // Enhanced spiral motion
            displacedPosition = spiralMotion(displacedPosition, uTime, uSpiralSpeed);
            displacedPosition.z += noise1 * uMotionMagnitude * 0.5;
        } else if (uMotionType == 2) {
            // Enhanced wave motion
            displacedPosition = waveMotion(displacedPosition, uTime, uWaveAmplitude, uWaveFrequency);
            displacedPosition.x += noise2 * uMotionMagnitude * 0.2;
        } else if (uMotionType == 3) {
            // Enhanced orbital motion
            displacedPosition = orbitalMotion(displacedPosition, uTime, uOrbitRadius, uOrbitSpeed);
            displacedPosition.z += noise3 * uMotionMagnitude * 0.4;
        } else if (uMotionType == 4) {
            // Enhanced swirl motion
            displacedPosition = swirlMotion(displacedPosition, uTime, uSpiralSpeed);
            displacedPosition.z += noise1 * uMotionMagnitude * 0.3;
        } else if (uMotionType == 5) {
            // Enhanced pulsing motion
            displacedPosition = pulsingMotion(displacedPosition, uTime, uSpiralSpeed);
            displacedPosition.z += noise2 * uMotionMagnitude * 0.4;
        } else if (uMotionType == 6) {
            // Enhanced combined motion
            displacedPosition.z += (noise1 + noise2 * 0.5) * uMotionMagnitude * 0.5;
            displacedPosition = waveMotion(displacedPosition, uTime, uWaveAmplitude * 0.5, uWaveFrequency);
            displacedPosition.x += noise3 * uMotionMagnitude * 0.2;
        } else if (uMotionType == 7) {
            // Organic flowing motion (like in your video) with full 3D movement
            displacedPosition.z += (noise1 + noise2 * 0.7 + noise3 * 0.3) * uMotionMagnitude;
            displacedPosition.x += (noise2 + noise1 * 0.5) * uMotionMagnitude * 0.8;
            displacedPosition.y += (noise3 + noise2 * 0.4) * uMotionMagnitude * 0.8;
            
            // Add subtle rotation for organic feel
            float organicAngle = uTime * 0.02 + displacedPosition.x * 0.01;
            displacedPosition.xy = vec2(
                displacedPosition.x * cos(organicAngle) - displacedPosition.y * sin(organicAngle),
                displacedPosition.x * sin(organicAngle) + displacedPosition.y * cos(organicAngle)
            );
            
            // Add more 3D rotation for depth
            float depthAngle = uTime * 0.01 + displacedPosition.y * 0.005;
            displacedPosition.xz = vec2(
                displacedPosition.x * cos(depthAngle) - displacedPosition.z * sin(depthAngle),
                displacedPosition.x * sin(depthAngle) + displacedPosition.z * cos(depthAngle)
            );
        } else if (uMotionType == 8) {
            // Full 3D motion with equal emphasis on all axes
            displacedPosition.x += (noise1 + noise2 * 0.6) * uMotionMagnitude;
            displacedPosition.y += (noise2 + noise3 * 0.6) * uMotionMagnitude;
            displacedPosition.z += (noise3 + noise1 * 0.6) * uMotionMagnitude;
            
            // Add 3D rotation for dynamic movement
            float time3D = uTime * 0.03;
            float rotX = time3D + displacedPosition.y * 0.01;
            float rotY = time3D * 1.2 + displacedPosition.z * 0.01;
            float rotZ = time3D * 0.8 + displacedPosition.x * 0.01;
            
            // Apply rotations around all axes
            displacedPosition.yz = vec2(
                displacedPosition.y * cos(rotX) - displacedPosition.z * sin(rotX),
                displacedPosition.y * sin(rotX) + displacedPosition.z * cos(rotX)
            );
            displacedPosition.xz = vec2(
                displacedPosition.x * cos(rotY) - displacedPosition.z * sin(rotY),
                displacedPosition.x * sin(rotY) + displacedPosition.z * cos(rotY)
            );
            displacedPosition.xy = vec2(
                displacedPosition.x * cos(rotZ) - displacedPosition.y * sin(rotZ),
                displacedPosition.x * sin(rotZ) + displacedPosition.y * cos(rotZ)
            );
        }

        // Smooth ripple effect from mouse interaction
        float dist = distance(displacedPosition.xy, uMouse.xy);
        if (dist < uInteractionRadius) {
            // Create smooth ripple effect
            float ripple = sin(dist * 0.1 - uTime * 2.0) * smoothstep(uInteractionRadius, 0.0, dist);
            displacedPosition.y += ripple * uInteractionStrength * 0.1;
            
            // Subtle push away from mouse
            vec2 mouseDir = normalize(displacedPosition.xy - uMouse.xy);
            float pushStrength = smoothstep(uInteractionRadius, 0.0, dist) * 0.5;
            displacedPosition.xy += mouseDir * pushStrength * uInteractionStrength * 0.01;
        }

        // Add subtle global rotation for organic feel
        float globalAngle = uTime * 0.05;
        float cosA = cos(globalAngle);
        float sinA = sin(globalAngle);
        displacedPosition.xy = vec2(
            displacedPosition.x * cosA - displacedPosition.y * sinA,
            displacedPosition.x * sinA + displacedPosition.y * cosA
        );

        vec4 modelViewPosition = modelViewMatrix * vec4(displacedPosition, 1.0);
        
        // Enhanced size variation based on distance and noise
        float distanceScale = 300.0 / -modelViewPosition.z;
        float sizeVariation = 1.0 + sin(displacedPosition.x * 0.1 + uTime) * 0.3;
        float noiseSize = 1.0 + noise(displacedPosition * 0.5 + uTime) * 0.2;
        
        gl_PointSize = uSize * uPixelRatio * distanceScale * sizeVariation * noiseSize;
        gl_Position = projectionMatrix * modelViewPosition;
    }
  `;

  const fragmentShader = `
    uniform vec3 uColor;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    uniform float uColorVariation;
    uniform float uGradientIntensity;
    uniform float uTime;

    void main() {
        // Enhanced particle shape with soft edges
        float r = 0.5;
        vec2 cxy = 2.0 * gl_PointCoord - 1.0;
        float dist = length(cxy);
        
        // Soft circular particle with inner glow
        float alpha = 1.0 - smoothstep(0.0, r, dist);
        float innerGlow = 1.0 - smoothstep(0.0, r * 0.3, dist);
        alpha = max(alpha, innerGlow * 0.4);
        
        // Create smooth vertical gradient based on particle Y position
        float gradient = (gl_PointCoord.y + 1.0) * 0.5; // Map from -1,1 to 0,1
        gradient = clamp(gradient, 0.0, 1.0);
        
        // Smooth gradient: Blue (top) -> Purple (middle) -> Pink (bottom)
        vec3 finalColor;
        if (gradient < 0.5) {
            // Blue to Purple
            float t = gradient * 2.0;
            finalColor = mix(uColor, uColor2, t);
        } else {
            // Purple to Pink
            float t = (gradient - 0.5) * 2.0;
            finalColor = mix(uColor2, uColor3, t);
        }
        
        // Subtle color variation for organic feel
        float variation = sin(gl_PointCoord.x * 3.0 + uTime * 0.3) * uColorVariation * 0.05;
        finalColor += vec3(variation, variation * 0.3, -variation * 0.2);
        
        // Add distance-based alpha for depth
        float distanceAlpha = 1.0 - smoothstep(0.0, 1.0, dist);
        alpha *= distanceAlpha;
        
        // Enhanced glow effect for better visibility
        float glow = 1.0 - smoothstep(0.0, r * 0.7, dist);
        finalColor += vec3(glow * 0.15, glow * 0.08, glow * 0.12);
        
        // Enhanced trail effect for pink particles (high gradient values)
        if (gradient > 0.6) {
            // Pink particles get enhanced trails
            float trailIntensity = (gradient - 0.6) / 0.4; // 0 to 1 for pink particles
            alpha *= (1.0 + trailIntensity * 0.8); // Brighter trails
            finalColor += vec3(trailIntensity * 0.3, 0.0, trailIntensity * 0.2); // Pink trail glow
        }
        
        gl_FragColor = vec4(finalColor, alpha);
    }
  `;

  const initThreeJS = () => {
    if (!canvasRef.current) {
      console.log('Canvas ref not available yet');
      return;
    }

    try {
      console.log('Initializing Three.js...');
      
      // Scene
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(backgroundColor);
      sceneRef.current = scene;

      // Camera
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 50;
      cameraRef.current = camera;

      // Renderer with enhanced settings for particle trails
      const renderer = new THREE.WebGLRenderer({ 
        canvas: canvasRef.current,
        antialias: true,
        alpha: true
      });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x000000, 0.08); // Enhanced trail effect for smooth motion
      rendererRef.current = renderer;

      console.log('Three.js initialized, creating particles...');
      
      // Create particles
      createParticles();

      // Event listeners
      window.addEventListener('resize', onWindowResize);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseleave', onMouseLeave);

      setIsInitialized(true);
      console.log('Particle system ready!');
    } catch (error) {
      console.error('Error initializing Three.js:', error);
    }
  };

  const createParticles = () => {
    if (!sceneRef.current) {
      console.log('Scene not available for particle creation');
      return;
    }
    
    console.log('Creating particles...', { numParticles, particleSize, particleColor });

    console.log(`Creating ${numParticles} particles...`);

    // Remove existing particles
    if (particlesRef.current) {
      sceneRef.current.remove(particlesRef.current);
      particlesRef.current.geometry.dispose();
      particlesRef.current.material.dispose();
    }

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(numParticles * 3);
    const randoms = new Float32Array(numParticles);

    for (let i = 0; i < numParticles; i++) {
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
        uSize: { value: particleSize },
        uColor: { value: new THREE.Color(particleColor) },
        uColor2: { value: new THREE.Color(particleColor2) },
        uColor3: { value: new THREE.Color(particleColor3) },
        uColorVariation: { value: colorVariation },
        uGradientIntensity: { value: gradientIntensity },
        uNoiseScale: { value: noiseScale },
        uNoiseSpeed: { value: noiseSpeed },
        uMotionMagnitude: { value: motionMagnitude },
        uInteractionRadius: { value: interactionRadius },
        uInteractionStrength: { value: interactionStrength },
        uMotionType: { value: getMotionTypeValue(motionType) },
        uSpiralSpeed: { value: spiralSpeed },
        uWaveAmplitude: { value: waveAmplitude },
        uWaveFrequency: { value: waveFrequency },
        uOrbitRadius: { value: orbitRadius },
        uOrbitSpeed: { value: orbitSpeed },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    sceneRef.current.add(particles);
    particlesRef.current = particles;
    
    console.log('Particles created and added to scene');
  };

  const onWindowResize = () => {
    if (!cameraRef.current || !rendererRef.current) return;
    
    cameraRef.current.aspect = window.innerWidth / window.innerHeight;
    cameraRef.current.updateProjectionMatrix();
    rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    
    if (particlesRef.current) {
      particlesRef.current.material.uniforms.uPixelRatio.value = window.devicePixelRatio;
    }
  };

  const onMouseMove = (event: MouseEvent) => {
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current!);
    
    const intersectionPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const intersects = new THREE.Vector3();
    raycaster.ray.intersectPlane(intersectionPlane, intersects);

    if (intersects) {
      targetMouseRef.current.copy(intersects);
    }
  };

  const onMouseLeave = () => {
    targetMouseRef.current.set(0, 0, 0);
  };

  const animate = () => {
    if (!particlesRef.current || !rendererRef.current || !sceneRef.current || !cameraRef.current) {
      console.log('Missing refs for animation:', {
        particles: !!particlesRef.current,
        renderer: !!rendererRef.current,
        scene: !!sceneRef.current,
        camera: !!cameraRef.current
      });
      return;
    }

    particlesRef.current.material.uniforms.uTime.value += 0.01;

    // Smooth mouse interpolation
    mouseRef.current.lerp(targetMouseRef.current, 0.1);
    particlesRef.current.material.uniforms.uMouse.value.copy(mouseRef.current);

    rendererRef.current.render(sceneRef.current, cameraRef.current);
    animationIdRef.current = requestAnimationFrame(animate);
    
    // Debug: log every 60 frames (about once per second)
    if (Math.floor(particlesRef.current.material.uniforms.uTime.value * 100) % 60 === 0) {
      console.log('Animation running, particles:', particlesRef.current.geometry.attributes.position.count);
    }
  };

  useEffect(() => {
    initThreeJS();
    
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      window.removeEventListener('resize', onWindowResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  useEffect(() => {
    if (isInitialized) {
      createParticles();
    }
  }, [numParticles, particleSize, particleColor, particleColor2, particleColor3, colorVariation, gradientIntensity, noiseScale, noiseSpeed, motionMagnitude, interactionRadius, interactionStrength, backgroundColor, motionType, spiralSpeed, waveAmplitude, waveFrequency, orbitRadius, orbitSpeed]);

  useEffect(() => {
    if (isInitialized && particlesRef.current) {
      particlesRef.current.material.uniforms.uSize.value = particleSize;
      particlesRef.current.material.uniforms.uColor.value.set(particleColor);
      particlesRef.current.material.uniforms.uColor2.value.set(particleColor2);
      particlesRef.current.material.uniforms.uColor3.value.set(particleColor3);
      particlesRef.current.material.uniforms.uColorVariation.value = colorVariation;
      particlesRef.current.material.uniforms.uGradientIntensity.value = gradientIntensity;
      particlesRef.current.material.uniforms.uNoiseScale.value = noiseScale;
      particlesRef.current.material.uniforms.uNoiseSpeed.value = noiseSpeed;
      particlesRef.current.material.uniforms.uMotionMagnitude.value = motionMagnitude;
      particlesRef.current.material.uniforms.uInteractionRadius.value = interactionRadius;
      particlesRef.current.material.uniforms.uInteractionStrength.value = interactionStrength;
      particlesRef.current.material.uniforms.uMotionType.value = getMotionTypeValue(motionType);
      particlesRef.current.material.uniforms.uSpiralSpeed.value = spiralSpeed;
      particlesRef.current.material.uniforms.uWaveAmplitude.value = waveAmplitude;
      particlesRef.current.material.uniforms.uWaveFrequency.value = waveFrequency;
      particlesRef.current.material.uniforms.uOrbitRadius.value = orbitRadius;
      particlesRef.current.material.uniforms.uOrbitSpeed.value = orbitSpeed;
    }
  }, [particleSize, particleColor, particleColor2, particleColor3, colorVariation, gradientIntensity, noiseScale, noiseSpeed, motionMagnitude, interactionRadius, interactionStrength, motionType, spiralSpeed, waveAmplitude, waveFrequency, orbitRadius, orbitSpeed]);

  useEffect(() => {
    if (isInitialized && sceneRef.current) {
      sceneRef.current.background = new THREE.Color(backgroundColor);
    }
  }, [backgroundColor]);

  useEffect(() => {
    if (isInitialized) {
      animate();
    }
  }, [isInitialized]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'auto'
      }}
    />
  );
}
