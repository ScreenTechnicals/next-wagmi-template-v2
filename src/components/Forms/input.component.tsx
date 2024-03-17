import React, { ComponentProps } from "react";
import { twJoin } from "tailwind-merge";

type InputProps = ComponentProps<"input"> & {
  label?: string;
  block?: boolean;
};

export const Input = ({ label, className, block, ...props }: InputProps) => {
  return (
    <div className="mb-2 md:mb-4">
      {label && (
        <label
          htmlFor={label.replace(" ", "_")}
          className="text-sm md:text-xl inline-block mb-1 md:mb-2 font-bold"
        >
          {label}
        </label>
      )}

      <input
        name={label && label.replace(" ", "_")}
        id={label && label.replace(" ", "_")}
        className={twJoin(
          "w-full bg-transparent border border-[#3f3f3f] outline-none focus:border-[#00bb1c] px-4 py-2 rounded-md transition-colors text-sm md:text-xl disabled:cursor-not-allowed",
          block && "bg-white",
          className
        )}
        {...props}
      />
    </div>
  );
};
