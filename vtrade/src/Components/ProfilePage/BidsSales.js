import React from "react";
import PaginationButtons from "./PaginationButtons";
import Loader from "../Loader";
import FetchData from "./FetchData";
import { useNavigate } from "react-router-dom";
import { arrowRight } from "../../Constants";

export default function BidsSales() {
  const navigate = useNavigate();
  const menu = [
    { id: "id", text: "OFFER ID" },
    { id: "status", text: "STATUS" },
    { id: "date", text: "DATE" },
    { id: "amount", text: "AMOUNT" },
    { id: "from", text: "FROM" },
    { id: "action", text: "ACTION" },
  ];

  const getPaddingClass = (id) => {
    console.log(id);
    switch (id) {
      case "id":
        return "px-4";
      case "status":
        return "px-4";
      case "date":
        return "px-5";
      case "amount":
        return "px-4";
      case "from":
        return "px-8";
      case "action":
        return "px-4";
      default:
        return "px-3";
    }
  };
  const getWidthStyle = (id) => {
    switch (id) {
      case "id":
        return { width: "10%" };
      case "status":
        return { width: "15%" };
      case "date":
        return { width: "15%" };
      case "amount":
        return { width: "15%" };
      case "from":
        return { width: "10%" };
      case "action":
        return { width: "35%" };
    }
  };

  const getColor = (id, sale) => {
    if (id === "status") {
      switch (sale[id]) {
        case "Accepted":
          return "text-green-500";
        case "Pending":
          return "text-orange-500";
        default:
          return "text-red-500";
      }
    } else if (id === "action") {
      return "text-blue-500";
    } else if (id === "id") {
      return "text-gray-900";
    } else return "text-gray-600";
  };

  const getBold = (id) => {
    if (id === "status" || id === "action") {
      return "font-semibold";
    } else if (id === "id") {
      return "font-medium";
    } else return "font-normal";
  };

  const salesData = [
    {
      id: 1,
      status: "Completed",
      date: "2024-01-30",
      amount: "$100",
      from: "User1",
      action: "View",
    },
    {
      id: 2,
      status: "Pending",
      date: "2024-01-29",
      amount: "$150",
      from: "User2",
      action: "View",
    },
  ];

  const { loading, pages, totalPages, currentPage, setCurrentPage } =
    FetchData();
  const handleItemClick = (item) => {
    navigate(`/Product/${item.category}`, { state: { id: item.id } });
  };

  console.log(loading);
  return (
    <div>
      {false ? (
        <Loader />
      ) : (
        <div className="border-2  mb-10  w-[868px]">
          <div className="flex flex-col justify-start items-start">
            <div>
              <p className="px-6 py-4 uppercase font-mulish font-bold text-sm text-black">
                Sales History
              </p>
            </div>
            <div className="w-full">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-200 font-mulish font-medium text-xsm">
                    {menu.map((item) => (
                      <th
                        key={item.id}
                        className={`px-6 py-2`}
                        style={{ width: `${getWidthStyle(item.id)}` }}
                      >
                        <div className="text-start">{item.text}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {salesData.map((sale) => (
                    <tr key={sale.id}>
                      {menu.map((item) => (
                        <td
                          key={`${sale.id}-${item.id}`}
                          className={`font-mulish py-4 px-6 ${getColor(
                            item.id,
                            sale
                          )}
                          ${getBold(item.id)}`}
                          style={{ width: `${getWidthStyle(item.id)}` }}
                        >
                          {item.id === "id" ? "#" : null}
                          {sale[item.id]}
                          {item.id === "action" ? arrowRight : null}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex justify-center items-center">
            <div>
              <PaginationButtons
                totalPages={1}
                currentPage={0}
                setCurrentPage={setCurrentPage}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
