import React from "react";
import moment from "moment/moment";
import { useState, useEffect } from "react";
import PersonIcon from "@mui/icons-material/Person";
import apiClient from "../../Services/apiClient";
import ImageSlider from "./ImageSlider";
import { useNavigate } from "react-router-dom";
import "../../index.css";

export default function SaleHighlights({
  user,
  setUser,
  saleHighlights,
  saleImages,
}) {
  const [userId, setUserId] = useState({});

  const navigate = useNavigate();

  const handleItemClick = (item) => {
    navigate(`/Product/${item.category}`, { state: { id: item.id } });
  };

  return (
    <div>
      <div className="mt-16 mb-6">
        <p className="text-xl font-bold tracking-tight font-mulish">
          Most Viewed Sales
        </p>
      </div>
      <div className="flex flex-row overflow-x-auto h-[398px] overflow-y-hidden hide-scroll-bar">
        {saleHighlights &&
        Array.isArray(saleHighlights) &&
        saleHighlights.length > 0
          ? saleHighlights.map((item, i) => (
              <div
                key={i}
                className="flex flex-col justify-start  border-gray-100 border rounded-xl p-2 mr-3 cursor-pointer"
              >
                <div className="w-64 h-16 flex items-start no-scrollbar ">
                  <div
                    className="bg-gray-300 rounded-full w-10 h-10 overflow-hidden hide-scroll-bar"
                    aria-label="profile-image"
                    onClick={() => handleItemClick(item)}
                  >
                    {item.profileimage ? (
                      <img
                        src={item.profileimage}
                        alt="Profile"
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <PersonIcon className="text-white" />
                    )}
                  </div>
                  <div
                    className="ml-3 flex flex-col"
                    onClick={() => handleItemClick(item)}
                  >
                    <div className="text-light-black font-Mulish text-sm font-semibold leading-5 tracking-tighter">
                      {/* need to extract the first and last name from userId */}
                      {item.firstname + " " + item.lastname}
                    </div>
                    <div className="text-black text-xs text-center">
                      {moment(item.listing_createdat).fromNow()}
                    </div>
                  </div>
                </div>
                <div className="mt-5">
                  {saleImages &&
                  Array.isArray(saleImages) &&
                  saleImages.length > i &&
                  saleImages[i] ? (
                    <ImageSlider
                      images={saleImages[i].images}
                      handleItemClick={handleItemClick}
                      item={item}
                    />
                  ) : null}
                </div>
                <div
                  className="px-2 py-4 text-start"
                  onClick={() => handleItemClick(item)}
                >
                  <p className="text-gray-800 font-Mulish text-base font-semibold leading-6 tracking-[0.2px]">
                    {item.title}
                  </p>
                  <div className="mt-2">
                    {item.price !== null ? (
                      <p className="text-gray-500 font-Mulish text-base font-normal leading-6 tracking-[0.1px]">
                        ${item.price}
                      </p>
                    ) : (
                      <p className="text-gray-500 font-Mulish text-base font-normal leading-6 tracking-[0.1px]">
                        ${item.minprice} ~ ${item.maxprice}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          : null}
      </div>
    </div>
  );
}
