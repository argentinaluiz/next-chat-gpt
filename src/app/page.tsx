"use client";

import useSwr from "swr";
import useSWRSubscription from "swr/subscription";
import { Chat, Message } from "@prisma/client";
import ClientHttp, { fetcher } from "../http/fetch-http";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserIcon } from "./components/icons/UserIcon";
import Image from "next/image";
import { ArrowRight } from "./components/icons/ArrowRight";

type ChatWithFirstMessage = Chat & {
  messages: [Message];
};

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const chatIdParam = searchParams.get("id") as string;
  const [chatId, setChatId] = useState<string | null>(chatIdParam);

  const [messageId, setMessageId] = useState<string | null>(null);
  console.log("chatId", chatId);
  const { data: messages, mutate: mutateMessages } = useSwr<Message[]>(
    chatId ? `chats/${chatId}/messages` : null,
    fetcher,
    {
      fallbackData: [],
    }
  );
  const { data: chats, mutate: mutateChats } = useSwr<ChatWithFirstMessage[]>(
    "chats",
    fetcher,
    {
      fallbackData: [],
    }
  );

  useEffect(() => {
    setChatId(chatIdParam);
  }, [chatIdParam]);

  const { data: messageLoading, error: errorMessageLoading } =
    useSWRSubscription(
      messageId ? `/api/messages/${messageId}/events` : null,
      (path: string, { next }) => {
        console.log("init event source");
        const eventSource = new EventSource(path);
        eventSource.onmessage = (event) => {
          console.log("message:", event);
          const data = JSON.parse(event.data);
          next(null, data.message);
        };
        eventSource.addEventListener("complete", (event) => {
          console.log("complete:", event);
          eventSource.close();
          next(null, null);
          const newMessage = JSON.parse(event.data);
          mutateMessages((messages) => {
            return [...messages!, newMessage];
          }, false);
        });
        eventSource.onerror = (event) => {
          console.log("error:", event);
          eventSource.close();
          //@ts-ignore
          next(event.data, null);
        };
        next(null, "");
        return () => {
          console.log("close event source");
          eventSource.close();
        };
      }
    );

  useEffect(() => {
    const textarea = document.querySelector("#message") as HTMLTextAreaElement;
    textarea.addEventListener("input", () => {
      
      if (textarea.scrollHeight >= 200) {
        textarea.style.overflowY = "scroll";
      } else {
        textarea.style.overflowY = "hidden";
        textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
      }
    });
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    //@ts-ignore
    const message = event.currentTarget.elements[0].value;

    if (!chatId) {
      const newChat = await ClientHttp.post("chats", { message });
      //router.push(`/?id=${newChat.id}`);
      setChatId(newChat.id);
      setMessageId(newChat.messages[0].id);
      mutateChats([newChat, ...chats!], false);
      mutateMessages([newChat.messages[0]], false);
    } else {
      const newMessage = await ClientHttp.post(`chats/${chatId}/messages`, {
        message,
      });

      mutateMessages([...messages!, newMessage], false);
      setMessageId(newMessage.id);
    }
  }

  return (
    <div className="grid grid-cols-5 h-screen">
      <div className="bg-gray-200">
        <ul>
          <li>
            <button type="button" onClick={() => router.push("/")}>
              New chat
            </button>
          </li>
          {chats?.map((chat, key) => (
            <li key={key}>
              <Link href={`/?id=${chat.id}`}>{chat.messages[0].content}</Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col h-screen col-span-4">
        <ul className="h-screen overflow-y-auto">
          <li className="group w-full text-gray-800 dark:text-gray-100 border-b border-black/10 dark:border-gray-900/50 dark:bg-gray-800">
            {/* group w-full text-gray-800 dark:text-gray-100 border-b border-black/10 dark:border-gray-900/50 bg-gray-50 dark:bg-[#444654] */}
            <div className="text-base gap-4 md:gap-6 md:max-w-2xl lg:max-w-xl xl:max-w-3xl p-4 md:py-6 flex lg:px-0 m-auto ">
              <div className="flex flex-row items-start space-x-4 ">
                {/* <UserIcon className="w-[30px] flex flex-col relative start" /> */}
                <Image
                  src="/fullcycle_logo.png"
                  width={30}
                  height={30}
                  alt=""
                />
                <div className="relative flex w-[calc(100%-50px)] flex-col gap-1 md:gap-3 lg:w-[calc(100%-115px)]">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Phasellus eget mi justo. Nullam pretium lacinia orci nec
                  placerat. Orci varius natoque penatibus et magnis dis
                  parturient montes, nascetur ridiculus mus. Aliquam erat erat,
                  tempor at orci eu, porta sagittis ante. Phasellus pretium
                  magna id purus pellentesque, id tristique mi porta. Etiam nec
                  auctor urna, dapibus accumsan augue. Vivamus nec tortor elit.
                  Phasellus vel semper ipsum. Ut in ipsum lorem. Mauris ornare
                  tellus sit amet venenatis convallis. Vestibulum arcu erat,
                  ultrices ut aliquam vitae, sodales eget massa. Curabitur elit
                  ipsum, vehicula ac semper in, tristique vitae tortor.
                </div>
              </div>
            </div>
          </li>
          <li className=""></li>

          {messages?.map((message, key) => (
            <li key={key}>{message.content}</li>
          ))}
          {messageLoading && (
            <>
              <li>{messageLoading}</li>
              <li>Carregando...</li>
            </>
          )}
          {errorMessageLoading && (
            <>
              <li>{errorMessageLoading}</li>
            </>
          )}
        </ul>
        {/* <div className="flex-grow bg-gray-400 p-4">
          <h2 className="text-lg font-bold">Conteúdo principal</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
            auctor placerat orci ac fringilla. Nam convallis ipsum eu libero
            ultrices malesuada. Donec eget sapien vel tortor efficitur faucibus.
            Nunc dapibus orci sed consequat laoreet. Praesent euismod semper
            elit, non pharetra augue rutrum eu. Fusce efficitur, dolor nec
            vehicula varius, sapien velit commodo velit, vel sagittis leo libero
            ut magna. Pellentesque at interdum ante. Vestibulum ante ipsum
            primis in faucibus orci luctus et ultrices posuere cubilia curae;
            Donec id magna quis erat euismod interdum sit amet sit amet augue.
            Duis sit amet libero eget leo lacinia pellentesque.
          </p>
        </div> */}
        <div className="absolute bottom-0 left-0 w-full border-t md:border-t-0 dark:border-white/20 md:border-transparent md:dark:border-transparent md:bg-vert-light-gradient bg-white dark:bg-gray-800 md:!bg-transparent dark:md:bg-vert-dark-gradient pt-2">
          <div className="stretch mx-2 flex flex-row gap-3 last:mb-2 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
            <form className="w-full" onSubmit={onSubmit}>
              <div className="relative flex h-full flex-1 md:flex-col">
                <div className="flex flex-col w-full py-2 flex-grow md:py-3 md:pl-4 relative border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]">
                  <textarea
                    id="message"
                    tabIndex={0}
                    rows={1}
                    placeholder="Digite sua pergunta"
                    className="m-0 w-full resize-none border-0 bg-transparent p-0 pr-7 focus:ring-0 focus-visible:ring-0 dark:bg-transparent pl-2 md:pl-0 outline-none"
                    defaultValue="Gere uma classe de produto em JavaScript"
                  ></textarea>
                  <button
                    type="submit"
                    className="absolute p-1 rounded-md text-gray-500 bottom-1.5 md:bottom-2.5 hover:bg-gray-100 enabled:dark:hover:text-gray-400 dark:hover:bg-gray-900 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent right-1 md:right-2 disabled:opacity-40"
                    disabled={messageLoading}
                  >
                    <ArrowRight className="text-white-500 w-[30px]" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    // <>
    //   <div className="grid grid-flow-row-dense grid-cols-3 grid-rows-3 ...">
    //     <div className="col-span-2">01</div>
    //     <div className="col-span-2">02</div>
    //     <div>03</div>
    //     <div>04</div>
    //     <div>05</div>
    //   </div>
    //   <div className="grid grid-cols-2 grid-flow-row-dense">
    //     <div className="bg-gray-200">aaaa</div>
    //     <div className="flex flex-col h-screen">
    //       <div className="flex-none bg-gray-200 p-4">
    //         <h1 className="text-xl font-bold">Cabeçalho</h1>
    //       </div>

    //       <div className="flex-grow bg-gray-400 p-4">
    //         <h2 className="text-lg font-bold">Conteúdo principal</h2>
    //         <p>
    //           Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
    //           auctor placerat orci ac fringilla. Nam convallis ipsum eu libero
    //           ultrices malesuada. Donec eget sapien vel tortor efficitur
    //           faucibus. Nunc dapibus orci sed consequat laoreet. Praesent
    //           euismod semper elit, non pharetra augue rutrum eu. Fusce
    //           efficitur, dolor nec vehicula varius, sapien velit commodo velit,
    //           vel sagittis leo libero ut magna. Pellentesque at interdum ante.
    //           Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
    //           posuere cubilia curae; Donec id magna quis erat euismod interdum
    //           sit amet sit amet augue. Duis sit amet libero eget leo lacinia
    //           pellentesque.
    //         </p>
    //       </div>

    //       <div className="bg-gray-200 p-4 flex items-end">
    //         <form className="w-full">
    //           <div className="flex">
    //             <input
    //               type="text"
    //               placeholder="Digite sua pergunta"
    //               className="flex-grow border border-gray-400 rounded-l-lg py-2 px-4"
    //             />
    //             <button
    //               type="submit"
    //               className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-lg"
    //             >
    //               Enviar
    //             </button>
    //           </div>
    //         </form>
    //       </div>
    //     </div>
    //   </div>
    // </>
  );
}
