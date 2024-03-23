import React, { useState, useEffect } from "react";
import none from "../../Assets/none.png";

export default function ImageSlider({ images, handleItemClick, item }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Reset the current image index when the images change
    setCurrentImageIndex(0);
  }, [images]);

  const handleNextClick = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevClick = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const onItemClicked = (item) => {
    handleItemClick(item);
  };

  return (
    <div className="mb-3 flex flex-row items-center">
      {images && images.length > 0 ? (
        <div className="relative h-56 w-full">
          <img
            className="h-full w-full object-contain transition-transform"
            src={images[currentImageIndex]}
            alt={`Listing photo ${currentImageIndex + 1}`}
            onClick={() => onItemClicked(item)}
          />
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevClick}
                className="absolute top-28 left-1 transform -translate-y-1/2 bg-gray-800 text-white px-2 py-1 rounded"
              >
                &lt;
              </button>
              <button
                onClick={handleNextClick}
                className="absolute top-28 right-1 transform -translate-y-1/2 bg-gray-800 text-white px-2 py-1 rounded"
              >
                &gt;
              </button>
            </>
          )}
        </div>
      ) : (
        <img
          className="object-cover h-56 w-full"
          src={none}
          alt={`Listing photo`}
          onClick={() => onItemClicked(item)}
        />
      )}
    </div>
  );
}
