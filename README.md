# 🪿 GOOSE Photo Booth

An interactive webcam photo booth application built with React, featuring real-time filters, countdown timers, and photo grid generation. Proudly sponsored by **Block** and **Vercel**.

![GOOSE Photo Booth](https://img.shields.io/badge/GOOSE-Photo%20Booth-purple?style=for-the-badge&logo=camera)
![React](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)
![Sponsored by Block](https://img.shields.io/badge/Sponsored%20by-Block-black?style=for-the-badge)
![Sponsored by Vercel](https://img.shields.io/badge/Sponsored%20by-Vercel-black?style=for-the-badge)

## ✨ Features

### 📸 Photo Modes
- **Single Photo**: Take individual photos with instant preview
- **Photo Booth Mode**: Capture 4 photos with countdown timer (3-2-1)
- **Grid Layout**: Automatic photo strip generation in 2x2 grid format

### 🎨 Real-time Filters
- **None**: Natural, unfiltered view
- **Black & White**: Classic grayscale effect
- **Sepia**: Vintage brown tone filter
- **Invert**: Color inversion effect
- **Blur**: Soft focus blur effect
- **High Contrast**: Enhanced contrast for dramatic effect
- **Goose Brand**: Purple-tinted filter with GOOSE watermark

### 🎭 Interactive Animations
- **Smooth Transitions**: Fluid animations throughout the interface
- **Countdown Animation**: Dramatic countdown with pulsing numbers
- **Filter Selection**: Animated filter buttons with hover effects
- **Photo Capture**: Flash effect and smooth photo transitions
- **Header Animation**: Floating title with shimmer effect

### 🖼️ Photo Booth Experience
- **Progressive Capture**: Visual progress indicator during 4-photo session
- **Automatic Timing**: 2-second intervals between photos
- **Grid Generation**: Instant photo strip creation with branding
- **Download Options**: Save individual photos or complete grid

## 🛠️ Technologies Used

### Frontend Framework
- **React 18.2.0**: Modern React with hooks and functional components
- **JavaScript ES6+**: Modern JavaScript features and syntax

### Browser APIs
- **MediaDevices API**: Webcam access and video stream handling
- **Canvas API**: Real-time image processing and filter effects
- **File API**: Photo download functionality

### Styling & Animation
- **CSS3**: Advanced styling with gradients, shadows, and transforms
- **CSS Animations**: Keyframe animations for smooth user interactions
- **Flexbox & Grid**: Modern layout techniques for responsive design
- **Media Queries**: Mobile-first responsive design approach

### Image Processing
- **Canvas 2D Context**: Real-time pixel manipulation for filters
- **ImageData API**: Direct pixel array manipulation for custom effects
- **Base64 Encoding**: Image data conversion for downloads

### Performance Optimizations
- **RequestAnimationFrame**: Smooth real-time filter rendering
- **React Hooks**: Efficient state management and lifecycle handling
- **Cleanup Functions**: Proper resource management and memory cleanup

## 🚀 Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager
- Modern web browser with webcam support
- HTTPS connection (required for webcam access)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd goose-hack
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` (Note: Webcam requires HTTPS in production)

### Production Build

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## 📱 How to Use

### Initial Setup
1. **Grant Camera Permission**: When prompted, allow the app to access your webcam
2. **Camera Feed**: Your webcam feed will appear in the main viewing area

### Taking Single Photos
1. **Choose Filter** (Optional): Click "🎨 Show Filters" to select a real-time filter
2. **Capture**: Click "📷 Single Photo" to take an immediate photo
3. **Review**: Preview your captured photo
4. **Download**: Click "💾 Download" to save the photo to your device

### Photo Booth Session
1. **Start Session**: Click "📸 Photo Booth (4 pics)" to begin
2. **Get Ready**: Position yourself for the first photo
3. **Countdown**: Watch the 3-2-1 countdown for each photo
4. **Multiple Captures**: 4 photos will be taken automatically with 2-second intervals
5. **Progress Tracking**: Monitor progress with the numbered dots at the bottom
6. **Grid View**: After all photos are captured, view your photo booth strip
7. **Download Grid**: Save the complete 2x2 grid with branding

### Filter Options
- **Real-time Preview**: Filters are applied live to the video feed
- **Filter Selection**: Choose from 7 different filter options
- **Active Indicator**: See which filter is currently active
- **Brand Filter**: Try the special "Goose Brand" filter with watermark

## 🎨 Brand Elements

### Sponsored Branding
- **Block Partnership**: Prominently displayed in header and photo grids
- **Vercel Partnership**: Featured alongside Block sponsorship
- **GOOSE Identity**: Animated goose emoji and purple color scheme

### Color Palette
- **Primary Gradient**: Purple to blue gradient (`#667eea` to `#764ba2`)
- **Accent Colors**: White, black, and semi-transparent overlays
- **Brand Colors**: Block black and Vercel triangular design language

### Typography
- **Headers**: Bold, modern sans-serif fonts
- **Body Text**: Clean, readable system fonts
- **Brand Text**: Emphasized sponsorship and branding elements

## 🔧 Technical Architecture

### Component Structure
```
App.js
├── Header (Branding & Sponsors)
├── Filter Selection Interface
├── Camera Container
│   ├── Video Feed
│   ├── Preview Canvas (Filtered)
│   ├── Progress Indicator
│   └── Filter Badge
├── Countdown Overlay
├── Grid View
└── Control Buttons
```

### State Management
- **React Hooks**: useState, useRef, useEffect, useCallback
- **Stream Management**: Camera stream lifecycle handling
- **Photo Storage**: Array-based image storage for grid creation
- **UI State**: Filter selection, mode switching, countdown tracking

### Canvas Processing Pipeline
1. **Video Capture**: Real-time video frame extraction
2. **Mirror Effect**: Horizontal flip for selfie-style display
3. **Filter Application**: Pixel-level image processing
4. **Output Generation**: Base64 image data creation

## 📱 Browser Compatibility

### Supported Browsers
- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

### Required Features
- MediaDevices.getUserMedia API
- Canvas 2D Context
- ES6+ JavaScript support
- CSS3 animations and transforms

## 🔒 Privacy & Security

### Data Handling
- **Local Processing**: All image processing happens in the browser
- **No Server Upload**: Photos are not sent to any external servers
- **User Control**: Complete control over photo capture and downloads
- **Temporary Storage**: Images are only stored temporarily in browser memory

### Permissions
- **Camera Access**: Required for photo capture functionality
- **File Download**: Browser download permission for saving photos

## 🚀 Deployment

### Vercel Deployment (Recommended)
```bash
npm install -g vercel
vercel --prod
```

### HTTPS Requirement
- Webcam access requires HTTPS in production
- Use Vercel, Netlify, or another HTTPS-enabled hosting service
- Local development works with HTTP on localhost

## 🎯 Future Enhancements

### Planned Features
- **Additional Filters**: More creative filter options
- **Video Recording**: Short video clip capture
- **Social Sharing**: Direct sharing to social platforms
- **Template Layouts**: Different grid layout options
- **Custom Branding**: User-customizable watermarks

### Technical Improvements
- **WebRTC Integration**: Peer-to-peer photo sharing
- **PWA Features**: Offline functionality and app installation
- **Performance Optimization**: Faster filter processing
- **Mobile Optimization**: Enhanced touch interface

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Block**: For sponsoring this innovative photo booth project
- **Vercel**: For providing deployment and hosting support
- **React Team**: For the amazing React framework
- **Open Source Community**: For inspiration and best practices

---

**Built with ❤️ by the GOOSE team**

*Proudly sponsored by Block & Vercel*
