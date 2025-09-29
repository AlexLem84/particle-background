import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ParticleBackgroundProps {
  numParticles?: number;
  particleSize?: number;
  particleColor?: string;
  noiseScale?: number;
  noiseSpeed?: number;
  motionMagnitude?: number;
  interactionRadius?: number;
  interactionStrength?: number;
  backgroundColor?: string;
}

export default function ParticleBackground({
  numParticles = 50000,
  particleSize = 1.0,
  particleColor = '#00aaff',
  noiseScale = 2.0,
  noiseSpeed = 0.02,
  motionMagnitude = 1.0,
  interactionRadius = 100,
  interactionStrength = 50,
  backgroundColor = '#1a1a1a'
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

  // GLSL Shaders
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

    attribute float aRandom;

    // Simple noise function
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

        // Animate noise in 3D space
        float noiseValue = noise(displacedPosition * uNoiseScale + uTime * uNoiseSpeed + aRandom * 0.1);
        displacedPosition.z += noiseValue * uMotionMagnitude;

        // Mouse interaction
        float dist = distance(displacedPosition.xy, uMouse.xy);
        float strength = smoothstep(uInteractionRadius, 0.0, dist);
        displacedPosition.xy += normalize(displacedPosition.xy - uMouse.xy) * strength * uInteractionStrength;

        vec4 modelViewPosition = modelViewMatrix * vec4(displacedPosition, 1.0);
        gl_PointSize = uSize * uPixelRatio;
        gl_Position = projectionMatrix * modelViewPosition;
    }
  `;

  const fragmentShader = `
    uniform vec3 uColor;

    void main() {
        float r = 0.5;
        vec2 cxy = 2.0 * gl_PointCoord - 1.0;
        float alpha = 1.0 - smoothstep(r, r + 0.1, length(cxy));

        gl_FragColor = vec4(uColor, alpha);
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

      // Renderer
      const renderer = new THREE.WebGLRenderer({ 
        canvas: canvasRef.current,
        antialias: true,
        alpha: true
      });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
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
        uNoiseScale: { value: noiseScale },
        uNoiseSpeed: { value: noiseSpeed },
        uMotionMagnitude: { value: motionMagnitude },
        uInteractionRadius: { value: interactionRadius },
        uInteractionStrength: { value: interactionStrength },
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
  }, [numParticles, particleSize, particleColor, noiseScale, noiseSpeed, motionMagnitude, interactionRadius, interactionStrength, backgroundColor]);

  useEffect(() => {
    if (isInitialized && particlesRef.current) {
      particlesRef.current.material.uniforms.uSize.value = particleSize;
      particlesRef.current.material.uniforms.uColor.value.set(particleColor);
      particlesRef.current.material.uniforms.uNoiseScale.value = noiseScale;
      particlesRef.current.material.uniforms.uNoiseSpeed.value = noiseSpeed;
      particlesRef.current.material.uniforms.uMotionMagnitude.value = motionMagnitude;
      particlesRef.current.material.uniforms.uInteractionRadius.value = interactionRadius;
      particlesRef.current.material.uniforms.uInteractionStrength.value = interactionStrength;
    }
  }, [particleSize, particleColor, noiseScale, noiseSpeed, motionMagnitude, interactionRadius, interactionStrength]);

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
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none'
      }}
    />
  );
}
