"use client";

import React, { useState } from "react";
import { wagmiClient } from "@/configs";
import { useAccount, useBalance, useReadContract } from "wagmi";
import { Loading, TodoCard, TodoForm } from "@/components";
import { todoAbi } from "@/abis";
import { getAddress } from "viem";
import toast from "react-hot-toast";

const TodoAppPage = () => {
  const { address, chain, isConnected, isReconnecting, isConnecting } =
    useAccount({
      config: wagmiClient,
    });
  const { isLoading, data: balanceData } = useBalance({
    address: address,
  });

  const {
    data,
    isLoading: isLoading2,
    refetch,
  } = useReadContract({
    abi: todoAbi,
    address: getAddress(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!),
    functionName: "getTasks",
    account: getAddress(address!),
    query: {
      staleTime: 0,
      enabled: isConnected,
    },
  });

  const [confirming, setConfirming] = useState(false);

  return (
    <div className="py-7 px-5 min-h-screen">
      {isConnecting || isLoading || isReconnecting ? (
        <Loading />
      ) : isConnected && chain && address && balanceData ? (
        <div className="w-full flex flex-col items-center justify-center">
          <p className="mx-auto md:w-8/12 text-center pt-3 pb-5 font-bold text-xl md:text-6xl">
            Todo App
          </p>
          <div className="mx-auto w-[250px] bg-gradient-to-tr from-[#f00] via-[#ffc800] to-[#ff00ee] h-[1px] rounded-full mb-5"></div>
          <div className="w-full mb-5 md:w-1/2 bg-gradient-to-t p-5 overflow-hidden rounded-md from-[#171717] to-[#393939] text-xs md:text-xl font-extralight space-y-2">
            <p>Chain: {chain.name}</p>
            <p>Address: {address}</p>
            <p>
              Balance:{" "}
              {balanceData.value
                .toString()
                .slice(
                  0,
                  balanceData.value.toString().length - balanceData.decimals
                )}
              {"."}
              {balanceData.value
                .toString()
                .slice(
                  balanceData.value.toString().length - balanceData.decimals,
                  balanceData.decimals - 10
                )}{" "}
              {chain.name}
            </p>
          </div>
          <TodoForm
            address={address}
            onSuccess={() => {
              refetch().then((data) => {
                if (data.data) {
                  setConfirming(false);
                  toast.dismiss("loading1");
                  toast.success("Transaction confirmed");
                }
              });
            }}
            setConfirming={setConfirming}
            className="md:w-1/2 mb-5"
          />
          <div className="w-full mb-5 md:w-1/2 bg-gradient-to-t p-5 overflow-hidden rounded-md from-[#171717] to-[#393939] text-xs md:text-xl font-extralight space-y-2">
            <h2 className="text-center text-xl md:text-3xl">All Todos</h2>
            <div className="pt-5">
              {isLoading2 ? (
                <Loading />
              ) : data?.length ? (
                data.map((item) => {
                  return (
                    <TodoCard
                      key={item.id}
                      title={item.title}
                      id={Number(item.id)}
                    />
                  );
                })
              ) : (
                <p className="text-center">No Data Found</p>
              )}
              <div className="flex items-center justify-center">
                {confirming && (
                  <p className="text-center text-gray-400 animate-bounce">
                    Loading...
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full flex place-items-center place-content-center min-h-[50vh]">
          <p className="text-center text-4xl">Not connected to a wallet</p>
        </div>
      )}
    </div>
  );
};

export default TodoAppPage;
