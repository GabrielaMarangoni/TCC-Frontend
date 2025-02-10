import router, { useRouter } from "next/router";
import React, { useState } from "react";
import { HStack } from "@chakra-ui/react";
import { button} from "./styles";

export default function ButtonGrupo({ data, last }: { data: any, last?: boolean }) {
  const router = useRouter();
  const [temNotificacao, setTemNotificacao] = useState(false);

  const handleNotificacaoClick = () => {
    setTemNotificacao(!temNotificacao);
  };

  const goToObs = () => {
    router.push(`/geral/observacao/minhasObs/groups?filter=groups&group=${data.ID}`);
  }

  return (
        <button className={button.concat(last ? " mb-10" : "")} onClick={goToObs}>
         
            <div className="flex justify-between w-full ">
              <h1 className="text-lg font-semibold">
  {data.NAME.length > 30 ? data.NAME.slice(0, 30) + "..." : data.NAME}
</h1>
              <h1 className="text-lg ">{(data.SOMA_ESTUDANTES > 1 || data.SOMA_ESTUDANTES === 0) ? data.SOMA_ESTUDANTES + ' alunos' : data.SOMA_ESTUDANTES + ' aluno'}</h1>
            </div>
           
           {/*  <div className="flex justify-center">
              <div className="flex items-center space-x-3">
                {temNotificacao && <h1 className="text-2xl">10</h1>}
                {temNotificacao ? (
                  <i
                    className="ri-notification-4-fill ri-xl"
                    style={{ color: "red" }}
                  ></i>
                ) : (
                  <div className="flex items-center space-x-3">
                    <h1 className="text-2xl">0</h1>
                    <i className="ri-notification-4-line ri-xl"></i>
                  </div>
                  
                )}
              </div>
            </div> */}
         
        </button>
     
  );
}
