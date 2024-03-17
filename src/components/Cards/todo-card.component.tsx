import React from "react";
import { TodoData } from "../Forms/todo-form.component";
import Link from "next/link";
import { MdArrowForward } from "react-icons/md";

type TodoCardProps = TodoData & {
  id: number;
};

export const TodoCard = ({ title, id }: TodoCardProps) => {
  return (
    <div className="flex items-center justify-between w-full mb-4 pb-3 border-b border-[#2d2d2d]">
      <h2 className="text-base md:text-xl font-medium text-gray-200">
        {title}
      </h2>
      <Link
        href={`/example/todo-app/todos/${id}`}
        className="group flex items-center"
      >
        <span>View</span>
        <MdArrowForward
          size={25}
          className="relative group-hover:translate-x-1 transition-transform duration-500"
        />
      </Link>
    </div>
  );
};
