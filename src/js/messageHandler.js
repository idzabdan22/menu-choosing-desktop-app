"use strict";

import DOMHandler from "./domHandler";

import {
  blinking_column,
  clicked_column,
  stop_blinking_column,
} from "./util.js";

const MessageHandler = function (websocket) {
  this.domHandler = new DOMHandler();
  this.chosenState = 0;
  this.chosenColumn = 0;
  this.websocket = websocket;
  this.blinking = false;
  this.currentPage = 1;
  this.menuData = "";
  this.allPages = 0;
};

MessageHandler.prototype.init = async function () {
  const data = await this.domHandler.createDisplay(1);
  this.allPages = data["allPages"];
  this.getAllColumn(data["data"]);
};

MessageHandler.prototype.commandHandler = async function (message) {
  switch (message) {
    case "Ya":
      if (this.chosenState !== 0) {
        try {
          await clicked_column(
            this.chosenColumn,
            this.blinking,
            this.menuData[this.chosenState - 1].name
          );
          let cmd_id = this.menuData[this.chosenState - 1].id;
          this.websocket.send(`${cmd_id}`);
          this.chosenState = 0;
          this.domHandler.switchLayer("camera");
          this.domHandler.requestStream();
        } catch (error) {
          console.log("error when sending data to websocket");
          console.log(error);
        }
      }
      break;
    case "Tidak":
      if (this.chosenState !== 0) {
        stop_blinking_column(this.chosenColumn, this.blinking);
        this.chosenState = 0;
      }
      break;
    case "Mati":
      break;
    case "Nyala":
      break;
    case "Next":
      // update page + 1
      if (this.currentPage + 1 > this.allPages) {
        return;
      } else {
        let data = await this.domHandler.createDisplay(this.currentPage + 1);
        this.getAllColumn(data["data"]);
        this.currentPage++;
      }
      break;
    case "Back":
      // update page - 1
      if (this.currentPage - 1 < 1) {
        return;
      } else {
        let data = await this.domHandler.createDisplay(this.currentPage - 1);
        this.getAllColumn(data["data"]);
        this.currentPage--;
      }
      break;
    case "Keluar":
      try {
        this.websocket.send("0");
        this.domHandler.switchLayer("home");
      } catch (error) {}
      break;
    case "Info":
      try {
        this.domHandler.switchLayer("info");
      } catch (error) {}
      break;
    default:
      break;
  }
};

MessageHandler.prototype.getAllColumn = function (menuData) {
  this.allColumn = document.querySelectorAll(".clicked-container");
  this.menuData = menuData;
};

MessageHandler.prototype.receiveMessage = function (message) {
  let isNumber = Number(message) ? true : false;
  if (isNumber) {
    this.chosenColumn = this.allColumn[Number(message) - 1];
    if (this.chosenState !== Number(message)) {
      // changing state and changing display to blinking in column
      stop_blinking_column(this.chosenColumn, this.blinking);
      this.blinking = blinking_column(this.chosenColumn);
      this.chosenState = Number(message);
    } else return;
  } else {
    this.commandHandler(message);
  }
};

export default MessageHandler;
