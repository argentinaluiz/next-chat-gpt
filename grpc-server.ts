import * as grpc from "@grpc/grpc-js";
import { CreateChatRequest, CreateChatResponse } from "./src/proto/chat_pb";
import { FindChatsRequest } from "./src/proto/chat_pb";
import { FindChatsResponse } from "./src/proto/chat_pb";
import { FindMessageRequest } from "./src/proto/chat_pb";
import { FindMessageResponse } from "./src/proto/chat_pb";
import { ChatService, IChatServer } from "./src/proto/chat_grpc_pb";
import { promisify } from "util";

class ChatServer implements IChatServer {
  create(
    call: grpc.ServerUnaryCall<CreateChatRequest, CreateChatResponse>,
    callback: grpc.sendUnaryData<CreateChatResponse>
  ) {
    console.log(call.request.getQuestion());
    const response = new CreateChatResponse();

    callback(null, response);
  }

  findChats(
    call: grpc.ServerUnaryCall<FindChatsRequest, FindChatsResponse>,
    callback: grpc.sendUnaryData<FindChatsResponse>
  ) {
    const response = new FindChatsResponse();

    callback(null, response);
  }
  findMessages(
    call: grpc.ServerUnaryCall<FindMessageRequest, FindMessageResponse>,
    callback: grpc.sendUnaryData<FindMessageResponse>
  ) {
    const response = new FindMessageResponse();

    callback(null, response);
  }

  [name: string]: grpc.UntypedHandleCall;
}

export async function createServer() {
  const server = new grpc.Server();
  server.addService(ChatService, new ChatServer());

  const bindPromise = promisify(server.bindAsync).bind(server);
  await bindPromise("0.0.0.0:5000", grpc.ServerCredentials.createInsecure());
  server.start();
  console.log("Server running at http://localhost:5000");
  return server;
}
