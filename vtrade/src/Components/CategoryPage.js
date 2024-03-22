import * as React from "react";
import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import apiClient from "../Services/apiClient";
import PersonIcon from "@mui/icons-material/Person";
import moment from "moment/moment";
import ImageSlider from "./HomePage/ImageSlider";
import Slider from "./Slider";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";
import {
  unselectedSvg,
  selectedSvg,
  xVG,
  selectedCircleSvg,
  unselectedCircleSvg,
} from "../Constants";

export default function CategoryPage({ user, setUser }) {
  //state variables used for initial setup
  const [loading, setLoading] = useState(true);
  const [items, setItem] = useState([]);
  const [maxValue, setMaxValue] = useState(null);
  const [allImages, setAllImages] = useState(null);

  //state variables used for filtering
  const [search, setSearch] = useState(null);
  const [useRange, setUseRange] = useState(null);
  const [change, setChange] = useState({
    category: null,
    type: null,
    min_price: 0,
    max_price: null,
  });

  //state variable used for display
  const [newData, setNewData] = useState(false);
  const [option, setOption] = useState("");
  const [displayFilter, setDisplayFilter] = useState({});
  const [filteredItems, setFilteredItems] = useState(null);
  const [filteredMaxValue, setFilteredMaxValue] = useState(null);
  const [filteredAllImages, setFilteredAllImages] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;

  useEffect(() => {
    const fetchData = async () => {
      try {
        let categoryId = null;
        if (state && state.category) {
          categoryId = state.category;
        }

        // Fetch item data
        const { data, error } = await apiClient.getListingsByCategory({
          categoryId,
        });

        if (data && data.listings) {
          setItem(data.listings);

          const maxPrice = data.listings.reduce((maxValue, currentItem) => {
            const currentMaxValue = Math.max(
              currentItem.price,
              currentItem.maxprice
            );
            return Math.max(maxValue, currentMaxValue);
          }, -Infinity);

          setMaxValue(Math.ceil(maxPrice));
          setChange((prev) => ({
            ...prev,
            max_price: maxPrice,
            category: categoryId,
          }));
        } else {
          console.log("Data or listing not found:", error);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (maxValue === null) fetchData();
  }, [maxValue]);

  //stop the initial loader component
  useEffect(() => {
    if (maxValue && allImages) setLoading(false);
  }, [maxValue, allImages]);

  //inital setup
  useEffect(() => {
    if (items) {
      const allImages = items.map((item) => {
        const productImages = [];
        for (let i = 1; i <= 7; i++) {
          const imageKey = `image${i}`;
          const imageUrl = item[imageKey];

          if (imageUrl) {
            productImages.push(imageUrl);
          }
        }

        return { productId: item.id, images: productImages };
      });

      setAllImages(allImages);
    }
  }, [items]);

  //search function
  const handleOnInputChange = (event) => {
    setSearch(event.value);
  };

  //updating filters
  const handleFilterChange = (event, filterType) => {
    try {
      const { dataset } = event.currentTarget;
      const radioValue = dataset.value;
      const [type, value, type2, value2] = filterType;

      if (type !== "type") {
        setOption((prevOption) =>
          prevOption === radioValue ? null : radioValue
        );
      }

      setChange((prev) => {
        if (filterType.length === 2) {
          return {
            ...prev,
            [type]: prev[type] === value ? null : value,
          };
        } else {
          return {
            ...prev,
            max_price: prev[type] === value ? null : value,
            min_price: prev[type2] === value2 ? null : value2,
          };
        }
      });
    } catch (error) {
      console.error("Error in handleFilterChange:", error);
    }
  };

  // Function to update filtering state based on change state
  const updateFiltering = () => {
    let typeValue = null;
    let priceValue = null;

    // Set type based on the value in change state
    if (change.type !== null) {
      typeValue = change.type === "provide" ? "Sell" : "Request";
    }
    // Set price based on the useRange condition
    if (useRange !== null) {
      priceValue = useRange
        ? `$${change.min_price} ~ $${change.max_price}`
        : `${option}`; // assuming there is a priceOption in the change state
    }

    // Update the filtering state
    setDisplayFilter((prevDisplayFilter) => {
      const updatedDisplayFilter = {};
      if (typeValue !== null) {
        updatedDisplayFilter.type = typeValue;
      }
      if (priceValue !== null) {
        updatedDisplayFilter.price = priceValue;
      }
      // Include other conditions for additional values if needed
      return {
        ...prevDisplayFilter,
        ...updatedDisplayFilter,
      };
    });
  };

  const handleOnClick = async () => {
    updateFiltering();
    fetchFilteredData();
  };

  // come back to this
  const handleRemoveFilter = (value) => {
    try {
      setLoading(true); //start the loader function
      setDisplayFilter(null);
      setNewData(true); //indicate that we are trying to get new data
      setFilteredItems(null); //indicate that the loader shouldn't stop
      setChange((prevFiltering) => {
        if (value === "Provide" || value === "Sell") {
          return { ...prevFiltering, type: null };
        } else {
          setUseRange(null);
          setOption(null);
          return { ...prevFiltering, min_price: 0, max_price: maxValue };
        }
      });
    } catch (error) {
      console.log("Error removing filter", error);
    }
  };

  useEffect(() => {
    if (newData) {
      updateFiltering();
      fetchFilteredData(); //fetch new data
      setNewData(false); //reset to false so we aren't fetching data constantly
    }
  }, [change]);

  useEffect(() => {
    // This effect will run whenever filteredItems changes
    if (filteredItems !== null && displayFilter !== null) {
      setLoading(false);
    }
  }, [filteredItems, displayFilter]);

  const fetchFilteredData = async () => {
    try {
      setLoading(true);

      // Fetch item data
      console.log(change);
      const { data, error } = await apiClient.getListingsByFilter(change);

      // Log or handle the fetched data

      if (data && data.listings) {
        setFilteredItems(data.listings);

        const maxPrice = data.listings.reduce((maxValue, currentItem) => {
          const currentMaxValue = Math.max(
            currentItem.price,
            currentItem.maxprice
          );
          return Math.max(maxValue, currentMaxValue);
        }, -Infinity);

        setFilteredMaxValue(Math.ceil(maxPrice));
      } else {
        console.log("Data or listing not found:", error);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  //stop the initial loader component
  useEffect(() => {
    //consider case where both the other two values aren't null but filtered items is null
    if (filteredMaxValue && filteredAllImages) setLoading(false);
  }, [filteredMaxValue, filteredAllImages]);

  const handleItemClick = (item) => {
    navigate(`/Product/${item.category}`, { state: { id: item.id } });
  };

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <div className="flex flex-col flex-none flex-shrink-0">
          <div className="mx-14">
            <div className="w-full min-w-[1328px] h-80 px-96 pt-20 flex-shrink-0 flex-none bg-opacity-5 bg-gray-500">
              <div className=" flex flex-col flex-none flex-shrink-0 justify-center items-start">
                <p className="mb-2 text-black font-mulish text-llg text-normal font-bold tracking-wide">
                  Goods for sale and goods requested by other Vassar Students
                </p>
                <p className="mb-6 text-gray-500 font-mulish text-normal font-normal text-base tracking-wide">
                  Trending:
                </p>
                <div className="flex flex-row flex-none w-full">
                  <input
                    type="text"
                    name="search"
                    value={search}
                    placeholder="Search for anything and everything"
                    required
                    onChange={handleOnInputChange}
                    className=" cursor-text px-3 py-2 w-full h-11 font-mulish text-gray-500 font-normal text-normal text-sm tracking-wide bg-white"
                  />
                  {/* need to add an onClick method on Steven sets up searching AI */}
                  <button className="ml-6 bg-black px-4 py-3 w-24 text-white font-mulish text-sm font-bold text-normal tracking-wide text-center">
                    Search
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-row flex-none mt-9 w-auto items-start">
              {/* filtering */}
              <div className="flex flex-col flex-none items-start w-72">
                <p className="text-black font-mulish text-normal font-bold text-base">
                  Filter
                </p>
                <div className="flex flex-row flex-none mt-3 items-start">
                  <div
                    className="cursor-pointer"
                    data-value="provide"
                    onClick={(event) =>
                      handleFilterChange(event, ["type", "provide"])
                    }
                  >
                    {change.type === "provide" ? selectedSvg : unselectedSvg}
                  </div>
                  <label
                    data-value="provide"
                    onClick={(event) =>
                      handleFilterChange(event, ["type", "provide"])
                    }
                    className="mb-2 select-none inline-flex cursor-pointer items-center text-gray-700 ml-2 text-primary bg-white text-normal font-mulish text-sm font-normal tracking-wide"
                  >
                    Items on sale
                  </label>
                </div>
                <div className="flex flex-row flex-none">
                  <div
                    className="cursor-pointer"
                    data-value="request"
                    onClick={(event) =>
                      handleFilterChange(event, ["type", "request"])
                    }
                  >
                    {change.type === "request" ? selectedSvg : unselectedSvg}
                  </div>
                  <label
                    data-value="request"
                    onClick={(event) =>
                      handleFilterChange(event, ["type", "request"])
                    }
                    className="select-none inline-flex cursor-pointer items-center text-gray-700 ml-2 text-primary bg-white text-normal font-mulish text-sm font-normal tracking-wide"
                  >
                    Requested items
                  </label>
                </div>
                <p className="mt-3 text-base font-mulish text-black font-bold text-normal uppercase">
                  Price Range
                </p>

                <div
                  onClick={() => setUseRange(true)}
                  className={`w-full ${useRange === null ? "opacity-25" : null}
                  } ${useRange ? null : "opacity-25"}`}
                >
                  <Slider
                    min={0}
                    max={
                      filteredMaxValue !== null ? filteredMaxValue : maxValue
                    }
                    useRange={useRange}
                    onChange={({ min, max }) => {
                      setChange((prevChange) => {
                        if (useRange) {
                          // Update filter.price based on changes to min and max
                          return {
                            ...prevChange,
                            min_price: min,
                            max_price: max,
                          };
                        }
                        // If not using range, return the existing state
                        return prevChange;
                      });
                    }}
                  />
                </div>
                <div
                  onClick={() => setUseRange(false)}
                  className={`w-full ${useRange === null ? "opacity-25" : null}
                  } ${useRange ? "opacity-25" : null}`}
                >
                  <div className="flex flex-row flex-none mt-3">
                    <div
                      className="cursor-pointer"
                      data-value="All Price"
                      onClick={(event) =>
                        handleFilterChange(event, ["max_price", maxValue])
                      }
                    >
                      {!useRange && option === "All Price"
                        ? selectedCircleSvg
                        : unselectedCircleSvg}
                    </div>
                    <label
                      data-value="All Price"
                      onClick={(event) =>
                        handleFilterChange(event, ["max_price", maxValue])
                      }
                      className="select-none inline-flex cursor-pointer items-center text-gray-700 ml-2 text-primary bg-white text-normal font-mulish text-sm font-normal tracking-wide"
                    >
                      All Price
                    </label>
                  </div>
                  <div className="flex flex-row flex-none mt-2">
                    <div
                      className="cursor-pointer"
                      data-value="Under $20"
                      onClick={(event) =>
                        handleFilterChange(event, ["max_price", 20])
                      }
                    >
                      {!useRange && option === "Under $20"
                        ? selectedCircleSvg
                        : unselectedCircleSvg}
                    </div>
                    <label
                      data-value="Under $20"
                      onClick={(event) =>
                        handleFilterChange(event, ["max_price", 20])
                      }
                      className="select-none inline-flex cursor-pointer items-center text-gray-700 ml-2 text-primary bg-white text-normal font-mulish text-sm font-normal tracking-wide"
                    >
                      Under $20
                    </label>
                  </div>

                  <div className="flex flex-row flex-none mt-2">
                    <div
                      className={`cursor-pointer ${
                        maxValue < 20 ? "pointer-events-none opacity-50" : null
                      } `}
                      data-value="$20 ~ $100"
                      onClick={(event) => {
                        handleFilterChange(event, [
                          "max_price",
                          100,
                          "min_price",
                          20,
                        ]);
                      }}
                    >
                      {!useRange && option === "$20 ~ $100"
                        ? selectedCircleSvg
                        : unselectedCircleSvg}
                    </div>
                    <label
                      data-value="$20 ~ $100"
                      onClick={(event) => {
                        handleFilterChange(event, [
                          "max_price",
                          100,
                          "min_price",
                          20,
                        ]);
                      }}
                      className={`${
                        maxValue < 20 ? "pointer-events-none opacity-50" : null
                      } select-none inline-flex cursor-pointer items-center text-gray-700 ml-2 text-primary bg-white text-normal font-mulish text-sm font-normal tracking-wide`}
                    >
                      $20 to $100
                    </label>
                  </div>
                  <div className="flex flex-row flex-none mt-2">
                    <div
                      className={`cursor-pointer ${
                        maxValue < 100 ? "pointer-events-none opacity-50" : null
                      } `}
                      data-value="$100 ~ $300"
                      onClick={(event) => {
                        handleFilterChange(event, [
                          "max_price",
                          300,
                          "min_price",
                          100,
                        ]);
                      }}
                    >
                      {!useRange && option === "$100 ~ $300"
                        ? selectedCircleSvg
                        : unselectedCircleSvg}
                    </div>
                    <label
                      data-value="$100 ~ $300"
                      onClick={(event) => {
                        handleFilterChange(event, [
                          "max_price",
                          300,
                          "min_price",
                          100,
                        ]);
                      }}
                      className={`${
                        maxValue < 100 ? "pointer-events-none opacity-50" : null
                      } select-none inline-flex cursor-pointer items-center text-gray-700 ml-2 text-primary bg-white text-normal font-mulish text-sm font-normal tracking-wide`}
                    >
                      $100 to $300
                    </label>
                  </div>
                  <div className="flex flex-row flex-none mt-2">
                    <div
                      className={`cursor-pointer ${
                        maxValue < 300 ? "pointer-events-none opacity-50" : null
                      } `}
                      data-value="Over $300"
                      onClick={(event) =>
                        handleFilterChange(event, ["min_price", 300])
                      }
                    >
                      {!useRange && option === "Over $300"
                        ? selectedCircleSvg
                        : unselectedCircleSvg}
                    </div>
                    <label
                      data-value="Over $300"
                      onClick={(event) =>
                        handleFilterChange(event, ["min_price", 300])
                      }
                      className={`${
                        maxValue < 300 ? "pointer-events-none opacity-50" : null
                      } select-none inline-flex cursor-pointer items-center text-gray-700 ml-2 text-primary bg-white text-normal font-mulish text-sm font-normal tracking-wide`}
                    >
                      Over $300
                    </label>
                  </div>
                </div>
                <button
                  onClick={handleOnClick}
                  className="cursor-pointer my-4 bg-black px-4 py-3 w-24 text-white font-mulish text-sm font-bold text-normal tracking-wide text-center"
                >
                  Search
                </button>
              </div>
              {/* fixing sizing issue? */}
              <div className="flex-shrink-0 flex flex-col flex-none justify-start max-w-screen-lg ">
                <div className=" w-auto h-10 px-4 py-3 bg-opacity-5 bg-gray-500">
                  <div className="flex flex-row flex-none justify-between items-start">
                    <div className="flex flex-row items-start">
                      <p className="mb-2 text-gray-600 font-mulish text-sm text-normal font-normal tracking-wide">
                        Active Filters:
                      </p>
                      <div className="flex flex-row flex-none space-x-2 mx-4">
                        {Object.entries(displayFilter)
                          .filter(
                            ([key, value]) =>
                              value !== null || value !== undefined
                          )
                          .map(([key, value]) => (
                            <div
                              key={key}
                              className="flex flex-row flex-none justify-start items-center"
                            >
                              <p className="mr-1 text-gray-600 font-mulish text-sm text-normal font-normal tracking-wide">
                                {value}
                              </p>
                              <div
                                className="mr-2 cursor-pointer"
                                onClick={() => handleRemoveFilter(value)}
                              >
                                {xVG}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                    {/* help fix this */}
                    <div
                      className={`flex flex-row flex-none justify-start items-center`}
                    >
                      <p className="text-gray-600 font-mulish text-sm text-normal font-normal tracking-wide mr-1">
                        {filteredItems !== null
                          ? filteredItems.length
                          : items.length}
                      </p>
                      <p className="text-gray-600 font-mulish text-sm text-normal font-normal tracking-wide">
                        Results Found
                      </p>
                    </div>
                  </div>
                  {/* grid for all the items now */}
                  <div className="mt-8 grid grid-cols-4 gap-y-4 gap-x-6">
                    {items && Array.isArray(items) && items.length > 0 ? (
                      (filteredItems !== null ? filteredItems : items).map(
                        (item, i) => (
                          <div
                            key={i}
                            className="flex flex-col justify-start border-gray-100 border p-2"
                          >
                            <div className="w-80 h-12 flex items-start ">
                              <div
                                className="bg-gray-300 rounded-full w-10 h-10 overflow-hidden"
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
                                <div className="text-light-black font-Mulish text-xsm font-semibold leading-5 tracking-tighter">
                                  {/* need to extract the first and last name from userId */}
                                  {item.firstname + " " + item.lastname}
                                </div>
                                <div className="text-black text-xsm text-center">
                                  {moment(item.listing_createdat).fromNow()}
                                </div>
                              </div>
                            </div>
                            <div className="">
                              {allImages &&
                              Array.isArray(allImages) &&
                              allImages.length > i &&
                              allImages[i] ? (
                                <ImageSlider
                                  images={allImages[i].images}
                                  handleItemClick={handleItemClick}
                                  item={item}
                                />
                              ) : (
                                <Loader />
                              )}
                            </div>
                            <div
                              className="text-start"
                              onClick={() => handleItemClick(item)}
                            >
                              <p className="text-gray-800 font-Mulish text-base font-bold leading-6 tracking-[0.1px]">
                                {item.title}
                              </p>
                              {item.price !== null ? (
                                <p className="text-gray-500 font-Mulish text-sm font-normal leading-6 tracking-[0.1px]">
                                  ${item.price}
                                </p>
                              ) : (
                                <p className="text-gray-500 font-Mulish text-sm font-normal leading-6 tracking-[0.1px]">
                                  ${item.minprice} ~ ${item.maxprice}
                                </p>
                              )}
                            </div>
                          </div>
                        )
                      )
                    ) : (
                      <Loader />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
