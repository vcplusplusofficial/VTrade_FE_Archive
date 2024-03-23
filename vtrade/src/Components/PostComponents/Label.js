import React from "react";

export default function Label({ label, handleOnInputChange }) {
  return (
    <div>
      <p className="mt-4 text-light-black font-mulish text-basePlus font-normal tracking-wide">
        Label
      </p>
      <div className="w-full flex justify-start space-x-4 mt-2">
        <label
          className={`inline-flex items-center px-3 py-2 border border-gray-700 rounded-full cursor-pointer transition duration-300 ease-in-out ${
            label === "To Bid"
              ? "bg-light-black text-white"
              : "bg-white text-black hover:bg-light-black hover:text-white"
          }`}
        >
          <input
            type="radio"
            hidden
            name="label"
            value="To Bid"
            onClick={handleOnInputChange}
          />
          To Bid
        </label>
        <label
          className={`inline-flex items-center px-3 py-2 border border-gray-700 rounded-full cursor-pointer transition duration-300 ease-in-out ${
            label === "To Sell"
              ? "bg-light-black text-white"
              : "bg-white text-black hover:bg-light-black hover:text-white"
          }`}
        >
          <input
            type="radio"
            hidden
            name="label"
            value="To Sell"
            onClick={handleOnInputChange}
          />
          To Sell
        </label>
      </div>
    </div>
  );
}
