import { Server } from "@grpc/grpc-js";
import {
  ChatServiceClient,
  ChatServiceClientFactory,
} from "./chat-service-client";
import { createServer } from "../../grpc-server";

describe("ChatServiceClient", () => {
  let chatService: ChatServiceClient;
  let server: Server;
  beforeEach(async () => {
    server = await createServer();
    chatService = ChatServiceClientFactory.create();
  });

  afterEach(() => {
    server.forceShutdown();
  });

  it("should find chats", async () => {
    const chats = await chatService.find()
    console.log(chats);
    // expect(chats).toHaveLength(1);
  });
});
