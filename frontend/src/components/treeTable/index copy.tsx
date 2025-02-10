import React from "react";
import { useState } from "react";
import { TColumn, TColumnAlign } from "../Table/TColumn";
import useRenderer from "../Table/TRenderer";

interface TreeNodeProps {
  data?: any;
  isChildren?: boolean;
  setData: (value: any) => void;
  selecteds: any[];
  setSelecteds: (value: any) => void;
  counter: number;
  isParent?: boolean;
}

interface TreeTableProps {
  datat: any[];
  columns: TColumn[];
  uniqueKey: string;
}

const TreeNode: React.FC<TreeNodeProps> = ({
  data,
  isChildren,
  setData,
  selecteds,
  setSelecteds,
  counter,
  isParent = true,
}) => {
  const [expandedItems, setExpandedItems] = useState<any[]>([]);
  const [closed, setClosed] = useState<boolean>(false);
  const [sub, setSub] = useState<boolean>(false);
  const [points, setPoints] = useState<boolean>(false);

  const handleItemExpand = (id: number) => {
    if (expandedItems.includes(id)) {
      setExpandedItems(expandedItems.filter((item) => item !== id));
    } else {
      setExpandedItems([...expandedItems, id]);
    }
  };

  const handleSub = () => {
    setSub(!sub);
  };

  const handlePoint = () => {
    setPoints(!points);
  };
  const handleClose = () => {
    setClosed(!closed);
  };

  return (
    <>
      <tr>
        <div
          className={`flex items-center `}
          style={{ paddingLeft: counter + 1 == 1 ? 20 : (counter + 1) * 20 }}
        >
          <td className=" py-2 align-middle text-left flex">
            <button
              className="flex align-center justify-center items-center mr-10"
              onClick={() => handleItemExpand(data?.id)}
            >
              <h1>{data?.nome}</h1>
            </button>

           
          </td>
        </div>
      </tr>

      {data?.children &&
        expandedItems.includes(data?.id) &&
        data?.children.map((row: any) => (
          <>
            <TreeNode
              data={row}
              counter={counter + 1}
              isChildren={true}
              setData={function (value: any): void {
                throw new Error("Function not implemented.");
              }}
              selecteds={[]}
              setSelecteds={function (value: any): void {
                throw new Error("Function not implemented.");
              }}
              isParent={!!row.children} 
            />
          </>
        ))}

<div className="flex justify-end justify-items-end">
              {/* editar */}
              {isParent && (
                <button className="px-2 hover:text-button ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                    />
                  </svg>
                </button>
              )}

              {/* deletar */}              
              <button className="text-end hover:text-warning">
                <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="far"
                  data-icon="trash-alt"
                  className="h-6 w-6"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                >
                  <path
                    fill="currentColor"
                    d="M268 416h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12zM432 80h-82.41l-34-56.7A48 48 0 0 0 274.41 0H173.59a48 48 0 0 0-41.16 23.3L98.41 80H16A16 16 0 0 0 0 96v16a16 16 0 0 0 16 16h16v336a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128h16a16 16 0 0 0 16-16V96a16 16 0 0 0-16-16zM171.84 50.91A6 6 0 0 1 177 48h94a6 6 0 0 1 5.15 2.91L293.61 80H154.39zM368 464H80V128h288zm-212-48h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12z"
                  />
                </svg>
              </button>
            
            </div>
    </>
  );
};

const TreeTable: React.FC<TreeTableProps> = ({ datat, columns, uniqueKey }) => {
  const isEmptyData: boolean = datat?.length === 0;
  const { renderCell, defaultAlign } = useRenderer();

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
      <div className="w-full overflow-hidden rounded-lg">
        <div className="w-full overflow-x-auto">
          <table className="w-full">
            <tbody className="">
              {isEmptyData ? (
                <tr>
                  <td colSpan={columns.length + 1}>
                    <div className="flex flex-col items-center justify-center px-3 py-4 ">
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
              {datat?.map((row) => (
                <TreeNode
                  data={row}
                  counter={0}
                  setData={function (value: any): void {
                    throw new Error("Function not implemented.");
                  }}
                  selecteds={[]}
                  setSelecteds={function (value: any): void {
                    throw new Error("Function not implemented.");
                  }}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TreeTable;
function defaultAlign(col: TColumn): TColumnAlign {
  throw new Error("Function not implemented.");
}
