"use strict";

import axios from "axios";

const DOMHandler = function () {
  this.pageContainer = document.getElementById("page-container");
  this.footerContainer = document.querySelector("#footer-container");
  this.menuContainer = document.getElementById("menu-container");
  this.infoContainer = document.getElementById("info-layer");
  this.cameraContainer = document.getElementById("camera-layer");
  this.footerOverlayHome = document.getElementById("footer-overlay-home");
  this.footerOverlayInMenu = document.getElementById("footer-overlay-in-menu");
  this.dimLayer = document.querySelector(".dim");
  this.url = "http://127.0.0.1:3001";
  this.timerCountDown = 10000;
};

DOMHandler.prototype.createDisplay = async function (page) {
  try {
    this.deleteRowMenu();
    this.deletePageButton();
    const response = await axios.get(`${this.url}/page=${page}`);
    const data = response.data["menu"];
    const allPages = response.data["pages"];
    for (let index = 0; index < Math.ceil(data.length / 3); index++) {
      this.createRowMenu(data.slice(index * 3, 3 * (index + 1)), index * 3 + 1);
    }
    this.showPageButton(page, allPages);
    return {
      data: data,
      allPages: allPages,
    };
  } catch (error) {
    console.log(error);
  }
};

DOMHandler.prototype.dimScreen = function () {
  this.dimLayer.style.opacity = "75%";
};

DOMHandler.prototype.undimScreen = function () {
  this.dimLayer.style.opacity = "0%";
};

DOMHandler.prototype.deleteRowMenu = function () {
  const rows = document.querySelectorAll(".row-main");
  if (!(rows.length > 0)) {
    return;
  } else {
    rows.forEach((element) => {
      this.menuContainer.removeChild(element);
    });
  }
};

DOMHandler.prototype.showPageButton = function (page, allPages) {
  if (allPages === 1) {
    return;
  } else {
    if (page === 1) {
      this.pageContainer.insertAdjacentHTML(
        "beforeend",
        `<a class="btn d-block">
              <div class="page-fc">
                <img src="../resource/icon/next.png" class="icon-content">
              </div>
          </a>`
      );
    } else if (page >= 2 && page < allPages) {
      this.pageContainer.insertAdjacentHTML(
        "beforeend",
        `<a class="btn d-block">
              <div class="page-fc">
                <img src="../resource/icon/next.png" class="icon-content" id="back-icon">
              </div>
          </a>`
      );
      this.pageContainer.insertAdjacentHTML(
        "beforeend",
        `<a class="btn d-block">
              <div class="page-fc">
                <img src="../resource/icon/next.png" class="icon-content">
              </div>
          </a>`
      );
    } else {
      this.pageContainer.insertAdjacentHTML(
        "beforeend",
        `<a class="btn d-block">
              <div class="page-fc">
                <img src="../resource/icon/next.png" class="icon-content" id="back-icon">
              </div>
          </a>`
      );
    }
  }
};

DOMHandler.prototype.parseIcon = function (icons) {
  let data = ``;
  icons.forEach((element) => {
    data += `<div class="icon-container">
                <img src=${this.url}/${element} class="icon-content">
              </div>`;
  });
  return data;
};

DOMHandler.prototype.createRowMenu = function (menus, start_index) {
  const newRow = document.createElement("div");
  newRow.classList.add("row", "mx-auto", "row-main");

  this.menuContainer.appendChild(newRow);

  let counter = start_index;
  menus.forEach((element) => {
    newRow.insertAdjacentHTML(
      "beforeend",
      `<div class="col-4 g-0" id="menu-content-container">
          <div class="clicked-container">
            <div class="warning"></div>
            <div class="main-content">
              <div class="content-card d-flex flex-column justify-content-between align-items-start">
                <div class="number-card-container d-flex">
                  <p class="number">${counter}</p>
                </div>
                <div class="icon-card-container d-flex justify-content-center align-items-end">
                  ${this.parseIcon(element.icon_path)}
                </div>
                <div class="d-flex justify-content-center caption-card-container">
                  <div class="caption-container">       
                    <p class="caption">${element.name}</p> 
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>`
    );
    counter++;
  });
};

DOMHandler.prototype.deletePageButton = function () {
  let btnAmount = this.pageContainer.querySelectorAll(".btn");
  if (!(btnAmount.length > 0)) {
    return;
  } else {
    btnAmount.forEach((btn) => {
      this.pageContainer.removeChild(btn);
    });
  }
};

DOMHandler.prototype.setVideoFrame = function (frame_count) {
  if (frame_count < 2) {
    // set one video frame
    const rearCamera = document.getElementById("cam-1");
    rearCamera.style.display = "none";
  } else {
    const rearCamera = document.getElementById("cam-1");
    const frontCamera = document.getElementById("cam-2");
    const allCamera = document.querySelectorAll("video");
    allCamera.forEach((camera) => {
      camera.srcObject = null;
    });
    rearCamera.style.display = "block";
    frontCamera.style.display = "block";
  }
};

DOMHandler.prototype.switchLayer = async function (layer) {
  if (layer === "info") {
    this.infoContainer.style.opacity = "100%";
    this.cameraContainer.style.opacity = "0%";
    const infoShowCnt = document.querySelector(".info-show-countdown");
    infoShowCnt.textContent = this.timerCountDown / 1000;
    let cnt = this.timerCountDown - 1000;
    return await new Promise((resolve, reject) => {
      const timerCountDown = setInterval(() => {
        if (cnt < 1000) {
          clearInterval(timerCountDown);
          this.switchLayer("home");
          resolve(true);
        }
        infoShowCnt.textContent = cnt / 1000;
        cnt -= 1000;
      }, 1000);
    });
  } else if (layer === "camera") {
    this.infoContainer.style.opacity = "0%";
    this.cameraContainer.style.opacity = "100%";
    this.footerOverlayHome.style.opacity = "0%";
    this.footerOverlayInMenu.style.opacity = "100%";
    return true;
  } else {
    this.infoContainer.style.opacity = "0%";
    this.cameraContainer.style.opacity = "0%";
    this.footerOverlayHome.style.opacity = "100%";
    this.footerOverlayInMenu.style.opacity = "0%";
    return true;
  }
};

DOMHandler.prototype.requestStream = function (window_count, flag) {
  try {
    window.EAPI.getStream(window_count, flag);
    const loading = document.querySelectorAll(".loading");
    loading.forEach((element) => {
      element.style.opacity = "100%";
    });
  } catch (error) {
    console.log("FAILED", error);
  }
};

DOMHandler.prototype.closeStream = function () {
  window.EAPI.triggerCloseStream();
  const modeText = document.querySelector("#mode");
  modeText.textContent = "N/A";
};

export default DOMHandler;
