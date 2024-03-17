"use client";

import { Button, Input, Textarea } from "@/components";
import { wagmiClient } from "@/configs";
import { useTodoCRUDOperations } from "@/hooks";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAccount } from "wagmi";

type TodoListProps = {
  id: string;
};

const TodoPage = ({ params }: { params: TodoListProps }) => {
  const { id } = params;
  const router = useRouter();

  const { address, isConnected } = useAccount({
    config: wagmiClient,
  });

  const {
    isConfirmed,
    isSending,
    isDeleting,
    updateTodo,
    deleteTodo,
    useGetTodo,
  } = useTodoCRUDOperations();

  const { data: todo } = useGetTodo(parseInt(id));

  const [todoData, setTodoData] = useState({
    title: "",
    description: "",
  });
  const isDisabled =
    todoData.title === todo?.title && todoData.description === todo?.desc;

  useEffect(() => {
    if (todo) {
      setTodoData({
        title: todo.title,
        description: todo.desc,
      });
    }
  }, [todo]);

  useEffect(() => {
    if (isConfirmed) {
      toast.dismiss("loading1");
      toast.success("Transaction confirmed");
      router.push("/example/todo-app");
    }
  }, [isConfirmed]);

  return (
    <div className="w-full min-h-screen p-5 md:px-10 py-5">
      <Input
        label="Author"
        type="text"
        value={todo?.author}
        placeholder="Edit Title"
        disabled
      />
      <Input
        label="Title"
        type="text"
        value={todoData.title}
        placeholder="Edit Title"
        onChange={(e) => {
          setTodoData((value) => ({ ...value, title: e.target.value }));
        }}
      />
      <Textarea
        label="Description"
        value={todoData.description}
        onChange={(e) => {
          setTodoData((value) => ({ ...value, description: e.target.value }));
        }}
      />
      <div className="flex items-center gap-3 justify-center">
        <Button
          onClick={() => {
            deleteTodo({
              id: parseInt(id),
            });
          }}
          color="red"
          block
          disabled={!isDisabled || !isConnected || isDeleting}
          loading={isDeleting}
        >
          Delete
        </Button>
        <Button
          onClick={() => {
            updateTodo({
              id: parseInt(id),
              title: todoData.title!,
              description: todoData.description!,
            });
          }}
          color="green"
          block
          disabled={isDisabled || !isConnected || isSending}
          loading={isSending}
        >
          Save Todo
        </Button>
      </div>
    </div>
  );
};

export default TodoPage;
