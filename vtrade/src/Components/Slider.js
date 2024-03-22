import React, { useCallback, useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import "../Style/slider.css";

const Slider = ({ min, max, useRange, onChange }) => {
  const [minVal, setMinVal] = useState(min);
  const [maxVal, setMaxVal] = useState(max);
  const minValRef = useRef(min);
  const maxValRef = useRef(max);
  const range = useRef(null);

  // Convert to percentage
  const getPercent = useCallback(
    (value) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  // Set width of the range to decrease from the left side
  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxValRef.current);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, getPercent]);

  // Set width of the range to decrease from the right side
  useEffect(() => {
    const minPercent = getPercent(minValRef.current);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [maxVal, getPercent]);

  // Get min and max values when their state changes
  useEffect(() => {
    onChange({ min: minVal, max: maxVal });
  }, [minVal, maxVal]);

  const handleOnPriceChange = (input) => {
    try {
      console.log(input);
      const userInput = input[0].target.value;
      const updateMin = input[1];
      console.log(userInput);

      // Replace anything other than numbers with an empty string
      const cleanedInput = userInput.replace(/[^0-9]/g, "");

      // Check if the cleanedInput is not an empty string
      if (cleanedInput !== "") {
        // Check if the cleanedInput is a number
        if (!isNaN(cleanedInput)) {
          const numericValue = parseFloat(cleanedInput);

          // Check if the numericValue is within the desired range (min and max values)
          const minValue = min;
          const maxValue = max;

          if (numericValue >= minValue && numericValue <= maxValue) {
            if (updateMin) {
              if (numericValue >= maxVal) {
                setMaxVal(Math.min(numericValue + 1, max));
                maxValRef.current = Math.min(numericValue + 1, max);
              }
              minValRef.current = numericValue;
              setMinVal(numericValue);
            } else {
              if (numericValue <= minVal) {
                setMinVal(Math.max(numericValue - 1, min));
                minValRef.current = Math.max(numericValue - 1, min);
              }
              setMaxVal(numericValue);
              maxValRef.current = numericValue;
            }
            console.log("Valid input:", numericValue);
          } else {
            console.log("Input is out of range.");
          }
        } else {
          console.log("Input is not a number.");
        }
      } else {
        if (updateMin) {
          setMinVal(0);
        } else {
          setMaxVal(0);
        }
      }
    } catch (error) {
      console.error("Error in handleOnPriceChange:", error);
    }
  };

  return (
    <div className="mt-4">
      <div className="flex flex-col">
        <div className="flex items-center justify-start flex-none">
          <input
            type="range"
            disabled={!useRange}
            min={min}
            max={max}
            value={minVal}
            onChange={(event) => {
              const value = Math.min(Number(event.target.value), maxVal - 1);
              setMinVal(value);
              minValRef.current = value;
            }}
            className="thumb z-[3]"
            style={{ zIndex: minVal > max - 100 && "5" }}
          />
          <input
            type="range"
            disabled={!useRange}
            min={min}
            max={max}
            value={maxVal}
            onChange={(event) => {
              const value = Math.max(Number(event.target.value), minVal + 1);
              setMaxVal(value);
              maxValRef.current = value;
            }}
            className="thumb z-[4]"
          />

          <div className="relative w-[200px]">
            <div className="absolute rounded h-1 bg-gray-300 w-full z-[1]" />
            <div ref={range} className="absolute rounded h-1 bg-black z-[2]" />
            <div className="font-mulish -left-1 absolute z-[1] text-black text-xsm mt-4">
              {minVal}
            </div>
            <div className="absolute -right-2 z-[2] text-black text-xsm mt-4">
              {maxVal}
            </div>
          </div>
        </div>
        <div className="flex justify-start items-center mt-10">
          <div className="flex flex-col items-start">
            <input
              onChange={(event) => {
                handleOnPriceChange([event, true]);
              }}
              type="text"
              value={minVal}
              className="w-24 mr-3 py-2 px-3 items-start flex border border-gray-400"
            />
            <p className="text-gray-500 font-mulish text-xsm text-normal font-normal">
              Min. Price: ${min}
            </p>
          </div>
          <div className="flex flex-col items-start">
            <input
              onChange={(event) => {
                handleOnPriceChange([event, false]);
              }}
              type="text"
              value={maxVal}
              className="w-24 py-2 px-3 items-start flex border border-gray-400"
            />
            <p className="text-gray-500 font-mulish text-xsm text-normal font-normal">
              Max. Price: ${max}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

Slider.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Slider;
