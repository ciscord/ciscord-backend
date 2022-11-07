import { objectType } from "nexus";

export const User = objectType({
  name: "User",
  definition(t) {
    t.model.id();
    t.model.fullname();
    t.model.username();
    t.model.bio();
    t.model.email();
    t.model.password();
    t.model.social();
    t.model.image();
    t.model.isOnline();
    t.model.communitiesOwned({ pagination: false });
    t.model.communitiesFollowed({ pagination: false });
    t.model.currentChannel();
    t.model.channelsInfo({ pagination: false });
    t.model.messages({ pagination: false });
    t.model.files({ pagination: false });
    t.model.reactions({ pagination: false });
    t.model.role({ pagination: false });
    t.model.owner();
    t.model.replyMessages();
    t.model.notificationsSend();
    t.model.notificationsReceived();
  }
});
