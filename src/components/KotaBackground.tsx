import { useLayoutEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import styles from './KotaBackground.module.css';

gsap.registerPlugin(ScrollTrigger);

gsap.config({
  autoSleep: 60,
  nullTargetWarn: false,
});

gsap.defaults({ duration: 1 / ((1 + Math.sqrt(5)) / 2) });

const CLASSIC_PERLIN = `
vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}

float cnoise21(vec2 P){
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod(Pi, 289.0);
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0;
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);
  vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}
`;

const DotScreenShader = {
  uniforms: {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uMouseEffect: { value: 0.1 },
    uAmount: { value: 0.15 },
    uVelocity: { value: 0 },
    tDiffuse: { value: null as THREE.Texture | null },
    tSize: { value: new THREE.Vector2(256, 256) },
    center: { value: new THREE.Vector2(0.5, 0.5) },
    angle: { value: Math.PI / 2 },
    scale: { value: 1 },
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vPosition;
    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1. );
    }
  `,
  fragmentShader: `
    uniform vec2 center;
    uniform float angle;
    uniform float scale;
    uniform float uTime;
    uniform float uAmount;
    uniform vec2 uMouse;
    uniform float uMouseEffect;
    uniform float uVelocity;
    uniform vec2 tSize;
    uniform sampler2D tDiffuse;

    varying vec2 vUv;
    varying vec3 vPosition;

    ${CLASSIC_PERLIN}

    float pattern() {
      float s = sin( angle ), c = cos( angle );
      vec2 tex = vUv * tSize - center;
      vec2 point = vec2( c * tex.x - s * tex.y, s * tex.x + c * tex.y ) * scale;
      return ( sin( point.x ) * sin( point.y ) ) * 4.0;
    }

    void main() {
      vec2 newUv = vUv;
      vec2 p = 2.0 * vUv - vec2(1.0);
      float uRandom = ${Math.random().toFixed(6)};

      p += 0.3 * uRandom * cos(2.0 * (p.yx * uRandom) + uTime);
      p += 0.4 * uRandom * cos(5.0 * (p.xy * uRandom) + 1.5 * uTime);
      p += 0.2 * uRandom * cos(3.7 * p.yx + 2.5 * uTime);
      p += 0.2 * cos(7.0 * p.yx + 0.5 * uTime);

      vec2 centredUv = 2.0 * vUv - vec2(1.0);
      newUv = vUv + centredUv * vec2(1.0, 1.0);

      newUv.x = mix(vUv.x, length(p), uAmount);
      newUv.y = mix(vUv.y, 0.0, uAmount);

      vec4 color = texture2D( tDiffuse, newUv );
      gl_FragColor = vec4(color.xyz, 1.0);
    }
  `,
};

const backgrounds = [
  {
    mouseEffect: 1,
    distortionAmount: 0.15,
    shapeAmount: 0.2,
    noiseOpacity: 0.4,
    widthMultiplier: 0.6,
    heightMultiplier: 2,
    position: { x: -0.1, y: 0.3 },
    rotation: 0.7,
    speedMultiplier: 1,
    timeStart: 0,
    background: 0xf0220f,
  },
  {
    mouseEffect: 1,
    distortionAmount: 0.15,
    shapeAmount: 0.15,
    noiseOpacity: 0.4,
    widthMultiplier: 0.4,
    heightMultiplier: 2,
    position: { x: -0.1, y: 0.3 },
    rotation: 2.7,
    speedMultiplier: 1,
    timeStart: 100,
    background: 0xf0220f,
  },
  {
    mouseEffect: 1,
    distortionAmount: 0.15,
    shapeAmount: 0.25,
    noiseOpacity: 0.4,
    widthMultiplier: 0.5,
    heightMultiplier: 2,
    position: { x: -0.2, y: 0.3 },
    rotation: 2.5,
    speedMultiplier: 1,
    timeStart: 100,
    background: 0xf0220f,
  },
  {
    mouseEffect: 1,
    distortionAmount: 0.15,
    shapeAmount: 0.25,
    noiseOpacity: 0.4,
    widthMultiplier: 0.6,
    heightMultiplier: 2,
    position: { x: 0.2, y: 0 },
    rotation: 3.5,
    speedMultiplier: 1,
    timeStart: -100,
    background: 0xf0220f,
  },
  {
    mouseEffect: 1,
    distortionAmount: 0.15,
    shapeAmount: 0.25,
    noiseOpacity: 0.4,
    widthMultiplier: 0.5,
    heightMultiplier: 1.9,
    position: { x: -0.3, y: 0.3 },
    rotation: 1.1,
    speedMultiplier: 1,
    timeStart: -100,
    background: 0xf0220f,
  },
  {
    mouseEffect: 1,
    distortionAmount: 0.15,
    shapeAmount: 0.25,
    noiseOpacity: 0.4,
    widthMultiplier: 0.3,
    heightMultiplier: 2,
    position: { x: 0.05, y: -0.1 },
    rotation: 4.7,
    speedMultiplier: 1,
    timeStart: -100,
    background: 0x000000,
  },
] as const;

// Dynamic palette generation based on custom colors
const generatePalette = (customColors: { red: number; green: number; blue: number }) => {
  const baseR = customColors.red;
  const baseG = customColors.green;
  const baseB = customColors.blue;
  
  return [
    `rgb(${Math.round(baseR * 255)}, ${Math.round(baseG * 255)}, ${Math.round(baseB * 255)})`,
    `rgb(${Math.round(baseR * 200)}, ${Math.round(baseG * 200)}, ${Math.round(baseB * 200)})`,
    `rgb(${Math.round(baseR * 150)}, ${Math.round(baseG * 150)}, ${Math.round(baseB * 150)})`,
    `rgb(${Math.round(baseR * 100)}, ${Math.round(baseG * 100)}, ${Math.round(baseB * 100)})`,
    `rgb(${Math.round(baseR * 50)}, ${Math.round(baseG * 50)}, ${Math.round(baseB * 50)})`,
    `rgb(${Math.round(baseR * 25)}, ${Math.round(baseG * 25)}, ${Math.round(baseB * 25)})`
  ];
};

const vertexShader = `
  varying vec2 uPos;
  varying vec2 vUv;
  uniform vec2 uRayMouse;
  uniform float uMouseEffect;
  uniform float uRatio;

  float uTrailWidth = 0.15;

  void main() {
    vUv = uv;
    vec2 direction = normalize(position.xy - uRayMouse);
    float distanceToMouse = length(position.xy - uRayMouse);
    float falloff = smoothstep(0.0, uTrailWidth, distanceToMouse);
    float displacement = uMouseEffect * 0.1 * falloff;
    vec3 newPosition = vec3(position.xy - direction * displacement * 0.5, position.z);
    uPos = direction * displacement * 2.0;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

const createFragmentShader = (paletteLength: number) => `
  uniform float uTime;
  uniform vec2 uRayMouse;
  uniform float uMouseEffect;
  uniform float uNoiseAmount;
  uniform float uAmount;
  uniform float uPow;
  uniform float uAlpha;
  varying vec2 vUv;
  varying vec2 uPos;
  uniform vec3 uColor[${paletteLength}];

  float PI = ${Math.PI};

  ${CLASSIC_PERLIN}

  void main() {
    vec3 firstColor = uColor[0];
    vec2 seed = (vUv * -uPos) * mix(vUv, uPos, 30.0 * uAmount);
    float ml = pow(float(${paletteLength}), 0.5) * -0.01;
    float n = cnoise21(seed) + 1.0 * uTime;
    vec3 color = mix(firstColor, firstColor, cnoise21(seed) / 1000.0);

    for (int i = 1; i < ${paletteLength - 1}; i++) {
      float amount = (float(i) + 1.0) * 0.09;
      float n2 = smoothstep(amount * uTime + ml, amount * uTime + ml + amount * uTime, n * uTime);
      color = mix(color, uColor[i], n2);
    }

    float alpha = uAlpha * pow(sin(vUv.x * PI), uPow);
    alpha *= pow((sin(vUv.y * PI)), uPow);
    gl_FragColor = vec4(color, alpha);
  }
`;

type BackgroundIndex = typeof backgrounds[number];

type WebGLBackgroundOptions = {
  element: HTMLDivElement;
  darkBackground: boolean;
  scrollTriggerOpacity: number;
  variation: number;
  customColors: { red: number; green: number; blue: number } | null;
  colorPalette: Array<{ red: number; green: number; blue: number; name: string }> | null;
  noiseType: string;
  noiseStrength: number;
  // Advanced controls
  particleSpeed: number;
  particleSize: number;
  particleCount: number;
  particleOpacity: number;
  particleTrail: number;
  mouseInteraction: boolean;
  interactionRadius: number;
  interactionStrength: number;
  waveAmplitude: number;
  waveFrequency: number;
  spiralSpeed: number;
  orbitRadius: number;
  orbitSpeed: number;
  motionType: string;
  bloomEffect: boolean;
  bloomIntensity: number;
  bloomThreshold: number;
};

class WebGLBackground {
  private scene = new THREE.Scene();
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private composer: EffectComposer | null = null;
  private effect1: ShaderPass | null = null;
  private geometry!: THREE.PlaneGeometry;
  private plane!: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
  private material!: THREE.ShaderMaterial;
  private positionZ = 4000;
  private width = 0;
  private height = 0;
  private uTime = 0.1;
  private reverseUTime = false;
  private time = 0;
  private uMouse = new THREE.Vector2(0, 0);
  private rayMouse = new THREE.Vector2(1, 1);
  private raycaster = new THREE.Raycaster();
  private allowRayMouse = false;
  private frameId = 0;
  private background: BackgroundIndex;
  private rayXTo: (value: number) => gsap.core.Tween;
  private rayYTo: (value: number) => gsap.core.Tween;
  private container: HTMLDivElement;
  private scrollTriggerOpacity: number;
  private onMouseMove?: (event: MouseEvent) => void;
  private scrollTriggerInstance: ScrollTrigger | null = null;
  private lastPointer = { x: 0, y: 0, time: 0 };
  private advancedParams: any;

  constructor({ 
    element, 
    darkBackground, 
    scrollTriggerOpacity, 
    variation, 
    customColors, 
    colorPalette, 
    noiseType, 
    noiseStrength,
    particleSpeed,
    particleSize,
    particleCount,
    particleOpacity,
    particleTrail,
    mouseInteraction,
    interactionRadius,
    interactionStrength,
    waveAmplitude,
    waveFrequency,
    spiralSpeed,
    orbitRadius,
    orbitSpeed,
    motionType,
    bloomEffect,
    bloomIntensity,
    bloomThreshold
  }: WebGLBackgroundOptions) {
    this.container = element;
    this.background = backgrounds[variation] ?? backgrounds[0];
    this.scrollTriggerOpacity = scrollTriggerOpacity;

    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(this.width, this.height);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.setClearColor(darkBackground ? 0x000000 : this.background.background);
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    this.renderer.domElement.style.display = 'block';
    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(40, this.width / this.height, 10, 10000);
    this.camera.position.z = this.positionZ;
    this.camera.fov = (2 * Math.atan(this.height / 2 / this.positionZ) * 180) / Math.PI;
    this.camera.updateProjectionMatrix();

    this.time = this.background.timeStart;

    this.rayXTo = gsap.quickTo(this.rayMouse, 'x', { duration: 0.75, ease: 'power1', immediateRender: false });
    this.rayYTo = gsap.quickTo(this.rayMouse, 'y', { duration: 0.75, ease: 'power1', immediateRender: false });

    this.initPostProcessing();
    this.addObjects(customColors, colorPalette);
    this.resize();
    
    // Store advanced parameters for use in rendering
    this.advancedParams = {
      particleSpeed,
      particleSize,
      particleCount,
      particleOpacity,
      particleTrail,
      mouseInteraction,
      interactionRadius,
      interactionStrength,
      waveAmplitude,
      waveFrequency,
      spiralSpeed,
      orbitRadius,
      orbitSpeed,
      motionType,
      bloomEffect,
      bloomIntensity,
      bloomThreshold
    };
    this.render();
    this.setupResize();
    this.followMouse();
    this.animateIn(2, 0.5);
  }

  setScrollTrigger(target: HTMLElement) {
    this.scrollTriggerInstance = ScrollTrigger.create({
      trigger: target,
      start: 'top top',
      end: () => `+=${target.offsetHeight}`,
      onUpdate: ({ progress }) => {
        const opacity = Math.max(
          this.scrollTriggerOpacity,
          Math.min(1, 1 - progress * (1 - this.scrollTriggerOpacity)),
        );
        gsap.set(target, { opacity, duration: 3, ease: 'power4.out' });
      },
    });
  }

  private initPostProcessing() {
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.effect1 = new ShaderPass(DotScreenShader);
    this.effect1.uniforms.uAmount.value = this.background.distortionAmount;
    this.effect1.uniforms.uMouseEffect.value = this.background.mouseEffect;
    this.effect1.uniforms.tSize.value = new THREE.Vector2(this.width, this.height);
    this.composer.addPass(this.effect1);
  }

  private addObjects(customColors: { red: number; green: number; blue: number } | null, colorPalette: Array<{ red: number; green: number; blue: number; name: string }> | null) {
    // Generate palette colors based on mode
    let paletteColors: THREE.Color[];
    
    if (colorPalette && colorPalette.length > 0) {
      // Multi-color mode: use the provided color palette
      paletteColors = colorPalette.map((color) => new THREE.Color(color.red, color.green, color.blue));
    } else if (customColors) {
      // Single color mode: generate variations from the single color
      const customPalette = generatePalette(customColors);
      paletteColors = customPalette.map((color) => new THREE.Color(color));
    } else {
      // Fallback to default colors
      const defaultPalette = generatePalette({ red: 0.45, green: 0.18, blue: 0.82 });
      paletteColors = defaultPalette.map((color) => new THREE.Color(color));
    }
    
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uNoiseAmount: { value: this.background.noiseOpacity },
        uRayMouse: { value: this.uMouse },
        uAmount: { value: this.background.shapeAmount },
        uPow: { value: 3 },
        uAlpha: { value: 0 },
        uColor: { value: paletteColors },
        uMouseEffect: { value: this.background.mouseEffect },
        uVelocity: { value: 0 },
        uRatio: { value: 1 },
      },
      vertexShader,
      fragmentShader: createFragmentShader(paletteColors.length),
      transparent: true,
      side: THREE.DoubleSide,
    });

    this.geometry = new THREE.PlaneGeometry(1, 1, 128, 128);
    this.plane = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.plane);
    this.camera.rotation.z = this.background.rotation;
    this.initResponsivePositioning();
  }

  private initResponsivePositioning() {
    this.plane.scale.x = this.background.widthMultiplier * this.width;
    this.plane.scale.y = this.background.heightMultiplier * (1.25 * this.height);
    this.plane.scale.z = this.background.widthMultiplier * this.width;
    this.camera.position.x = this.background.position.x * this.width;
    this.camera.position.y = -this.background.position.y * this.height;
    this.plane.material.uniforms.uRatio.value = this.plane.scale.x / this.plane.scale.y;
    this.effect1?.uniforms.tSize.value.set(this.width, this.height);
  }

  private render = () => {
    this.time += 0.01 * (this.advancedParams?.particleSpeed || 1.0);

    if (this.reverseUTime) {
      this.uTime -= 0.001;
      if (this.uTime < 0.1) this.reverseUTime = false;
    } else {
      this.uTime += 0.001;
      if (this.uTime > 0.5) this.reverseUTime = true;
    }

    this.material.uniforms.uTime.value = this.uTime;
    this.material.uniforms.uRayMouse.value = this.rayMouse;

    // Apply advanced parameters
    if (this.advancedParams) {
      // Update particle opacity
      if (this.material.uniforms.uAlpha) {
        this.material.uniforms.uAlpha.value = this.advancedParams.particleOpacity;
      }
      
      // Update mouse interaction
      if (this.material.uniforms.uMouseEffect) {
        this.material.uniforms.uMouseEffect.value = this.advancedParams.mouseInteraction ? 
          this.advancedParams.interactionStrength : 0;
      }
    }

    if (this.effect1) {
      this.effect1.uniforms.uMouse.value = this.uMouse;
      this.effect1.uniforms.uTime.value = this.time * this.background.speedMultiplier * (this.advancedParams?.particleSpeed || 1.0);
    }

    if (this.composer) {
      this.composer.render();
    } else {
      this.renderer.render(this.scene, this.camera);
    }

    this.frameId = requestAnimationFrame(this.render);
  };

  private followMouse() {
    const xTo = gsap.quickTo(this.uMouse, 'x', { duration: 0.5, ease: 'power1' });
    const yTo = gsap.quickTo(this.uMouse, 'y', { duration: 0.5, ease: 'power1' });

    this.onMouseMove = (event: MouseEvent) => {
      const x = event.clientX / this.width - 0.5;
      const y = event.clientY / this.height - 0.5;
      xTo(x);
      yTo(y);

      const now = performance.now();
      const deltaTime = Math.max(16, now - this.lastPointer.time);
      const dx = event.clientX - this.lastPointer.x;
      const dy = event.clientY - this.lastPointer.y;
      const velocity = gsap.utils.clamp(0, 0.6, Math.sqrt(dx * dx + dy * dy) / deltaTime * 16);
      if (this.effect1) {
        this.effect1.uniforms.uVelocity.value = velocity;
      }
      this.lastPointer = { x: event.clientX, y: event.clientY, time: now };

      this.checkPositionOnPlane(event);
    };

    window.addEventListener('mousemove', this.onMouseMove);
  }

  private checkPositionOnPlane(event: MouseEvent) {
    const pointer = new THREE.Vector2();
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    this.raycaster.setFromCamera(pointer, this.camera);
    const intersects = this.raycaster.intersectObject(this.plane);
    if (intersects.length > 0 && this.allowRayMouse) {
      this.rayXTo(intersects[0].point.x / this.plane.scale.x);
      this.rayYTo(intersects[0].point.y / this.plane.scale.y);
    }
  }

  private setupResize() {
    window.addEventListener('resize', this.resize);
  }

  private resize = () => {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.camera.aspect = this.width / this.height;
    this.camera.fov = (2 * Math.atan(this.height / 2 / this.positionZ) * 180) / Math.PI;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
    this.composer?.setSize(this.width, this.height);
    this.initResponsivePositioning();
  };

  private animateIn(duration: number, delay: number) {
    gsap.to(this.material.uniforms.uPow, { value: 1.5, duration, delay, ease: 'power4.out' });
    gsap.to(this.material.uniforms.uAlpha, { value: 1, duration, delay, ease: 'power4.out' });
    this.allowRayMouse = false;
    gsap.to(this.rayMouse, {
      x: -0.4,
      y: -0.4,
      duration,
      ease: 'power1.out',
      onComplete: () => {
        this.allowRayMouse = true;
      },
    });
  }

  private animateOut(duration: number, delay: number) {
    gsap.to(this.material.uniforms.uPow, { value: 3, duration, delay, ease: 'power4.out' });
    gsap.to(this.material.uniforms.uAlpha, { value: 0, duration, delay, ease: 'power4.out' });
    this.allowRayMouse = false;
    gsap.to(this.rayMouse, {
      x: 1,
      y: 1,
      duration: duration * 2,
      ease: 'power4.out',
      onComplete: () => {
        this.allowRayMouse = true;
      },
    });
  }

  updateColors(customColors: { red: number; green: number; blue: number } | null, colorPalette: Array<{ red: number; green: number; blue: number; name: string }> | null) {
    let paletteColors: THREE.Color[];
    
    if (colorPalette && colorPalette.length > 0) {
      // Multi-color mode: use the provided color palette
      paletteColors = colorPalette.map((color) => new THREE.Color(color.red, color.green, color.blue));
    } else if (customColors) {
      // Single color mode: generate variations from the single color
      const customPalette = generatePalette(customColors);
      paletteColors = customPalette.map((color) => new THREE.Color(color));
    } else {
      // Fallback to default colors
      const defaultPalette = generatePalette({ red: 0.45, green: 0.18, blue: 0.82 });
      paletteColors = defaultPalette.map((color) => new THREE.Color(color));
    }
    
    this.material.uniforms.uColor.value = paletteColors;
  }

  destroy() {
    window.removeEventListener('resize', this.resize);
    if (this.onMouseMove) {
      window.removeEventListener('mousemove', this.onMouseMove);
    }
    cancelAnimationFrame(this.frameId);
    this.scrollTriggerInstance?.kill();
    this.geometry?.dispose();
    this.material?.dispose();
    this.renderer?.dispose();
    if (this.container.contains(this.renderer.domElement)) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}

