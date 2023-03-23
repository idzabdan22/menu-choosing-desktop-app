"use strict";

import MessageHandler from "./messageHandler";

window.addEventListener("load", async (e) => {
  const ws = new WebSocket("ws://127.0.0.1:3000");
  const msgHandler = new MessageHandler(ws);

  const command = async (cmd, msgHandler, ms) => {
    await new Promise((resolve) =>
      setTimeout(() => {
        msgHandler.receiveMessage(cmd);
        resolve();
      }, ms)
    );
    return true;
  };

  const testCases = async (msgHandler) => {
    // await command("1", msgHandler, 3000);
    // await command("Ya", msgHandler, 3000);
    // await command("Keluar", msgHandler, 30000);
    // await command("Next", msgHandler, 3000);
    // await command("Back", msgHandler, 3000);
    // await command("1", msgHandler, 3000);
    // await command("Ya", msgHandler, 3000);
    // await command("Keluar", msgHandler, 30000);
    // await command("Info", msgHandler, 3000);
    // await command("Back", msgHandler);
  };

  ws.addEventListener("open", async (e) => {
    try {
      await msgHandler.init();
      // testCases(msgHandler);
    } catch (error) {
      alert("connection failed");
      console.log(error);
    }
  });

  ws.addEventListener("message", (event) => {
    let incomingMessage = event.data;
    msgHandler.receiveMessage(incomingMessage);
  });

  ws.addEventListener("error", (e) => {
    alert("Connection Error");
  });

  ws.addEventListener("close", (e) => {
    alert("Connection Closed");
  });
});
