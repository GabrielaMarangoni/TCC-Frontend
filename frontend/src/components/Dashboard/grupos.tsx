import router from "next/router";
import React, { useState } from "react";
import { mainDiv, mainDivGrupo, textoGrupo } from "./styles";
import ButtonGrupo from "./buttonGrupo";

export default function DashboardGrupos({ data }: { data: any[] }) {
  console.log(data);

  return (
    <div className={mainDivGrupo}>
      <div className="flex flex-col px-5 w-full gap-3 h-full">
        <h1 className={textoGrupo}>Grupos</h1>
        <div className="overflow-y-auto h-[calc(100%-3rem)] w-full space-y-3 px-3">
          {data?.map((el, i) => (
            <ButtonGrupo key={i} data={el} last={data.length === i +1} />
          ))}
        </div>
      </div>
    </div>
  );
}
