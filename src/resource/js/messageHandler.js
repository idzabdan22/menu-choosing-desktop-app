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
  this.chosenState = 0;
  this.chosenColumn = 0;
  this.websocket = websocket;
  this.blinking = false;
  this.currentPage = 1;
  this.menuData = "";
  this.allPages = 0;
  this.isReceiveCommand = true;
  this.url = "http://127.0.0.1:3001";
  this.allColumn = "";
  this.blink_column_exist = false;
  this.layerState = "menu";
};

MessageHandler.prototype.stateManagement = function (layerState, command) {
  // menu layer:
  // possible command: 1-6, mati, nyala, info, next, back, oke, tidak
  // info layer:
  // possible command: none
  // camera layer:
  // possible command: keluar
  try {
    let possibleCommand = [];
    switch (layerState) {
      case "menu":
        possibleCommand = [
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "mati",
          "info",
          "next",
          "back",
          "oke",
          "tidak",
        ];
        return possibleCommand.includes(command);
        break;
      case "info":
        possibleCommand = [];
        return possibleCommand.includes(command);
        break;
      case "mati":
        possibleCommand = ["nyala"];
        return possibleCommand.includes(command);
        break;
      case "camera":
        possibleCommand = ["keluar"];
        return possibleCommand.includes(command);
        break;
      default:
        break;
    }
  } catch (error) {}
};

MessageHandler.prototype.init = async function () {
  try {
    const data = await this.domHandler.createDisplay(1);
    this.allPages = data["allPages"];
    this.getAllColumn(data["data"]);
  } catch (error) {
    console.log(error);
  }
};

MessageHandler.prototype.commandHandler = async function (message) {
  switch (message) {
    case "oke":
      if (this.chosenState !== 0) {
        try {
          await clicked_column(
            this.chosenColumn,
            this.blinking,
            this.menuData[this.chosenState - 1].name
          );
          let cmd_id = this.menuData[this.chosenState - 1].id;
          this.layerState = "camera";
          await axios.post(`${this.url}/command=${cmd_id}`);
          this.domHandler.setVideoFrame(
            this.menuData[this.chosenState - 1].window_count,
            this.menuData[this.chosenState - 1].flag
          );
          await this.domHandler.switchLayer("camera");
          this.domHandler.requestStream(
            this.menuData[this.chosenState - 1].window_count,
            this.menuData[this.chosenState - 1].flag
          );
          this.chosenState = 0;
        } catch (error) {
          console.log("error when sending data to websocket");
          console.log(error);
        }
      } else return;
      break;
    case "tidak":
      if (this.chosenState !== 0) {
        stop_blinking_column(this.chosenColumn, this.blinking);
        this.chosenState = 0;
      } else return;
      break;
    case "mati":
      this.layerState = "mati";
      this.domHandler.dimScreen();
      break;
    case "nyala":
      this.layerState = "menu";
      this.domHandler.undimScreen();
      break;
    case "next":
      // update page + 1
      if (this.currentPage + 1 > this.allPages) {
        return;
      } else {
        let data = await this.domHandler.createDisplay(this.currentPage + 1);
        this.getAllColumn(data["data"]);
        this.currentPage++;
      }
      break;
    case "back":
      // update page - 1
      if (this.currentPage - 1 < 1) {
        return;
      } else {
        let data = await this.domHandler.createDisplay(this.currentPage - 1);
        this.getAllColumn(data["data"]);
        this.currentPage--;
      }
      break;
    case "keluar":
      try {
        await axios.post(`${this.url}/command=0`);
        await this.domHandler.switchLayer("home");
        this.domHandler.closeStream();
        this.layerState = "menu";
      } catch (error) {
        console.log("error in camera layer");
      }
      break;
    case "info":
      try {
        this.layerState = "info";
        await this.domHandler.switchLayer("info");
        this.layerState = "menu";
      } catch (error) {
        console.log("error in info layer");
      }
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
  try {
    if (this.stateManagement(this.layerState, message)) {
      let isNumber = Number(message) ? true : false;
      if (isNumber) {
        if (Number(message) <= this.allColumn.length) {
          if (this.blink_column_exist) {
            stop_blinking_column(this.chosenColumn, this.blinking);
          }
          this.chosenColumn = this.allColumn[Number(message) - 1];
          this.blinking = blinking_column(this.chosenColumn);
          this.chosenState = Number(message);
          this.blink_column_exist = true;
        } else return;
      } else {
        this.commandHandler(message);
      }
    } else return;
  } catch (error) {
    console.log("column out of range");
    return;
  }
};

export default MessageHandler;
