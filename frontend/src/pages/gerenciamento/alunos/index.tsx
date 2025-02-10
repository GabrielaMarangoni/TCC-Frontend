import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Sidebar from "../../../components/Sidebar";
import { divGeneral, textTitle } from "./styles";
import { HStack } from "@chakra-ui/react";
import { Button } from "../../../components/Button";
import { Search } from "../../../components/search";
import TableBase from "../../../components/Table/TableBase";
import { TColumn } from "../../../components/Table/TColumn";

export default function Alunos() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [hydrated, setHydrated] = useState(false);
  const [text, setText] = useState("");

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

  function openRegister() {
    router.push("/gerenciamento/alunos/opcao");
  }

  function openExclude() {
    router.push("/gerenciamento/alunos/excluir");
  }
  
  async function fetchData() {
    try {
      const response = await fetch('http://localhost:3000/api/estudantes/', {
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
      const response = await fetch(`http://localhost:3000/api/estudantes/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchData();
      } else {
        console.error("Erro ao excluir aluno:", response.statusText);
      }
    } catch (error) {
      console.error("Erro ao excluir aluno:", error);
    }
  }
  
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
      header: "",
      acessor: "id",
      renderer: (id: string, obj: any) => {
        console.log("delete", id);
        return (
          <div className="space-x-5 flex justify-end ">
            <Button
              onClick={() => {
                router.push(`/gerenciamento/alunos/edit/${obj.RA}`);
              }}
              bg={"bg-button"}
              icon={"ri-edit-box-fill"}
            />
            <Button
              onClick={() => handleDelete(obj.RA)} 
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
          <h1 className={textTitle}>Lista dos alunos já cadastrados</h1>
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
          <Button
            onClick={openExclude}
            bg="bg-button"
            rounded="rounded-lg"
            w="w-72"
            h="h-full"
            textColor="text-black"
            textWeight="font-bold"
            formAction="submit"
            label="EXCLUIR VÁRIOS"
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
function fetchData() {
  throw new Error("Function not implemented.");
}

