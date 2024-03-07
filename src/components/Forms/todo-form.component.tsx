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
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { todoAbi } from "@/abis";
import { getAddress, parseEther } from "viem";
import { wagmiClient } from "@/configs";
import toast from "react-hot-toast";

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
  const { writeContract, data: hash } = useWriteContract({
    config: wagmiClient,
  });

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: hash!,
    });

  useEffect(() => {
    if (isConfirmed) {
      onSuccess?.();
    }
  }, [isConfirmed]);

  const [todoFormData, setTodoFormData] = useState<TodoData>({
    title: "",
    description: "",
  });

  const [isSending, setisSending] = useState(false);
  const createTodo = () => {
    setisSending(true);
    writeContract(
      {
        abi: todoAbi,
        address: getAddress(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!),
        functionName: "createTask",
        args: [todoFormData.title, todoFormData.description || ""],
        value: parseEther("1", "gwei"),
      },
      {
        onSuccess: () => {
          toast.loading("Todo Created! Waiting for confirmation.", {
            id: "loading1",
          });
          setisSending(false);
          setTodoFormData({ title: "", description: "" });
          if (setConfirming) {
            setConfirming(true);
          }
        },
        onError: () => {
          setisSending(false);
          toast.error("Transaction Failed! Try Again.");
        },
      }
    );
  };

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
        onClick={createTodo}
        block
        className="w-full"
      >
        {!isSending && "Create"}
      </Button>
    </form>
  );
};
