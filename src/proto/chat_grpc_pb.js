// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var chat_pb = require('./chat_pb.js');

function serialize_pb_ChatRequest(arg) {
  if (!(arg instanceof chat_pb.ChatRequest)) {
    throw new Error('Expected argument of type pb.ChatRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_pb_ChatRequest(buffer_arg) {
  return chat_pb.ChatRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_pb_ChatResponse(arg) {
  if (!(arg instanceof chat_pb.ChatResponse)) {
    throw new Error('Expected argument of type pb.ChatResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_pb_ChatResponse(buffer_arg) {
  return chat_pb.ChatResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var ChatServiceService = exports.ChatServiceService = {
  chat: {
    path: '/pb.ChatService/Chat',
    requestStream: false,
    responseStream: false,
    requestType: chat_pb.ChatRequest,
    responseType: chat_pb.ChatResponse,
    requestSerialize: serialize_pb_ChatRequest,
    requestDeserialize: deserialize_pb_ChatRequest,
    responseSerialize: serialize_pb_ChatResponse,
    responseDeserialize: deserialize_pb_ChatResponse,
  },
  chatStream: {
    path: '/pb.ChatService/ChatStream',
    requestStream: false,
    responseStream: true,
    requestType: chat_pb.ChatRequest,
    responseType: chat_pb.ChatResponse,
    requestSerialize: serialize_pb_ChatRequest,
    requestDeserialize: deserialize_pb_ChatRequest,
    responseSerialize: serialize_pb_ChatResponse,
    responseDeserialize: deserialize_pb_ChatResponse,
  },
};

exports.ChatServiceClient = grpc.makeGenericClientConstructor(ChatServiceService);
