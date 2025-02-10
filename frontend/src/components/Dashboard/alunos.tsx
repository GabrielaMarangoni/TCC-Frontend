import router from "next/router";
import React, { useEffect, useState } from "react";
import { HStack, Stack, VStack } from "@chakra-ui/react";
import { button, mainDiv, textoGrupo } from "./styles";
import ButtonAluno from "./buttonAluno";

export default function DashboardAlunos({ data }: { data: any[] }) {
  return (
    <div className={mainDiv}>
      <div className="px-5 w-full space-y-3">
        <h1 className={textoGrupo}>Acompanhamento dos Grupos </h1>
        <div className="overflow-y-auto h-[calc(100%-3rem)] w-full space-y-3 px-3">
        {data.length > 0 ? (
          data?.map((el) => (
            <ButtonAluno data={el} />
          ))
        ) : (
          <div className="text-gray-500 text-center text-lg ">
            Nenhuma observação disponível no momento.
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

 

