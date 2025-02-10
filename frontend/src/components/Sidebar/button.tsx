import { useRouter } from "next/router";
import React, { AnchorHTMLAttributes, cloneElement, ReactElement } from "react";
import { buttonStyle } from './styles';

interface IButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    shouldMatchExactHref?: boolean;
    children: ReactElement;
}
function Button({
    shouldMatchExactHref = false, 
    children,  
    ...rest 
}: IButtonProps) {
    const { asPath } = useRouter();
    let isActive = false;

    if(asPath === rest.href) {
        isActive = true;
    }

    // console.log('1', asPath);
    // console.log('2', rest.href);

    // if(shouldMatchExactHref && asPath === rest.href) {
    //     isActive = true;
    // }

    // if(!shouldMatchExactHref && (asPath.includes(String(rest.href)))) {
    //     isActive = true;
    // }

    return (           
        <a {...rest}>
            {cloneElement(children, {
                className: isActive 
                ? `bg-button text-white font-semibold ${buttonStyle}` 
                : `bg-transparent text-black font-regular ${buttonStyle}`
            })}
        </a>
    );
}

export {Button}