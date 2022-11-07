import { objectType, stringArg } from "nexus";

export const TypingStatus = objectType({
  name: "TypingStatus",
  definition(t) {
    t.field("username", { type: "String" });
    t.field("isTyping", { type: "Boolean" });
  }
});
