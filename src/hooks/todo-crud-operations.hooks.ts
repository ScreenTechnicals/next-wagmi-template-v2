import { todoAbi } from "@/abis";
import { wagmiClient } from "@/configs";
import { useState } from "react";
import toast from "react-hot-toast";
import { getAddress, parseEther } from "viem";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

type DeleteTodoProps = {
  id: number;
};

type CreateTodoProps = {
  title: string;
  description: string;
};

type UpdateTodoProps = DeleteTodoProps & CreateTodoProps;

export const useTodoCRUDOperations = () => {
  const { address, isConnected } = useAccount({
    config: wagmiClient,
  });

  const { writeContract, data: hash } = useWriteContract({
    config: wagmiClient,
  });

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: hash!,
    });

  const [isSending, setIsSending] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const createTodo = ({ title, description }: CreateTodoProps) => {
    setIsSending(true);
    writeContract(
      {
        abi: todoAbi,
        address: getAddress(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!),
        functionName: "createTask",
        args: [title, description],
        value: parseEther("1", "gwei"),
      },
      {
        onSuccess: () => {
          toast.loading("Todo Created! Waiting for confirmation.", {
            id: "loading1",
          });
          setIsSending(false);
          if (setConfirming) {
            setConfirming(true);
          }
        },
        onError: () => {
          setIsSending(false);
          toast.error("Transaction Failed! Try Again.");
        },
      }
    );
  };

  const updateTodo = ({ id, title, description }: UpdateTodoProps) => {
    setIsSending(true);
    writeContract(
      {
        abi: todoAbi,
        address: getAddress(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!),
        functionName: "updateTask",
        args: [BigInt(id), title, description],
        value: parseEther("1", "gwei"),
      },
      {
        onSuccess: () => {
          toast.loading("Todo Updated! Waiting for confirmation.", {
            id: "loading1",
          });
          setIsSending(false);
          if (setConfirming) {
            setConfirming(true);
          }
        },
        onError: (err) => {
          setIsSending(false);
          toast.error("Transaction Failed! Try Again.");
          console.log(err.message);
        },
      }
    );
  };

  const deleteTodo = ({ id }: DeleteTodoProps) => {
    setIsDeleting(true);
    writeContract(
      {
        abi: todoAbi,
        address: getAddress(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!),
        functionName: "deleteTodo",
        args: [BigInt(id)],
        value: parseEther("2", "gwei"),
      },
      {
        onSuccess: () => {
          toast.loading("Todo Deleted! Waiting for confirmation.", {
            id: "loading1",
          });
          setIsDeleting(false);
          if (setConfirming) {
            setConfirming(true);
          }
        },
        onError: (err) => {
          setIsDeleting(false);
          toast.error("Transaction Failed! Try Again.");
          console.log(err.message);
        },
      }
    );
  };

  const useGetTodo = (id: number) => {
    const { data } = useReadContract({
      abi: todoAbi,
      address: getAddress(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!),
      functionName: "getTask",
      args: [BigInt(id)],
      account: address && getAddress(address!),
    });
    return { data: data };
  };

  const useGetTodos = () => {
    const { data, isLoading, refetch } = useReadContract({
      abi: todoAbi,
      address: getAddress(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!),
      functionName: "getTasks",
      account: address && getAddress(address),
      query: {
        staleTime: 0,
        enabled: isConnected,
      },
    });
    return { data, isLoading, refetch };
  };

  return {
    isSending,
    isDeleting,
    confirming,
    isConfirming,
    isConfirmed,
    hash,
    createTodo,
    updateTodo,
    deleteTodo,
    useGetTodo,
    useGetTodos,
  };
};
