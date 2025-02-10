import router, { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/Sidebar";
import { HStack } from "@chakra-ui/react";
import { Button } from "../../../components/Button";
import { Search } from "../../../components/search";
import { divGeneral, textTitle } from "../alunos/styles";
import { TColumn } from "../../../components/Table/TColumn";
import TableBase from "../../../components/Table/TableBase";
import { METHODS } from "http";

export default function Alunos() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [hydrated, setHydrated] = useState(false);
  const [text, setText] = useState("");

  async function fetchData() {
    try {
      const response = await fetch('http://localhost:3000/api/professors/', {
        method: 'GET', 
        headers: {
          'Content-Type': 'application/json',         
        },
        mode: 'cors', 
        credentials: 'same-origin', 
      });
      const data = await response.json();
      setData(data.filter((el: any) => el.IS_COORD === false));
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  }
  useEffect(() => {
    setHydrated(true);
    fetchData();
  }, []);

  if (!hydrated) {
    return null;
  }

  async function handleDelete(id: string) {
    try {
      console.log("ID do professor CIMA:", id); 
      const response = await fetch(`http://localhost:3000/api/professors/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchData();
      } else {
        console.error("Erro ao excluir professor:", response.statusText);
      }
    } catch (error) {
      console.error("Erro ao excluir professor:", error);
    }
  }
  
  function openRegister() {
    router.push("/gerenciamento/professores/opcao");
  }

  const columns: TColumn[] = [
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
      header: "",
      acessor: "",
      renderer: (id: string, obj: any) => {
        return (
          <div className="space-x-5 flex justify-end">
            <Button
              onClick={() => {
                router.push(`/gerenciamento/professores/edit/${obj.ID}`);
              }}
              bg={"bg-button"}
              icon={"ri-edit-box-fill"}
            />
            <Button
              onClick={() => {
                const myId = localStorage.getItem("professor_id");
                if (myId === obj.ID) {
                  alert("Você não pode excluir a si mesmo.");
                  return;
                }
                console.log("ID do professor AQUI:", obj.ID); 
                handleDelete(obj.ID);
              }}
              bg={"bg-warning"}
              icon={"ri-delete-bin-fill"}
            />
          </div>
        );
      },
    },
  ];


  return (
    <div>
      <Sidebar />
      <div className={divGeneral}>
        <HStack justifyContent="space-between">
          <h1 className={textTitle}>Lista dos professores já cadastrados</h1>
          <Button
            onClick={openRegister}
            bg="bg-button"
            rounded="rounded-lg"
            w="w-72"
            h="h-full"
            textColor="text-black"
            textWeight="font-bold"
            formAction="submit"
            label="CADASTRAR"
          />
        </HStack>

        <div className="pt-10 w-full pb-10">
          <Search haslabel label="" text={text} setText={(value) => setText(value)} search/>
        </div>

        <TableBase
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
