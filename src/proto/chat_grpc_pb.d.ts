// package: pb
// file: chat.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as chat_pb from "./chat_pb";

interface IChatServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    chat: IChatServiceService_IChat;
    chatStream: IChatServiceService_IChatStream;
}

interface IChatServiceService_IChat extends grpc.MethodDefinition<chat_pb.ChatRequest, chat_pb.ChatResponse> {
    path: "/pb.ChatService/Chat";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<chat_pb.ChatRequest>;
    requestDeserialize: grpc.deserialize<chat_pb.ChatRequest>;
    responseSerialize: grpc.serialize<chat_pb.ChatResponse>;
    responseDeserialize: grpc.deserialize<chat_pb.ChatResponse>;
}
interface IChatServiceService_IChatStream extends grpc.MethodDefinition<chat_pb.ChatRequest, chat_pb.ChatResponse> {
    path: "/pb.ChatService/ChatStream";
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<chat_pb.ChatRequest>;
    requestDeserialize: grpc.deserialize<chat_pb.ChatRequest>;
    responseSerialize: grpc.serialize<chat_pb.ChatResponse>;
    responseDeserialize: grpc.deserialize<chat_pb.ChatResponse>;
}

export const ChatServiceService: IChatServiceService;

export interface IChatServiceServer extends grpc.UntypedServiceImplementation {
    chat: grpc.handleUnaryCall<chat_pb.ChatRequest, chat_pb.ChatResponse>;
    chatStream: grpc.handleServerStreamingCall<chat_pb.ChatRequest, chat_pb.ChatResponse>;
}

export interface IChatServiceClient {
    chat(request: chat_pb.ChatRequest, callback: (error: grpc.ServiceError | null, response: chat_pb.ChatResponse) => void): grpc.ClientUnaryCall;
    chat(request: chat_pb.ChatRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: chat_pb.ChatResponse) => void): grpc.ClientUnaryCall;
    chat(request: chat_pb.ChatRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: chat_pb.ChatResponse) => void): grpc.ClientUnaryCall;
    chatStream(request: chat_pb.ChatRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<chat_pb.ChatResponse>;
    chatStream(request: chat_pb.ChatRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<chat_pb.ChatResponse>;
}

export class ChatServiceClient extends grpc.Client implements IChatServiceClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public chat(request: chat_pb.ChatRequest, callback: (error: grpc.ServiceError | null, response: chat_pb.ChatResponse) => void): grpc.ClientUnaryCall;
    public chat(request: chat_pb.ChatRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: chat_pb.ChatResponse) => void): grpc.ClientUnaryCall;
    public chat(request: chat_pb.ChatRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: chat_pb.ChatResponse) => void): grpc.ClientUnaryCall;
    public chatStream(request: chat_pb.ChatRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<chat_pb.ChatResponse>;
    public chatStream(request: chat_pb.ChatRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<chat_pb.ChatResponse>;
}
