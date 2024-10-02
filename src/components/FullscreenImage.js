import React from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import '../css/FullscreenImage.css';

const FullscreenImage = ({ imageUrl, onClose }) => {
  return (
    <div className="fullscreen-overlay">
      <div className="fullscreen-container">
        <TransformWrapper
          initialScale={1}
          minScale={1}
          maxScale={5}
          centerOnInit={true}
        >
          {({ zoomIn, zoomOut, resetTransform, state }) => (
            <>
              <div className="fullscreen-zoom-controls">
                <button
                  onClick={() => {
                    console.log('Zoom In clicked');
                    zoomIn();
                  }}
                >
                  +
                </button>
                <button
                  onClick={() => {
                    console.log('Zoom Out clicked');
                    zoomOut();
                  }}
                >
                  -
                </button>
                <button
                  onClick={() => {
                    console.log('Reset clicked');
                    resetTransform();
                  }}
                >
                  Reset
                </button>
                <button onClick={onClose}>Close</button>
              </div>
              <TransformComponent>
                <img
                  src={imageUrl}
                  alt="Pattern Fullscreen"
                  className="fullscreen-image"
                 
                />
              </TransformComponent>
              {/* Optional: Log the zoom state safely */}
              {state && <div className="scale-debug">Current Scale: {state.scale}</div>}
            </>
          )}
        </TransformWrapper>
      </div>
    </div>
  );
};

export default FullscreenImage;