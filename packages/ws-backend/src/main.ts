import {WebSocketServer} from "ws";

function getChannelIdFromPath(pathname: string): string | undefined {
    const pathRe = /^\/channel\/([A-Za-z0-9-]+)$/.exec(pathname);
    if (pathRe) {
        return pathRe[1];
    }

    return undefined;
}

const wss = new WebSocketServer({port: 45856});

wss.on("connection", function connection(ws) {
    const {pathname} = new URL(ws.url, "wss://ws.dice.sh");
    const channelId = getChannelIdFromPath(pathname);

    ws.on("error", console.error);

    ws.on("message", function message(data) {
        console.log("Got message", data);
    });

    ws.send(`Joined ${channelId}`);
    console.log("Joined", channelId);
});
