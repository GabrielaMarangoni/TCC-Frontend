import React, { ButtonHTMLAttributes } from "react";
import { buttonStyle } from "./styles";
import { cn } from "../../lib/utils";

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  bg?: string;
  rounded?: string;
  w?: string;
  h?: string;
  textColor?: string;
  textWeight?: string;
  textSize?: string;
  others?: string;
  label?: string;
  icon?: string;
}
function Button({
  bg = "bg-transparent",
  rounded = "rounded",
  textColor = "text-black",
  textWeight = "font-normal",
  textSize = "text-lg",
  w,
  h,
  others,
  label,
  icon,
  ...rest
}: IButtonProps) {
  const hasIcon = !!icon;
  return (
    <button
      {...rest}
      className={cn(`${buttonStyle} ${textSize} ${bg} ${rounded} ${textColor} ${w} ${h} ${textWeight} p-2`, rest.className)}
    >     
   {hasIcon && <i className={`${icon} px-3`} />} 
      {label}
    </button>
  );
}

export { Button };