type KotaBackgroundProps = {
  variation?: number;
  scrollTrigger?: boolean;
  scrollTriggerOpacity?: number;
  darkBackground?: boolean;
  position?: 'fixed' | 'absolute' | 'relative';
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
  // Advanced controls
  particleSpeed?: number;
  particleSize?: number;
  particleCount?: number;
  particleOpacity?: number;
  particleTrail?: number;
  mouseInteraction?: boolean;
  interactionRadius?: number;
  interactionStrength?: number;
  waveAmplitude?: number;
  waveFrequency?: number;
  spiralSpeed?: number;
  orbitRadius?: number;
  orbitSpeed?: number;
  motionType?: string;
  bloomEffect?: boolean;
  bloomIntensity?: number;
  bloomThreshold?: number;
};

export default function KotaBackground({
  variation = 0,
  scrollTrigger = false,
  scrollTriggerOpacity = 0.5,
  darkBackground = false,
  position = 'fixed',
  noise = true,
  customColors = { red: 0.45, green: 0.18, blue: 0.82 },
  colorPalette = null,
  noiseType = 'gradient',
  noiseStrength = 0.5,
  // Advanced controls with defaults
  particleSpeed = 1.0,
  particleSize = 1.0,
  particleCount = 1000,
  particleOpacity = 0.8,
  particleTrail = 0.5,
  mouseInteraction = true,
  interactionRadius = 0.3,
  interactionStrength = 0.5,
  waveAmplitude = 1.0,
  waveFrequency = 1.0,
  spiralSpeed = 1.0,
  orbitRadius = 1.0,
  orbitSpeed = 1.0,
  motionType = 'organic',
  bloomEffect = false,
  bloomIntensity = 0.5,
  bloomThreshold = 0.5,
}: KotaBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<WebGLBackground | null>(null);

  useLayoutEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const background = new WebGLBackground({
      element,
      darkBackground,
      scrollTriggerOpacity,
      variation,
      customColors,
      colorPalette,
      noiseType,
      noiseStrength,
      particleSpeed,
      particleSize,
      particleCount,
      particleOpacity,
      particleTrail,
      mouseInteraction,
      interactionRadius,
      interactionStrength,
      waveAmplitude,
      waveFrequency,
      spiralSpeed,
      orbitRadius,
      orbitSpeed,
      motionType,
      bloomEffect,
      bloomIntensity,
      bloomThreshold,
    });

    backgroundRef.current = background;

    if (scrollTrigger) {
      background.setScrollTrigger(element);
    }

    return () => {
      background.destroy();
      backgroundRef.current = null;
    };
  }, [
    darkBackground, 
    variation, 
    scrollTrigger, 
    scrollTriggerOpacity,
    customColors,
    colorPalette,
    noiseType,
    noiseStrength,
    particleSpeed,
    particleSize,
    particleCount,
    particleOpacity,
    particleTrail,
    mouseInteraction,
    interactionRadius,
    interactionStrength,
    waveAmplitude,
    waveFrequency,
    spiralSpeed,
    orbitRadius,
    orbitSpeed,
    motionType,
    bloomEffect,
    bloomIntensity,
    bloomThreshold
  ]);

  // Update colors when customColors or colorPalette change
  useLayoutEffect(() => {
    if (backgroundRef.current) {
      backgroundRef.current.updateColors(customColors, colorPalette);
    }
  }, [customColors, colorPalette]);

  return (
    <div
      ref={containerRef}
      className={styles.container}
      data-background={variation}
      data-dark-background={darkBackground}
      data-position={position}
      data-noise={noise}
    >
      {noise && (
        <div 
          className={styles.noise} 
          data-noise-type={noiseType}
          style={{ 
            opacity: noiseStrength * 0.8,
            '--noise-strength': noiseStrength
          } as React.CSSProperties}
          aria-hidden 
        />
      )}
    </div>
  );
}
