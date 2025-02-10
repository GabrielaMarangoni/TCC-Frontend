import router from "next/router";
import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/Sidebar";
import { Document } from "../../../components/Document";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  const getDocuments = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/documentos");
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  }

  useEffect(() => {
    getDocuments();
  }, [])
   
  useEffect(() => {
    setHydrated(true);
  }, [])

  if (!hydrated) {
    return null;
  }

  return (
    <div >
      <Sidebar />

      <div className="min-w-[calc(100vw-20rem)] max-w-min w-full flex justify-between items-center ml-80 pt-20 pb-5 px-20">
        <h1 className="font-semibold text-4xl">Documentos</h1>
      </div>

      <div className="w-[calc(100vw-20rem)] flex flex-col justify-start ml-80">
        <div className="grid grid-cols-5 gap-4 px-20 pb-20 max-w-7xl items-center">
          {data.map((document: any) => (
            <Document 
              key={document.ID}
              title={document.TITULO}
              description={document.DESCRICAO}
              url={document.LINK}
            />
          ))}
          {data.length === 0 && (
            <h1 className="col-span-3 text-start text-gray-500 text-lg">Nenhum documento cadastrado</h1>
          )}
        </div>
      </div>
    </div>
  );
}
