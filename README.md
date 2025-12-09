# ✨ AR Makeup Studio

A real-time AR makeup application with advanced face tracking and interactive brush tools. Apply makeup directly on your face through your camera with precise facial region detection and natural face-locked rendering.

![AR Makeup Studio](https://img.shields.io/badge/AR-Makeup-purple?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue?style=for-the-badge&logo=typescript)
![MediaPipe](https://img.shields.io/badge/MediaPipe-Face_Mesh-green?style=for-the-badge)

## 🎯 Features

### 1. **Real-Time Face Tracking**
- **468 Facial Landmarks**: Ultra-precise face mesh using MediaPipe Face Mesh
- **30-60 FPS Performance**: Smooth, lag-free tracking
- **Stable Tracking**: Makeup stays locked to your face even as you move or turn
- **Automatic Detection**: Instant face detection when you enter the camera view

### 2. **Interactive Brush Tool**
- **Direct Drawing**: Draw makeup directly on your face using mouse or touch
- **Smart Snapping**: Brush strokes automatically snap to the correct facial region
- **Region Constraints**: Makeup stays within boundaries (no bleeding or leaking)
- **Natural Blending**: Smooth, realistic edges with soft feathering

### 3. **Smart Boundary Detection**
Precise region detection for:
- 👄 **Lips**: Upper and lower lip contours with corner detection
- 👁️ **Eyes**: Eyelid regions for eyeshadow application
- 🌸 **Cheeks**: Natural blush placement areas
- ✨ **Contour**: Face contour and jawline definition
- ✏️ **Eyeliner**: Eye outline for precise liner application
- 👁️ **Brows**: Eyebrow regions for shaping and filling

### 4. **Realistic Makeup Rendering**
- **Blend Modes**: Normal, Multiply, Overlay, and Screen for different effects
- **Adjustable Opacity**: Control makeup intensity (10% - 100%)
- **Variable Brush Size**: 5px - 80px for different application styles
- **Color Picker**: Full color spectrum for custom shades
- **Layer System**: Multiple makeup layers with independent controls

### 5. **Face-Locked Makeup**
- **Motion Tracking**: Makeup follows facial movements naturally
- **Expression Adaptation**: Adjusts to smiles, frowns, and other expressions
- **Persistent Application**: Makeup stays applied throughout the session
- **Smooth Warping**: Natural deformation with facial movements

### 6. **Comprehensive UI Controls**

#### Makeup Types
- 💄 Lipstick
- 👁️ Eyeshadow
- 🌸 Blush
- ✨ Contour
- ✏️ Eyeliner
- 👁️ Brows

#### Brush Settings
- **Size**: Adjustable brush diameter
- **Opacity**: Control transparency
- **Color**: Full color palette
- **Blend Mode**: Multiple blending options

#### Actions
- **↶ Undo**: Remove last stroke
- **↷ Redo**: Restore undone stroke
- **✕ Clear All**: Reset all makeup
- **⟳ Switch Camera**: Toggle front/back camera

### 7. **Performance Optimized**
- **Efficient Rendering**: Separate canvas layers for optimal performance
- **Landmark Smoothing**: Reduces jitter for stable makeup application
- **RequestAnimationFrame**: Smooth 60 FPS rendering loop
- **Lazy Loading**: MediaPipe models loaded via CDN

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn
- Modern web browser with camera access (Chrome, Firefox, Safari, Edge)
- HTTPS connection (required for camera access)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/AR-makeup.git
cd AR-makeup

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:3000`

### Building for Production

```bash
# Create optimized production build
npm run build

# Preview production build
npm run preview
```

## 💡 Usage Instructions

### Basic Usage

1. **Allow Camera Access**: Grant permission when prompted
2. **Position Your Face**: Center your face in the camera view
3. **Wait for Detection**: The app will automatically detect your face (green indicator)
4. **Select Makeup Type**: Choose from lipstick, eyeshadow, blush, etc.
5. **Draw on Your Face**: Click/touch and drag to apply makeup
6. **Adjust Settings**: Modify brush size, color, and opacity as needed

### Tips for Best Results

🎯 **Select the right region**: Choose the appropriate makeup type before drawing

🖌️ **Start with lower opacity**: Build up intensity gradually for natural looks

👤 **Keep face centered**: Stay within camera view for stable tracking

📱 **Use adequate lighting**: Better lighting improves tracking accuracy

🎨 **Experiment with blend modes**: Different modes create different effects

✨ **Adjust brush size**: Use smaller brushes for precision work

### Keyboard Shortcuts (Desktop)

- `Ctrl/Cmd + Z`: Undo
- `Ctrl/Cmd + Shift + Z`: Redo
- `Esc`: Clear all makeup

## 🏗️ Architecture

### Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Face Tracking**: MediaPipe Face Mesh
- **ML Backend**: TensorFlow.js
- **Rendering**: HTML5 Canvas API
- **Styling**: CSS3 with Flexbox/Grid

### Project Structure

```
AR-makeup/
├── src/
│   ├── components/
│   │   ├── ARMakeupCanvas.tsx    # Main canvas with face tracking
│   │   ├── ARMakeupCanvas.css
│   │   ├── ControlPanel.tsx      # UI controls
│   │   └── ControlPanel.css
│   ├── hooks/
│   │   ├── useFaceTracking.ts    # Face tracking hook
│   │   └── useMakeup.ts          # Makeup state management
│   ├── utils/
│   │   ├── faceTracking.ts       # MediaPipe wrapper
│   │   ├── facialRegions.ts      # Region detection logic
│   │   └── makeupRenderer.ts     # Canvas rendering engine
│   ├── types.ts                   # TypeScript interfaces
│   ├── App.tsx                    # Main app component
│   ├── App.css
│   ├── main.tsx                   # App entry point
│   └── index.css
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

### Key Components

#### FaceTracker
Wraps MediaPipe Face Mesh for face detection and landmark extraction.

#### MakeupRenderer
Canvas-based rendering engine with:
- Video feed rendering
- Makeup layer compositing
- Blend mode support
- Region clipping

#### Facial Region Detection
468-landmark mapping to facial regions with:
- Polygon generation
- Point-in-polygon testing
- Boundary constraint system

## 🔧 Configuration

### MediaPipe Settings

Located in `src/utils/faceTracking.ts`:

```typescript
faceMesh.setOptions({
  maxNumFaces: 1,              // Track one face
  refineLandmarks: true,       // High accuracy mode
  minDetectionConfidence: 0.5, // Detection threshold
  minTrackingConfidence: 0.5   // Tracking threshold
});
```

### Camera Settings

Located in `src/types.ts`:

```typescript
interface CameraSettings {
  facingMode: 'user' | 'environment';
  width: number;   // 1280 recommended
  height: number;  // 720 recommended
}
```

## 🎨 Customization

### Adding New Makeup Regions

1. Define landmark indices in `src/utils/facialRegions.ts`:

```typescript
export const FACIAL_REGIONS: Record<MakeupType, FacialRegion> = {
  newRegion: {
    name: 'New Region',
    indices: [/* landmark indices */]
  }
};
```

2. Add to makeup type selector in `src/components/ControlPanel.tsx`

3. Update type definition in `src/types.ts`

### Customizing Blend Modes

Modify blend modes in `src/components/ControlPanel.tsx`:

```typescript
const BLEND_MODES = [
  { value: 'normal', label: 'Normal' },
  { value: 'multiply', label: 'Multiply' },
  // Add more modes
];
```

## 📱 Browser Compatibility

| Browser | Desktop | Mobile |
|---------|---------|--------|
| Chrome  | ✅ Full | ✅ Full |
| Firefox | ✅ Full | ✅ Full |
| Safari  | ✅ Full | ✅ Full |
| Edge    | ✅ Full | ✅ Full |

**Requirements**:
- WebRTC/MediaDevices API
- Canvas API
- WebGL (for TensorFlow.js)
- ES2020+ JavaScript support

## 🐛 Troubleshooting

### Camera Not Working
- Ensure HTTPS connection (required for camera access)
- Check browser permissions
- Verify camera is not in use by another application

### Face Not Detecting
- Improve lighting conditions
- Position face centered in view
- Check browser console for errors

### Performance Issues
- Close other browser tabs
- Reduce brush size for faster rendering
- Ensure adequate GPU resources
- Use Chrome/Edge for best WebGL performance

### Makeup Not Staying on Face
- Wait for face tracking to stabilize (green indicator)
- Keep face within camera frame
- Avoid rapid head movements during application

## 🚧 Known Limitations

- Single face tracking only (one person at a time)
- Requires decent lighting for optimal tracking
- Heavy makeup application may impact performance
- Camera access requires HTTPS in production

## 🔮 Future Enhancements

- [ ] Multi-face tracking support
- [ ] Makeup presets and templates
- [ ] Save/load makeup looks
- [ ] Export images with makeup applied
- [ ] Video recording with makeup
- [ ] Social sharing features
- [ ] AI-powered makeup recommendations
- [ ] Virtual try-on for specific product brands

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- **MediaPipe**: Face Mesh model by Google
- **TensorFlow.js**: ML framework for browser
- **React**: UI framework
- **Vite**: Build tool

## 📞 Support

For issues, questions, or feature requests:
- Open an issue on GitHub
- Check existing documentation
- Review troubleshooting section

---

**Built with ❤️ using React, TypeScript, and MediaPipe**

*Real-time AR makeup for everyone, everywhere.*
