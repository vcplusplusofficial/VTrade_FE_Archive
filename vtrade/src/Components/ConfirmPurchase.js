import * as React from "react";
import { useNavigate } from "react-router-dom";
import { checkMark, dashboard, rightArrow } from "../Constants";

export default function ConfirmPurchase({ seller, setBuyMsg }) {
  const navigate = useNavigate();
  console.log(seller);

  const navigateHome = () => {
    navigate("/");
  };

  const handleClose = () => {
    setBuyMsg(false);
  };

  const Background = () => {
    return (
      <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-300 opacity-40"></div>
    );
  };

  const formatPhoneNumber = (phoneNumber) => {
    // Convert phoneNumber to string
    const phoneNumberString = phoneNumber.toString();

    // Apply formatting (e.g., 123-456-7890)
    return phoneNumberString.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  };

  return (
    <div>
      <Background />
      <div className="opacity-100 fixed top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
        <button
          onClick={handleClose}
          className="absolute text-base font-mulish top-1.5 right-2 text-black"
        >
          X
        </button>
        <div className="h-80 w-[460px] flex flex-col items-center justify-center  bg-gray-100 p-8 border-black border rounded">
          <h3 className="text-black font-mulish text-basePlus leading-6 font-medium mb-3 ">
            Your purchase has been made
          </h3>
          <p className="text-center text-black font-mulish text-sm leading-5 font-normal mb-3">
            Send a message to <span className="font-bold">{seller.email} </span>{" "}
            or contact {seller.firstname} via phone:
            <span className="font-bold">
              {" "}
              {formatPhoneNumber(seller.phone)}{" "}
            </span>
            to discuss payment and pickup details.
          </p>

          <div className="mb-3">{checkMark}</div>
          <div className="flex justify-center items-center ">
            <div
              onClick={navigateHome}
              className="gap-2 border-2 border-gray-700  justify-center items-center flex py-3 px-6 mr-3 cursor-pointer"
            >
              {dashboard}
              <button
                onClick={navigateHome}
                className=" text-black font-mulish text-xsm font-bold  "
              >
                Go To Dashboard
              </button>
            </div>
            <div className="border-2 border-black flex py-3 px-6 justify-center items-center gap-2 bg-black">
              <button className="text-white font-mulish text-xsm font-bold ">
                Send Email
              </button>
              {rightArrow}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
