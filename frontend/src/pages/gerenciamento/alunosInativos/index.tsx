import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Sidebar from "../../../components/Sidebar";
import { divGeneral, textTitle } from "./styles";
import { HStack } from "@chakra-ui/react";
import { Button } from "../../../components/Button";
import { Search } from "../../../components/search";
import TableBase from "../../../components/Table/TableBase";
import { TColumn, TColumnAlign } from "../../../components/Table/TColumn";

export default function AlunosInativos() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [hydrated, setHydrated] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('http://localhost:3000/api/deleted/estudantes/');
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

  async function goToHistory(id: string) {
    router.push(`/geral/alunos/historicoInativo?RA=${id}`)
  }
  
  async function handleRestore(id: string) {
    try {
      const response = await fetch(`http://localhost:3000/api/restore/estudantes/${id}`, {
        method: 'PUT',
      });
      if (response.ok) {
        window.location.reload();
      } else {
        alert("Erro ao restaurar aluno");
      }
    } catch (error) {
      alert("Erro ao restaurar aluno");
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
        if(value.length === 9) return value.replace(/(\d{2})(\d{4})(\d{3})/, "($1) $2-$3");
        if(value.length === 10) return value.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
        if(value.length === 11) return value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
        return value;
      }
    },
    {
      header: "Email",
      acessor: "EMAIL",
    },
    {
      align: TColumnAlign.right,
      header: "Gerenciamento",
      acessor: "RA",
      renderer: (RA: string, obj: any) => {
        return (
          <div className="flex space-x-2 items-center justify-end">
            <Button 
              onClick={() => handleRestore(RA)}
              bg="bg-button"
              rounded="rounded-lg"
              w="w-fit"
              h="h-8"
              textColor="text-black"
              textWeight="font-semibold"
              formAction="submit"
              className="text-sm"
              label="Restaurar aluno"
            />  
            <Button 
              onClick={() => goToHistory(RA)}
              bg="bg-button"
              rounded="rounded-lg"
              w="w-fit"
              h="h-8"
              textColor="text-black"
              textWeight="font-semibold"
              formAction="submit"
              className="text-sm"
              label="Ver histórico de observações"
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
          <h1 className={textTitle}>Alunos Inativos</h1>
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

