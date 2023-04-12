import { ChatServiceClient as ChatClient } from "../proto/chat_grpc_pb";
import { ChannelCredentials } from "@grpc/grpc-js";

export const chatClient = new ChatClient(
  process.env.GRPC_HOST as string,
  ChannelCredentials.createInsecure()
);
