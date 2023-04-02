"use strict";

import DOMHandler from "./domHandler";
import axios from "axios";

import {
  blinking_column,
  clicked_column,
  stop_blinking_column,
} from "./util.js";

const MessageHandler = function (websocket) {
  this.domHandler = new DOMHandler();
  this.chosenState = 1; //change to 0
  this.chosenColumn = 0;
  this.websocket = websocket;
  this.blinking = false;
  this.currentPage = 1;
  this.menuData = "";
  this.allPages = 0;
  this.isReceiveCommand = true;
  this.url = "http://127.0.0.1:3001";
};

MessageHandler.prototype.init = async function () {
  try {
    this.getAllColumn(data["data"]);
  } catch (error) {
    console.log(error);
  }
};

MessageHandler.prototype.commandHandler = async function (message) {
  switch (message) {
    case "Ya":
      if (this.chosenState !== 0) {
        try {
          // await clicked_column(
          //   this.chosenColumn,
          //   this.blinking,
          //   this.menuData[this.chosenState - 1].name
          // );
          let cmd_id = this.menuData[this.chosenState - 1].id;
          await axios.post(`${this.url}/command=${cmd_id}`);
          // this.chosenState = 0; // uncomment
          await this.domHandler.switchLayer("camera");
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
      this.isReceiveCommand = false;
      break;
    case "Nyala":
      this.isReceiveCommand = true;
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
        await axios.post(`${this.url}/command=0`);
        await this.domHandler.switchLayer("home");
        this.domHandler.closeStream();
      } catch (error) {}
      break;
    case "Info":
      try {
        this.isReceiveCommand = false;
        this.isReceiveCommand = await this.domHandler.switchLayer("info");
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
  if (!this.isReceiveCommand && message !== "Nyala") {
    return;
  } else {
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
  }
};

export default MessageHandler;
