import React from "react";

export default function Table({ salesData, sales }) {
  const menu = [
    { id: "id", text: "OFFER ID" },
    { id: "status", text: "STATUS" },
    { id: "date", text: "DATE" },
    { id: "amount", text: "AMOUNT" },
    { id: "from", text: "FROM" },
    { id: "action", text: "ACTION" },
  ];
  const getWidthStyle = (id) => {
    switch (id) {
      case "id":
        return "w-2/12";
      case "status":
        return "w-1/12";
      case "date":
        return "w-3/12";
      case "amount":
        return "w-1/12";
      case "from":
        return "w-2/12";
      case "action":
        return "w-3/12";
      default:
        return "w-auto";
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
  return (
    <div className="flex flex-col justify-start items-start">
      <div>
        <p className="px-6 py-4 uppercase font-mulish font-bold text-sm text-black">
          {sales ? "Sales History" : "My Bids"}
        </p>
      </div>
      <div className="w-full">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200 font-mulish font-medium text-xsm">
              {menu.map((item) => (
                <th
                  key={item.id}
                  className={`px-4 py-2 ${getWidthStyle(item.id)}`}
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
                    className={`font-mulish py-4 px-4 ${getColor(item.id, sale)}
              ${getBold(item.id)} 
              ${getWidthStyle(item.id)}`}
                  >
                    {item.id === "id" ? "#" : null}
                    {sale[item.id]}{" "}
                    {item.id === "action" ? (
                      sale["status"] === "Pending" ? (
                        <>
                          <span
                            // onClick={() => handleAccept(sale)}
                            className="cursor-pointer"
                          >
                            | Accept
                          </span>{" "}
                          |{" "}
                          <span
                            // onClick={() => handleDeny(sale)}
                            className="cursor-pointer"
                          >
                            Deny
                          </span>{" "}
                        </>
                      ) : null
                    ) : null}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
