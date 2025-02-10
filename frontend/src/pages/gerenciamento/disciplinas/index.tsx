import router, { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/Sidebar";
import { HStack } from "@chakra-ui/react";
import { Button } from "../../../components/Button";
import { Search } from "../../../components/search";
import TableBase from "../../../components/Table/TableBase";
import { TColumn } from "../../../components/Table/TColumn";
import TPagination from "../../../components/Table/TPagination";
import { divGeneral, textTitle } from "../alunos/styles";

export default function Disciplinas() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [hydrated, setHydrated] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('http://localhost:3000/api/disciplinas/');
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
  
  function openRegister() {
    router.push("/gerenciamento/disciplinas/opcao");
  }
 
  async function fetchData() {
    try {
      const response = await fetch('http://localhost:3000/api/disciplinas/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: 'same-origin',
      });
  
      setData(await response.json());
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  }
  
  async function handleDelete(id: string) {
    try {
      const response = await fetch(`http://localhost:3000/api/disciplinas/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchData();
      } else {
        console.error("Erro ao excluir disciplina:", response.statusText);
      }
    } catch (error) {
      console.error("Erro ao excluir disciplina:", error);
    }
  }
  const columns: TColumn[] = [
    {
      header: "Disciplina",
      acessor: "NOME_DIS",
    },
    {
      header: "Período",
      acessor: "ANO_DIS",
    },
    
    {
      header: "",
      acessor: "ID_DIS",
      renderer: (id: string, obj: any) => {
        return (
          <div className="space-x-5 flex justify-end ">
            <Button
              onClick={() => {
                router.push(`/gerenciamento/disciplinas/edit/${id}`);
              }}
              bg={"bg-button"}
               icon={"ri-edit-box-fill"}
            />
            <Button
              onClick={() => handleDelete(obj.ID_DIS)} 
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
          <h1 className={textTitle}>Lista das disciplinas já cadastrados</h1>
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
          <Search haslabel label="" text={text} setText={setText} search/>
        </div>

        <TableBase
          columns={columns}
          data={text.length ? data.filter((el: any) => el.NOME_DIS.toLowerCase().indexOf(text.toLowerCase()) !== -1) : data || []}
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
