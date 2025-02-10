
import React, { useEffect, useState } from "react";
import { HStack } from "@chakra-ui/react";
import { button } from "./styles";
import { useRouter } from "next/router";

export default function ButtonAluno({ data}: { data: any}) {
 
  const router = useRouter();
  useEffect(() => {

  }, [])

  const handleClick = () => {
    router.push(`/geral/alunos/historico?RA=${data?.ESTUDANTE.RA}`);
  }

  return (  
        <button className={button} onClick={handleClick}>
          
            <div className="flex justify-between w-full ">
              <h1 className="font-bold  ">                
                {data.PROFESSOR.NAME.length > 12 ? data.PROFESSOR.NAME.slice(0, 12) + "..." : data.PROFESSOR.NAME}
              </h1>
              <h1>
              {data.DISCIPLINA.NOME_DIS} - {data.DISCIPLINA.ANO_DIS} 
              </h1>
            </div>

            <div className="border-b border-gray-400 my-2"></div>

              <div >
                <h1 className="text-lg font-semibold text-start">{data?.ESTUDANTE.NAME || 'Aluno'}</h1>

              </div>
              <div>
                <p className="text-start line-clamp-1  overflow-hidden text-ellipsis max-h-[3rem] ">{data?.OBS}</p>

              </div>         
          
        </button>
  );
}
