import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function PasswordInput({ label, ...rest }: { label: string, [key: string]: any }) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative">
      <label className="block">{label}</label>
      <div className="relative">
        <input
          {...rest}
          type={showPassword ? "text" : "password"}
          className="bg-Input2 text-grayText w-full h-12 rounded-lg px-3 text-xl pr-12"
        />
        <span
          className="absolute inset-y-0 right-0 flex items-center px-3 cursor-pointer"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>
    </div>
  );
}
