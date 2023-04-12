import { Metadata } from "@grpc/grpc-js";
import { ChatServiceClient as ChatClient } from "../proto/chat_grpc_pb";
import { ChatRequest } from "../proto/chat_pb";
import { chatClient } from "./clients";
import { Observable } from "rxjs";

export class ChatServiceClient {

  private authorization = "123456";

  constructor(private client: ChatClient) {}

  async chat(data: {
    chatId?: string;
    user_id: string;
    message: string;
  }): Promise<{ chat_id: string; message: string }> {
    const request = new ChatRequest();
    data.chatId && request.setChatId(data.chatId);
    request.setUserId(data.user_id);
    request.setUserMessage(data.message);
    const metadata = new Metadata();
    metadata.set("authorization", this.authorization);
    return new Promise((resolve, reject) => {
      this.client.chat(request, metadata, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            chat_id: response.getChatId(),
            message: response.getContent(),
          });
        }
      });
    });
  }

  chatStream(data: { chatId?: string | null; message: string }) {
    const request = new ChatRequest();
    data.chatId && request.setChatId(data.chatId);
    request.setUserId("1");
    request.setUserMessage(data.message);
    const metadata = new Metadata();
    metadata.set("authorization", this.authorization);

    return new Observable((subscriber) => {
      // Array.from({ length: 10 }).forEach((_, index) => {
      //   setTimeout(() => {
      //     subscriber.next({
      //       chat_id: "123",
      //       message: `message ${index}`,
      //     });
      //   }, 1000 * index);

      //   if (index === 9) {
      //     setTimeout(() => {
      //       subscriber.complete();
      //     }, 1000 * index + 1);
      //   }
      // });

      const stream = this.client.chatStream(request, metadata);
      stream.on("data", (data) => {
        subscriber.next({
          chat_id: data.getChatId(),
          message: data.getContent(),
        });
      });
      stream.on("error", (err) => {
        subscriber.error(err);
      });
      
      stream.on("end", () => {
         subscriber.complete();
      });
    });
  }
}

export class ChatServiceClientFactory {
  static create() {
    return new ChatServiceClient(chatClient);
  }
}
