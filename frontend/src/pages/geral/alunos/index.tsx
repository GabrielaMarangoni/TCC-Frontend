import router, { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/Sidebar";
import { divGeneral, textTitle } from "./styles";
import { HStack } from "@chakra-ui/react";
import { Button } from "../../../components/Button";
import { Search } from "../../../components/search";
import TableBase from "../../../components/Table/TableBase";
import { TColumn } from "../../../components/Table/TColumn";
import TPagination from "../../../components/Table/TPagination";
import TableButton from "../../../components/Table/TableButton";

export default function Alunos() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [hydrated, setHydrated] = useState(false);
  const [text, setText] = useState("");
  
  const columns: TColumn[] = [
    {
      header: "RA",
      acessor: "RA",
    },
    {
      header: "Nome",
      acessor: "NAME",
    },
    {
      header: "Telefone",
      acessor: "TELEFONE",
      renderer: (value) => {
        if(value.length === 0) return "";
        if(value.length === 10) return value.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
        return value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
      }
    },
    {
      header: "Email",
      acessor: "EMAIL",
    },
    {
      header: "Obs",
      acessor: "obs",
    }
  ];
  
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('http://localhost:3000/api/estudantes/');
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    }

    setHydrated(true);
    fetchData();
  }, []);

  if (!hydrated) {
    return null;
  }

  return (
    <div>
      <Sidebar />
      <div className={divGeneral}>
       
          <h1 className={textTitle}>Alunos</h1>
         

        <div className="pt-10 w-full pb-10">
          <Search haslabel label="" text={text} setText={(value) => setText(value)} search/>
        </div>

        <TableButton
          columns={columns}
          data={text.length > 0 ? data.filter((v: any) => v.NAME.toLowerCase().indexOf(text.toLowerCase()) !== -1) : data || []}
          editable={false}
          uniqueKey={"id"}
          setData={function (value: any): void {
            throw new Error("Function not implemented.");
          }}
          selecteds={[]}
          setSelecteds={function (value: any): void {
            throw new Error("Function not implemented.");
          }}
        />
      </div>
    </div>
  );
}
