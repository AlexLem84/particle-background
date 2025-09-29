# Particle Background Creator

A powerful web application for creating custom particle backgrounds using Three.js, WebGL shaders, and Astro's Islands architecture.

## 🎨 Features

- **Real-time Particle System**: Thousands of particles with GPU-accelerated rendering
- **Custom GLSL Shaders**: Vertex and fragment shaders for advanced visual effects
- **Interactive Controls**: Live parameter adjustment with sliders and color pickers
- **Mouse Interaction**: Particles react dynamically to mouse movement
- **Export Functionality**: Generate standalone HTML files with your custom backgrounds
- **Preset System**: Save and load your favorite configurations
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Technology Stack

- **Astro**: Static site generator with Islands architecture
- **Three.js**: 3D graphics library for WebGL rendering
- **TypeScript**: Type-safe development
- **GLSL**: Custom shaders for GPU-accelerated effects
- **Vite**: Fast build tool and development server

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd particle-background-creator
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:4321`

## 🎮 Usage

### Control Panel

The control panel (right side) allows you to adjust:

**Particle Properties:**
- Number of Particles (1,000 - 100,000)
- Particle Size (0.1 - 5.0)
- Particle Color
- Particle Opacity (0.0 - 1.0)

**Motion & Noise:**
- Noise Scale (0.1 - 20.0)
- Noise Speed (0.001 - 0.1)
- Motion Magnitude (0.0 - 10.0)

**Mouse Interaction:**
- Interaction Radius (10 - 500px)
- Interaction Strength (0 - 100)

**Scene Settings:**
- Background Color

### Export Options

- **Export Code**: Generate a standalone HTML file with your current settings
- **Save Preset**: Save your configuration to localStorage for later use

## 🔧 Technical Details

### Shader System

The application uses custom GLSL shaders for optimal performance:

- **Vertex Shader**: Handles particle positioning, noise displacement, and mouse interaction
- **Fragment Shader**: Manages particle appearance, colors, and transparency
- **Perlin Noise**: 3D noise function for organic particle movement

### Performance Optimization

- **GPU Acceleration**: All particle calculations run on the GPU
- **Instanced Rendering**: Efficient rendering of thousands of particles
- **Astro Islands**: Only the particle system loads JavaScript, keeping the rest of the site fast

### Browser Compatibility

- Modern browsers with WebGL support
- Chrome, Firefox, Safari, Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📁 Project Structure

```
src/
├── components/
│   ├── ParticleBackground.tsx    # Three.js particle system
│   ├── ControlPanel.tsx          # Interactive control interface
│   └── ParticleApp.tsx          # Main application component
├── layouts/
│   └── Layout.astro             # Base HTML layout
└── pages/
    └── index.astro              # Main page
```

## 🎨 Customization

### Adding New Parameters

1. Add the parameter to the `ParticleParameters` interface in `ParticleApp.tsx`
2. Add the control to `ControlPanel.tsx`
3. Update the shader uniforms in `ParticleBackground.tsx`
4. Modify the GLSL shaders as needed

### Custom Shaders

The shader system is modular and can be extended:

- Modify `vertexShader` for particle positioning and movement
- Update `fragmentShader` for visual effects and colors
- Add new uniforms for additional parameters

## 🚀 Deployment

Build for production:
```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you encounter any issues or have questions, please open an issue on GitHub.