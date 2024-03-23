import React from "react";
import PaginationButtons from "./PaginationButtons";
import Loader from "../Loader";
import FetchData from "./FetchData";
import Table from "./Table";
import { useNavigate } from "react-router-dom";

export default function BidsSales() {
  const navigate = useNavigate();

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
        <div className="flex flex-col">
          <div className="border-2 mb-4 h-[420px] w-[868px] flex flex-col justify-between">
            <Table salesData={salesData} sales={true} />
            <div className="flex justify-center items-end pb-4">
              <PaginationButtons
                totalPages={1}
                currentPage={0}
                setCurrentPage={setCurrentPage}
              />
            </div>
          </div>

          <div className="border-2 mb-4 h-[420px] w-[868px] flex flex-col justify-between">
            <Table salesData={salesData} sales={true} />
            <div className="flex justify-center items-end pb-4">
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
