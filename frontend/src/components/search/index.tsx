import React, { InputHTMLAttributes } from 'react';

interface IInputProps extends InputHTMLAttributes<HTMLInputElement>{
    haslabel?: boolean;
    label?: string;    
    fontSize?: string;
    top?: string;
    bg?: string;
    search?: boolean;
    text?: string;
    setText?: (value: string) => void;
}

function Search({
    haslabel = false, 
    label, 
    top = "mt-0",
    bg,
    search,
    ...rest
}: IInputProps) {
    if(haslabel || search) {
        console.log('search', search)
        return (
            <form onSubmit={(e) => e.preventDefault()}>   
                <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    <input 
                        type="search" 
                        id="default-search" 
                        className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500" 
                        placeholder="Buscar por nome" 
                        required
                        value={rest.text}
                        onChange={(e) => rest.setText && rest.setText(e.target.value)}
                    />
                </div>
            </form>
            
        )
    } 

    return (
        <input {...rest} />
    )
}

export {Search};
