// package: pb
// file: chat.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class ChatRequest extends jspb.Message { 

    hasChatId(): boolean;
    clearChatId(): void;
    getChatId(): string | undefined;
    setChatId(value: string): ChatRequest;
    getUserId(): string;
    setUserId(value: string): ChatRequest;
    getUserMessage(): string;
    setUserMessage(value: string): ChatRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ChatRequest.AsObject;
    static toObject(includeInstance: boolean, msg: ChatRequest): ChatRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ChatRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ChatRequest;
    static deserializeBinaryFromReader(message: ChatRequest, reader: jspb.BinaryReader): ChatRequest;
}

export namespace ChatRequest {
    export type AsObject = {
        chatId?: string,
        userId: string,
        userMessage: string,
    }
}

export class ChatResponse extends jspb.Message { 
    getChatId(): string;
    setChatId(value: string): ChatResponse;
    getUserId(): string;
    setUserId(value: string): ChatResponse;
    getContent(): string;
    setContent(value: string): ChatResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ChatResponse.AsObject;
    static toObject(includeInstance: boolean, msg: ChatResponse): ChatResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ChatResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ChatResponse;
    static deserializeBinaryFromReader(message: ChatResponse, reader: jspb.BinaryReader): ChatResponse;
}

export namespace ChatResponse {
    export type AsObject = {
        chatId: string,
        userId: string,
        content: string,
    }
}
