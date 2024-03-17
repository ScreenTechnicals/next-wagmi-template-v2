"use client";

import React, {
  Dispatch,
  DispatchWithoutAction,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Input } from "./input.component";
import { twJoin } from "tailwind-merge";
import { Button } from "../Buttons/button.component";
import { Textarea } from "./textarea.component";
import { useTodoCRUDOperations } from "@/hooks";

type TodoFormProps = {
  address: string;
  className?: string;
  onSuccess?: DispatchWithoutAction;
  setConfirming?: Dispatch<SetStateAction<boolean>>;
};
export type TodoData = {
  title: string;
  description?: string;
};
export const TodoForm = ({
  address,
  onSuccess,
  className,
  setConfirming,
}: TodoFormProps) => {
  const [todoFormData, setTodoFormData] = useState<TodoData>({
    title: "",
    description: "",
  });
  const { isConfirmed, isSending, createTodo, confirming } =
    useTodoCRUDOperations();
  useEffect(() => {
    if (isConfirmed) {
      onSuccess?.();
      setTodoFormData({ title: "", description: "" });
    }
    if (confirming) {
      setConfirming?.(true);
    }
  }, [isConfirmed, confirming]);

  return (
    <form className={twJoin("w-full p-5 rounded-md bg-[#1f1f1f]", className)}>
      <h2 className="text-center md:text-3xl text-xl font-bold mb-5">
        Create Todo
      </h2>
      <Input type="text" label="Address" value={address} disabled />
      <Input
        type="text"
        label="Title"
        placeholder="Enter Your Title Here"
        onChange={(e) => {
          setTodoFormData((value) => ({ ...value, title: e.target.value }));
        }}
        value={todoFormData.title}
      />
      <Textarea
        label="Description"
        placeholder="Enter Your Description Here"
        onChange={(e) => {
          setTodoFormData((value) => ({
            ...value,
            description: e.target.value,
          }));
        }}
        value={todoFormData.description}
      />
      <Button
        type="button"
        color="#00b21b"
        disabled={isSending}
        loading={isSending}
        onClick={() => {
          createTodo({
            title: todoFormData.title!,
            description: todoFormData.description!,
          });
        }}
        block
        className="w-full"
      >
        {!isSending && "Create"}
      </Button>
    </form>
  );
};
