import { AlignLeft, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../Tooltip";
import { getLinkPreview } from "link-preview-js";
import { HStack } from "@chakra-ui/react";

type DocumentProps = {
  title: string;
  description: string;
  url: string;
}

function Document({ title, description, url }: DocumentProps) {
  const [previewData, setPreviewData] = useState<{ title: string; description: string; image: string }>(null as any);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const data = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'text/html');
        const title = doc.querySelector('title')?.textContent || '';
        const description = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
        const image = doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || '';

        setPreviewData({ title, description, image });
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  if (loading) {
    return <Loader2 className="animate-spin"/>;
  }

  return (
    <div className="w-full h-64 rounded border border-slate-200 flex flex-col cursor-pointer" onClick={() => window.open(url, '_blank')}>
      <div className="h-3/4 p-4">
        {
          previewData ? previewData.image && <img src={previewData.image} alt="Link Preview" /> : 
          <h1 className="text-sm text-slate-400">Sem visualização - Clique para entrar</h1>
        }
      </div>
      <div className="h-2/4 bg-slate-200 w-full rounded-b p-2">
        <h1 className="truncate font-bold text-xl">{title}</h1>
        <h1 className="truncate">{description}</h1>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="flex justify-end space-x-5 mt-2">
                <AlignLeft className="mt-5" size={20}/>
                {/*  nao to conseguindo fazer os botoes ficarem no final da div */}
                  <div className="flex justify-end space-x-5"> 
                    <button className="bg-warning text-white px-3 py-2 rounded ri-delete-bin-fill"/>
                    <button className="bg-button text-white px-3 py-2 rounded ri-edit-box-fill"/>
                  </div>

              </div>
            </TooltipTrigger>
            <TooltipContent>
            {/*  <p>{description}</p> */}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}

export {Document};