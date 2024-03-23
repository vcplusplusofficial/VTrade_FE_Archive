import * as React from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../Services/apiClient";
import { MENU_ITEMS } from "../Constants";
import PersonIcon from "@mui/icons-material/Person";

export default function Navbar(props) {
  const handleMenuItemClick = (event, id) => {
    event.preventDefault(); // Prevent the default anchor behavior
    navigate(id, { state: { category: id } });
  };

  const handleProfileClick = () => {
    navigate("/dashboard");
  };

  const handlePostClick = () => {
    if (!props.user) {
      navigate("/login");
    } else {
      navigate("/post");
    }
  };

  const navigate = useNavigate();
  return (
    <div className="z-10 relative flex justify-between items-centers opacity-6 h-20 bg-[#edebeb] p-5 drop-shadow-md ring-2 ring-gray-400">
      <div className="flex flex-shrink-0 items-center place-items-center">
        <div className="py-6">
          <button
            className="bg-transparent font-mulish border-none tracking-[0.2px] uppercase text-center text-lg font-bold cursor-pointer text-gray-700 ml-14 w-24"
            onClick={() => {
              navigate("/");
            }}
          >
            VTRADE
          </button>
        </div>
      </div>
      <div className="flex items-center place-items-center">
        <div className="flex flex-row gap-8 h-6">
          {MENU_ITEMS.map((menuItem) => (
            <p key={menuItem.id}>
              <a
                className="text-gray-600 hover:text-black font-mulish font-semibold text-14 leading-18 capitalize tracking-[0.2px] cursor-pointer"
                href={`/${menuItem.id}`}
                onClick={(e) => handleMenuItemClick(e, menuItem.id)}
              >
                {menuItem.text}
              </a>
            </p>
          ))}
        </div>
      </div>
      <div className="flex flex-row justify-end items-center mr-10">
        <button
          className={`p-3 px-5  bg-black text-14 font-bold leading-18 tracking-wider text-center font-mulish border-none outline-none cursor-pointer mr-4 text-white hover:bg-[#808080]
          ${props.user ? "w-26" : "w-24"}`}
          type="button"
          onClick={() => {
            if (!props.user) {
              navigate("/login");
            } else {
              apiClient.logoutUser();
              props.setUser(null);
              navigate("/");
            }
          }}
        >
          {props.user ? "Log out" : "Log in"}
        </button>
        <div className="flex flex-col justify-end items-center mt-0$">
          <button
            className="p-3 px-4 w-20 font-mulish text-center font-bold text-14 leading-18 tracking-wider border-none outline-none cursor-pointer mr-4 text-white hover:bg-[#808080]    bg-black"
            type="button"
            onClick={handlePostClick}
          >
            Post
          </button>
        </div>
        {props.user ? (
          <div
            className="flex items-center justify-center bg-gray-300 cursor-pointer border border-black rounded-full w-12 h-12 overflow-hidden"
            aria-label="profile-image"
            onClick={handleProfileClick}
          >
            {props.user && props.user.profileimage ? (
              <img
                src={props.user.profileimage}
                alt="Profile"
                className="object-cover w-full h-full"
              />
            ) : (
              <PersonIcon className="text-white" />
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
