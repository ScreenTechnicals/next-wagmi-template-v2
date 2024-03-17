import React, { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";
import { ImSpinner2 } from "react-icons/im";

type ButtonProps = ComponentProps<"button"> & {
  color: string;
  loading?: boolean;
  block?: boolean;
};

export const Button = ({
  children,
  className,
  color,
  loading,
  block,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={twMerge(
        "text-base md:text-xl font-medium p-2 md:p-3 hover:!bg-[#fff] hover:text-black transition-colors rounded-md flex items-center gap-1 justify-center border border-[#3a3a3a]  disabled:cursor-not-allowed disabled:!bg-[#5f5f5f] disabled:hover:!bg-[#5f5f5f] disabled:hover:text-white",
        loading && "bg-[#5f5f5f] hover:text-white hover:bg-[#5f5f5f]",
        className
      )}
      style={{ background: block ? color : "transparent" }}
      {...props}
    >
      <span>{children}</span>
      {loading && <ImSpinner2 size={30} className="animate-spin" />}
    </button>
  );
};
