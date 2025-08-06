import React, { useState, useRef, useEffect, useCallback } from 'react';
import './App.css';

function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [capturedImages, setCapturedImages] = useState([]);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('none');
  const [showFilters, setShowFilters] = useState(false);
  const [isPhotoBoothMode, setIsPhotoBoothMode] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showGrid, setShowGrid] = useState(false);
  const animationFrameRef = useRef(null);
  const countdownTimerRef = useRef(null);

  const filters = [
    { id: 'none', name: 'None', icon: '🎨' },
    { id: 'grayscale', name: 'Black & White', icon: '⚫' },
    { id: 'sepia', name: 'Sepia', icon: '🟤' },
    { id: 'invert', name: 'Invert', icon: '🔄' },
    { id: 'blur', name: 'Blur', icon: '💫' },
    { id: 'contrast', name: 'High Contrast', icon: '🔲' },
    { id: 'goose', name: 'Goose Brand', icon: '🪿' }
  ];

  useEffect(() => {
    // Start webcam on component mount
    startWebcam();

    // Cleanup function to stop webcam when component unmounts
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (stream && activeFilter !== 'none' && !photoTaken && !showGrid) {
      applyLiveFilter();
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, [activeFilter, stream, photoTaken, showGrid]);

  const startWebcam = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
      setError(null);
    } catch (err) {
      console.error("Error accessing webcam:", err);
      setError("Unable to access webcam. Please ensure you have granted camera permissions.");
    }
  };

  const applyFilterToContext = (context, width, height, filterId) => {
    const imageData = context.getImageData(0, 0, width, height);
    const data = imageData.data;

    switch (filterId) {
      case 'grayscale':
        for (let i = 0; i < data.length; i += 4) {
          const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
          data[i] = gray;
          data[i + 1] = gray;
          data[i + 2] = gray;
        }
        break;

      case 'sepia':
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
          data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
          data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
        }
        break;

      case 'invert':
        for (let i = 0; i < data.length; i += 4) {
          data[i] = 255 - data[i];
          data[i + 1] = 255 - data[i + 1];
          data[i + 2] = 255 - data[i + 2];
        }
        break;

      case 'blur':
        // Simple box blur
        const blurRadius = 3;
        const tempData = new Uint8ClampedArray(data);
        for (let y = blurRadius; y < height - blurRadius; y++) {
          for (let x = blurRadius; x < width - blurRadius; x++) {
            let r = 0, g = 0, b = 0, count = 0;
            for (let dy = -blurRadius; dy <= blurRadius; dy++) {
              for (let dx = -blurRadius; dx <= blurRadius; dx++) {
                const idx = ((y + dy) * width + (x + dx)) * 4;
                r += tempData[idx];
                g += tempData[idx + 1];
                b += tempData[idx + 2];
                count++;
              }
            }
            const idx = (y * width + x) * 4;
            data[idx] = r / count;
            data[idx + 1] = g / count;
            data[idx + 2] = b / count;
          }
        }
        break;

      case 'contrast':
        const factor = 2;
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128));
          data[i + 1] = Math.min(255, Math.max(0, factor * (data[i + 1] - 128) + 128));
          data[i + 2] = Math.min(255, Math.max(0, factor * (data[i + 2] - 128) + 128));
        }
        break;

      case 'goose':
        // Apply a purple tint (Block/Goose brand colors) and add watermark
        for (let i = 0; i < data.length; i += 4) {
          // Purple tint
          data[i] = Math.min(255, data[i] * 0.8 + 102 * 0.2); // Add purple-red
          data[i + 1] = Math.min(255, data[i + 1] * 0.7 + 126 * 0.3); // Add purple-green
          data[i + 2] = Math.min(255, data[i + 2] * 0.7 + 234 * 0.3); // Add purple-blue
        }
        break;

      default:
        break;
    }

    context.putImageData(imageData, 0, 0);

    // Add Goose watermark for goose filter
    if (filterId === 'goose') {
      context.font = 'bold 48px Arial';
      context.fillStyle = 'rgba(255, 255, 255, 0.7)';
      context.textAlign = 'center';
      context.fillText('🪿 GOOSE', width / 2, height - 50);
      context.font = '20px Arial';
      context.fillText('Powered by Block', width / 2, height - 20);
    }
  };

  const applyLiveFilter = () => {
    const video = videoRef.current;
    const canvas = previewCanvasRef.current;
    
    if (!video || !canvas || !stream) return;

    const context = canvas.getContext('2d');
    
    const drawFrame = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw and flip horizontally (mirror effect)
        context.save();
        context.scale(-1, 1);
        context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
        context.restore();
        
        // Apply filter
        applyFilterToContext(context, canvas.width, canvas.height, activeFilter);
      }
      
      animationFrameRef.current = requestAnimationFrame(drawFrame);
    };
    
    drawFrame();
  };

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (activeFilter !== 'none' && previewCanvasRef.current) {
        // If filter is active, capture from the filtered canvas
        const previewCanvas = previewCanvasRef.current;
        canvas.width = previewCanvas.width;
        canvas.height = previewCanvas.height;
        context.drawImage(previewCanvas, 0, 0);
      } else {
        // No filter, capture directly from video
        const video = videoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Mirror the image horizontally
        context.save();
        context.scale(-1, 1);
        context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
        context.restore();
      }

      // Convert canvas to image URL
      const imageUrl = canvas.toDataURL('image/png');
      return imageUrl;
    }
    return null;
  }, [activeFilter]);

  const takePhoto = () => {
    const photo = capturePhoto();
    if (photo) {
      setCapturedImages([photo]);
      setPhotoTaken(true);
    }
  };

  const startPhotoBoothSession = () => {
    setIsPhotoBoothMode(true);
    setCapturedImages([]);
    setCurrentPhotoIndex(0);
    startCountdown();
  };

  const startCountdown = () => {
    setCountdown(3);
    countdownTimerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev === 1) {
          clearInterval(countdownTimerRef.current);
          capturePhotoBoothPhoto();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const capturePhotoBoothPhoto = () => {
    const photo = capturePhoto();
    if (photo) {
      setCapturedImages(prev => {
        const newImages = [...prev, photo];
        if (newImages.length < 4) {
          // Take another photo after 2 seconds
          setTimeout(() => {
            setCurrentPhotoIndex(newImages.length);
            startCountdown();
          }, 2000);
        } else {
          // All photos taken, show grid
          setIsPhotoBoothMode(false);
          setShowGrid(true);
        }
        return newImages;
      });
    }
  };

  const retakePhotos = () => {
    setPhotoTaken(false);
    setCapturedImages([]);
    setShowGrid(false);
    setIsPhotoBoothMode(false);
    setCurrentPhotoIndex(0);
    setCountdown(null);
  };

  const downloadGrid = () => {
    // Create a canvas for the grid
    const gridCanvas = document.createElement('canvas');
    const ctx = gridCanvas.getContext('2d');
    
    // Set grid dimensions (2x2 grid)
    const photoWidth = 400;
    const photoHeight = 300;
    const padding = 20;
    const headerHeight = 100;
    
    gridCanvas.width = photoWidth * 2 + padding * 3;
    gridCanvas.height = photoHeight * 2 + padding * 3 + headerHeight;
    
    // Fill background with white
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, gridCanvas.width, gridCanvas.height);
    
    // Add header with branding
    ctx.fillStyle = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    ctx.fillRect(0, 0, gridCanvas.width, headerHeight);
    
    ctx.fillStyle = 'white';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🪿 GOOSE Photo Booth', gridCanvas.width / 2, 35);
    ctx.font = '16px Arial';
    ctx.fillText('Sponsored by Block & Vercel', gridCanvas.width / 2, 60);
    ctx.fillText(`${new Date().toLocaleDateString()}`, gridCanvas.width / 2, 80);
    
    // Draw photos in grid
    capturedImages.forEach((imageSrc, index) => {
      const img = new Image();
      img.onload = () => {
        const row = Math.floor(index / 2);
        const col = index % 2;
        const x = padding + col * (photoWidth + padding);
        const y = headerHeight + padding + row * (photoHeight + padding);
        
        ctx.drawImage(img, x, y, photoWidth, photoHeight);
        
        // Add photo number
        ctx.fillStyle = 'rgba(102, 126, 234, 0.8)';
        ctx.fillRect(x + photoWidth - 40, y + 10, 30, 30);
        ctx.fillStyle = 'white';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(index + 1, x + photoWidth - 25, y + 30);
        
        // If this is the last photo, download the grid
        if (index === capturedImages.length - 1) {
          const link = document.createElement('a');
          link.download = `photo-booth-${Date.now()}.png`;
          link.href = gridCanvas.toDataURL('image/png');
          link.click();
        }
      };
      img.src = imageSrc;
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <h1 className="app-title">
            <span className="goose-icon">🪿</span>
            GOOSE Photo Booth
          </h1>
          <div className="sponsors">
            <span className="sponsor-text">Proudly sponsored by</span>
            <div className="sponsor-logos">
              <span className="sponsor-logo block">⬛ Block</span>
              <span className="sponsor-divider">×</span>
              <span className="sponsor-logo vercel">▲ Vercel</span>
            </div>
          </div>
        </div>
      </header>
      
      <main className="main-content">
        {error ? (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={startWebcam} className="btn btn-primary">
              Try Again
            </button>
          </div>
        ) : showGrid ? (
          <div className="grid-view">
            <h2 className="grid-title">Your Photo Booth Strip! 📸</h2>
            <div className="photo-grid">
              {capturedImages.map((image, index) => (
                <div key={index} className="grid-photo">
                  <img src={image} alt={`Photo ${index + 1}`} />
                  <div className="photo-number">{index + 1}</div>
                </div>
              ))}
            </div>
            <div className="grid-controls">
              <button onClick={retakePhotos} className="btn btn-secondary">
                📷 Take New Photos
              </button>
              <button onClick={downloadGrid} className="btn btn-primary">
                💾 Download Grid
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Countdown overlay */}
            {countdown && (
              <div className="countdown-overlay">
                <div className="countdown-number">{countdown}</div>
                <div className="countdown-text">
                  Photo {currentPhotoIndex + 1} of 4
                </div>
              </div>
            )}

            {/* Filter toggle button */}
            {!photoTaken && !isPhotoBoothMode && (
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="btn btn-filter-toggle"
              >
                {showFilters ? '✖️ Hide Filters' : '🎨 Show Filters'}
              </button>
            )}

            {/* Filter selection */}
            {showFilters && !photoTaken && !isPhotoBoothMode && (
              <div className="filter-container">
                {filters.map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`filter-btn ${activeFilter === filter.id ? 'active' : ''}`}
                  >
                    <span className="filter-icon">{filter.icon}</span>
                    <span className="filter-name">{filter.name}</span>
                  </button>
                ))}
              </div>
            )}

            <div className="camera-container">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className={`video-feed ${photoTaken || activeFilter !== 'none' ? 'hidden' : ''}`}
              />
              
              {/* Preview canvas for filtered video */}
              <canvas 
                ref={previewCanvasRef} 
                className={`preview-canvas ${!photoTaken && activeFilter !== 'none' ? '' : 'hidden'}`}
              />
              
              {photoTaken && capturedImages.length === 1 && (
                <img 
                  src={capturedImages[0]} 
                  alt="Captured" 
                  className="captured-image"
                />
              )}
              
              <canvas 
                ref={canvasRef} 
                className="hidden-canvas"
              />

              {/* Active filter indicator */}
              {activeFilter !== 'none' && !photoTaken && !isPhotoBoothMode && (
                <div className="active-filter-badge">
                  {filters.find(f => f.id === activeFilter)?.icon} {filters.find(f => f.id === activeFilter)?.name}
                </div>
              )}

              {/* Photo booth progress indicator */}
              {isPhotoBoothMode && (
                <div className="photo-booth-progress">
                  {[1, 2, 3, 4].map(num => (
                    <div 
                      key={num} 
                      className={`progress-dot ${num <= capturedImages.length ? 'completed' : ''} ${num === currentPhotoIndex + 1 ? 'active' : ''}`}
                    >
                      {num}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="controls">
              {!photoTaken && !isPhotoBoothMode ? (
                <div className="photo-controls">
                  <button 
                    onClick={takePhoto} 
                    className="btn btn-capture"
                    disabled={!stream}
                  >
                    <span className="camera-icon">📷</span>
                    Single Photo
                  </button>
                  <button 
                    onClick={startPhotoBoothSession} 
                    className="btn btn-photo-booth"
                    disabled={!stream}
                  >
                    <span className="booth-icon">📸</span>
                    Photo Booth (4 pics)
                  </button>
                </div>
              ) : photoTaken && capturedImages.length === 1 ? (
                <div className="photo-controls">
                  <button 
                    onClick={retakePhotos} 
                    className="btn btn-secondary"
                  >
                    🔄 Retake
                  </button>
                  <button 
                    onClick={() => {
                      const link = document.createElement('a');
                      link.download = `photo-${Date.now()}.png`;
                      link.href = capturedImages[0];
                      link.click();
                    }} 
                    className="btn btn-primary"
                  >
                    💾 Download
                  </button>
                </div>
              ) : null}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
