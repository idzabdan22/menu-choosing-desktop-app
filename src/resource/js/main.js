"use strict";

import MessageHandler from "./messageHandler";

window.addEventListener("load", async (e) => {
  const ws = new WebSocket("ws://127.0.0.1:3000");
  const msgHandler = new MessageHandler(ws);

  ws.addEventListener("open", async (e) => {
    try {
      await msgHandler.init();
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
