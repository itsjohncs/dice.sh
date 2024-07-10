# Requirements

Requirements are very simple for now:

-   Users are completely unauthenticated.
-   Users can:
    -   join a channel and get events from them when connected.
    -   set their display name.
    -   see the history of log messages.
    -   send new rolls into the channel.
-   Some clients are the CLI, so outdated clients need to be considered up front.

Things I'll probably want eventually that may inform some choices:

-   Rate limiting
-   Private rolls sent only to some user(s).
-   Editing message.
-   Non-roll messages.
-   User accounts
-   Pagination of log messages

# High-Level Flow

This is informal, but I use some more formal MAY/SHOULD/etc language here and there.

1. Client connects to `/v1/channel/<channelId>`.
    - Channel ID doesn't need to be in the URL, since we'll be using an initialization message anyways. But I like the idea of being able to see channels easily in default-configured network tools and logs.
    - MAY send back a "outdated client error" and client SHOULD prompt user to upgrade. Server MAY disconnect.
2. Client sends initialization message containing: user name, client code version, id of last seen log.
    - "User name taken error" MAY be sent back. Server SHOULD NOT disconnect.
    - MAY send back an "outdated client error" and client SHOULD prompt user to upgrade. Server MAY disconnect.
    - Editing messages in the future can be implemented as a new log entry that overwrites the old one on the client.
3. Server sends acknowledgement message.
4. The connection is now established and the server will send down log messages as they come in and the client can send up log messages.
    - Server will send any historical log messages the user hasn't seen right away, in order.

# Heartbeat

Client will send an in-channel heartbeat message each minute. The server MUST not respond with a pong. The server SHOULD disconnect clients that haven't sent a heartbeat within 2 minutes.

# Implementation Details

I think Socket.io is a good choice for this. It will give me a good Request/Response flow out of the gate, as well as do the routing for me.

There's not a good Go client for Socket.io which is the only problem. The SSH server I want/need to use is going to force me to make a Go interface. But it's probably better that I keep the CLI code in one place, and have that Go interface communicate with a node process to get the text it should display.

# Alternative Designs

An alternative is to do much more of this in the web server itself, and maybe only have the push service send down "X new messages". Could even use an external service instead. It's hard to know for sure, but my hunch is that the code won't end up being simpler going that route, and it doesn't have too many advantages I think.
