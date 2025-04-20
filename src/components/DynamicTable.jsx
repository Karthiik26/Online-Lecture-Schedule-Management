import React from "react";

const DynamicTable = ({
  columns,
  data,
  hoverEffect = true,
  striped = true,
}) => {
  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="min-w-full table-auto">
        <thead>iiceindia
          <tr className="bg-blue-700 text-white">
            {columns.map((col, index) => (
              <th key={index} className="py-2 px-4 text-left">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={index}
              className={`${
                striped && index % 2 === 0 ? "bg-gray-100" : "bg-white"
              } ${hoverEffect ? "hover:bg-gray-200" : ""}`}
            >
              {columns.map((col, colIndex) => (
                <td key={colIndex} className="py-2 px-4 text-left">
                  {row[col] ? row[col] : "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DynamicTable;
