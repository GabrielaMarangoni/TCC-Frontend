import React, { ReactNode, useEffect, useState } from "react";
import { TColumn, TColumnAlign } from "./TColumn";
import useRenderer from "./TRenderer";

interface TabelBaseProps {
  columns: TColumn[];
  data: any[];
  editable: boolean;
  uniqueKey: string;
  setData: (value: any) => void;
  selecteds: any[];
  setSelecteds: (value: any) => void;
}

const TableBase: React.FC<TabelBaseProps> = ({
  columns,
  editable,
  data,
  setData,
  selecteds,
  setSelecteds,
  uniqueKey,
}) => {
  const { renderCell, defaultAlign } = useRenderer();

  const isEmptyData: boolean = data.length === 0;

  function getIds(lista: any[]): string[] {
    return lista.map((obj) => obj[uniqueKey] + "");
  }

  function getSelectedIds(): string[] {
    return getIds(selecteds);
  }

  const isAllSelected: boolean =
    data.length > 0 &&
    data.filter((d) => !getSelectedIds().includes(d[uniqueKey] + "")).length ===
      0;

  const handleSelectRow = async (event: any) => {
    const rowId = event.target.value + "";

    let row = null;

    const filtered = data.filter((d) => d[uniqueKey] == rowId);

    if (filtered.length > 0) {
      row = filtered[0];
    }

    if (!row) {
      return;
    }

    if (!getSelectedIds().includes(rowId)) {
      await setSelecteds([row, ...selecteds]);
    } else {
      await setSelecteds(
        selecteds.filter((obj) => {
          return obj[uniqueKey] != rowId;
        })
      );
    }
  };

  const handleSelectAllRows = () => {
    if (selecteds.length < data.length) {
      setSelecteds(data);
    } else {
      setSelecteds([]);
    }
  };

  const getAlign = (col: TColumn) => {
    const align: TColumnAlign = defaultAlign(col);

    if (!align) {
      return "";
    }

    if (align === TColumnAlign.right) {
      return "text-right";
    }

    if (align === TColumnAlign.center) {
      return "text-center";
    }

    return null;
  };

  return (
    <div className="w-full mx-auto">
      <div className="w-full overflow-hidden rounded-lg shadow-lg">
        <div className="w-full overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left">
                {columns.map((column) => (
                  <th
                    className="py-2  top-0 border-b border-gray-200 bg-buttonHover"
                    key={column.header}
                  >
                    <div>
                      <span>
                        {column.header}
                        {/* Add a sort direction indicator */}
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 inline-block"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 inline-block"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )
                        ) : (
                          ""
                        )}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isEmptyData ? (
                <tr>
                  <td colSpan={columns.length + 1}>
                    <div className="flex flex-col items-center justify-center px-5 py-4 ">
                      <svg
                        className="h-24 w-24"
                        aria-hidden="true"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                      </svg>
                      <div className="text-lg">Nenhum registro encontrado</div>
                    </div>
                  </td>
                </tr>
              ) : null}
              {data.map((row) => {
                return (
                  <tr key={row[uniqueKey]}>
                    {columns.map((column) => {
                      const tdClass = column.cellClass
                        ? column.cellClass
                        : " py-2 truncate";
                      return (
                        <td
                          className={`${tdClass} ${getAlign(column)}`}
                          key={column.acessor + row[uniqueKey]}
                        >
                          {renderCell(row, column)}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TableBase;
