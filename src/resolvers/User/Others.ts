import { inputObjectType, scalarType } from "nexus";

export const ChannelInfoWhereUniqueInput = inputObjectType({
  name: "ChannelInfoWhereUniqueInput",
  definition(t) {
    t.string("id")
    t.string("uniqueUserChannelPair")
  }
});
export const FileWhereUniqueInput = inputObjectType({
  name: "FileWhereUniqueInput",
  definition(t) {
    t.string("id")
    t.string("Key")
  }
});
export const NotificationWhereUniqueInput = inputObjectType({
  name: "NotificationWhereUniqueInput",
  definition(t) {
    t.string("id")
  }
});
export const ReplyMessageWhereUniqueInput = inputObjectType({
  name: "ReplyMessageWhereUniqueInput",
  definition(t) {
    t.string("id")
  }
});
export const UserWhereUniqueInput = inputObjectType({
  name: "UserWhereUniqueInput",
  definition(t) {
    t.string("email")
    t.string("id")
    t.string("username")
  }
});

export const DateTime = scalarType({
  name: "DateTime",
  serialize() { /* Todo */ },
  parseValue() { /* Todo */ },
  parseLiteral() { /* Todo */ }
});
export const Upload = scalarType({
  name: "Upload",
  description: 'The `Upload` scalar type represents a file upload.',
  serialize() { /* Todo */ },
  parseValue() { /* Todo */ },
  parseLiteral() { /* Todo */ }
});
