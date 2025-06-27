import React, { useState, useRef, useEffect } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { X, XCircle } from 'lucide-react';

const ImageCropperModal = ({ image, onCropComplete, onClose }) => {
  const [crop, setCrop] = useState({
    unit: 'px',
    x: 0,
    y: 0,
    width: 200,
    height: 200
  });
  const imgRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Reset state when image changes
  useEffect(() => {
    if (image) {
      setIsLoaded(false);
      setHasError(false);
      setCrop({
        unit: 'px',
        x: 0,
        y: 0,
        width: 200,
        height: 200
      });
    }
  }, [image]);

  const handleImageLoaded = (img) => {
    console.log('Image loaded successfully');
    imgRef.current = img;

    // Calculate initial crop (centered, 80% of smaller dimension)
    const minDimension = Math.min(img.width, img.height);
    const cropSize = minDimension * 0.8;

    setCrop({
      unit: 'px',
      x: (img.width - cropSize) / 2,
      y: (img.height - cropSize) / 2,
      width: cropSize,
      height: cropSize * (2/3)
    });

    setIsLoaded(true);
    return false; // Important: Prevent ReactCrop from managing crop
  };

  const handleImageError = () => {
    console.error('Image failed to load');
    setHasError(true);
    setIsLoaded(false);
  };

  const getCroppedImg = async () => {
    if (!imgRef.current) return null;

    try {
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

      const canvasSize = 256;
      const canvas = document.createElement('canvas');
      canvas.width = canvasSize;
      canvas.height = canvasSize;
      const ctx = canvas.getContext('2d');

      // Draw cropped area scaled down to 256x256
      ctx.drawImage(
        imgRef.current,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        canvasSize,
        canvasSize
      );

      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          if (!blob) return resolve(null);
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result); // Return base64 image
          reader.readAsDataURL(blob);
        }, 'image/jpeg', 0.9);
      });
    } catch (err) {
      console.error("getCroppedImg error:", err);
      return null;
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const croppedImage = await getCroppedImg();
    if (croppedImage) {
      onCropComplete(croppedImage); // already resized
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 pointer-events-auto">
      <div
        className="bg-white rounded-lg p-4 w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()} // Prevent clicks from bubbling
      >
        {/* Header with close button */}
        <div className="flex justify-between items-center mb-4 z-10">
          <h3 className="text-lg font-semibold">Crop Image</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Image container */}
        <div className="relative w-full bg-gray-100 rounded-lg overflow-hidden max-h-[75vh]">
          {!isLoaded && !hasError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="mt-2 text-sm text-gray-500">Loading image...</p>
            </div>
          )}

          {hasError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-red-500">
              <XCircle className="w-8 h-8" />
              <p className="mt-2 text-sm">Failed to load image</p>
              <button
                onClick={() => {
                  setHasError(false);
                  setIsLoaded(false);
                }}
                className="mt-2 px-3 py-1 bg-gray-100 rounded text-sm"
              >
                Try Again
              </button>
            </div>
          )}

          {/* ReactCrop component - key forces remount when image changes */}
          {image && !hasError && (
            <ReactCrop
              crop={crop}
              onChange={setCrop}
              aspect={1}
              onComplete={(c) => setCrop(c)}
              onImageLoaded={(img) => {
                imgRef.current = img;
                handleImageLoaded(img); // Your existing logic
              }}
              minWidth={100}
              minHeight={100}
            >
              <img
                ref={imgRef} // Add direct ref here
                src={image}
                onError={handleImageError}
                style={{ maxWidth: '100%', maxHeight: '100%' }}
              />
            </ReactCrop>
          )}
        </div>

        {/* Modal controls */}
        <div className="mt-4 flex justify-end gap-2 relative z-[60]"> {/* Increased z-index */}
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 pointer-events-auto"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropperModal;
