import axios from "axios";
// import { blinking_column, clicked_column } from "./util.js";
import { testGet } from "./tesget.js";

window.addEventListener("load", async (e) => {
  const ws = new WebSocket("ws://127.0.0.1:3000/ws");

  const pageContainer = document.getElementById("page-container");
  const menuContainer = document.getElementById("menu-container");
  const pageColumn = document.querySelector(".col-2");
  const modeColumn = document.querySelector(".col-5");
  const infoElement = document.getElementById("info");

  let blink = "";
  let state = 0;
  let incomingMessage = "";

  const showPageButton = (page, allPages) => {
    if (!pageColumn) {
      pageColumn.style.display = "block";
      modeColumn.classList.remove("col-7");
      modeColumn.classList.add("col-5");
    } else {
      if (allPages === 1) {
        pageColumn.style.display = "none";
        modeColumn.classList.remove("col-5");
        modeColumn.classList.add("col-7");
        return;
      } else if (page === 1) {
        pageContainer.insertAdjacentHTML(
          "beforeend",
          `<a class="btn d-block" id="next" style="width: fit-content; height: fit-content;">
              <div class="" style="width: 10vh; height: 10vh;">
                <img src="../icon/next.png" class="img-responsive icon-content" alt="">
              </div>
          </a>`
        );
        const next = document.getElementById("next");
        next.addEventListener("click", () => {
          updateDisplay(page + 1);
          pageContainer.removeChild(next);
        });
      } else if (page >= 2 && page < allPages) {
        pageContainer.insertAdjacentHTML(
          "beforeend",
          `<a class="btn d-block" id="back" style="width: fit-content; height: fit-content;">
          <div class="" style="width: 10vh; height: 10vh;">
          <img src="../icon/next.png" class="img-responsive icon-content" id="back-icon" alt="">
              </div>
              </a>`
        );
        pageContainer.insertAdjacentHTML(
          "beforeend",
          `<a class="btn d-block" id="next" style="width: fit-content; height: fit-content;">
                    <div class="" style="width: 10vh; height: 10vh;">
                      <img src="../icon/next.png" class="img-responsive icon-content" alt="">
                    </div>
                </a>`
        );
        const next = document.getElementById("next");
        const back = document.getElementById("back");
        next.addEventListener("click", () => {
          updateDisplay(page + 1);
          pageContainer.removeChild(next);
          pageContainer.removeChild(back);
        });
        back.addEventListener("click", () => {
          updateDisplay(page - 1);
          pageContainer.removeChild(next);
          pageContainer.removeChild(back);
        });
      } else {
        pageContainer.insertAdjacentHTML(
          "beforeend",
          `<a class="btn d-block" id="back" style="width: fit-content; height: fit-content;">
              <div class="" style="width: 10vh; height: 10vh;">
                <img src="../icon/next.png" class="img-responsive icon-content" id="back-icon" alt="">
              </div>
          </a>`
        );
        const back = document.getElementById("back");
        back.addEventListener("click", () => {
          updateDisplay(page - 1);
          pageContainer.removeChild(back);
        });
      }
    }
  };

  const deleteRowMenu = () => {
    const rows = document.querySelectorAll(".row-main");
    if (rows === 0) {
      return;
    } else {
      if (rows <= 1) {
        menuContainer.removeChild(rows);
      } else {
        rows.forEach((element) => {
          menuContainer.removeChild(element);
        });
      }
    }
  };

  const parseIcon = (icons) => {
    let data = ``;
    icons.forEach((element) => {
      data += `<div class="icon-container">
                <img src=http://127.0.0.1:3000/${element} class="icon-content">
              </div>`;
    });
    return data;
  };

  const updateDisplay = async (page) => {
    try {
      deleteRowMenu();
      const response = await axios.get(`http://127.0.0.1:3000/page=${page}`);
      const data = response.data["menu"];
      if (data.length === 0) {
        return;
      } else {
        for (let index = 0; index < Math.ceil(data.length / 3); index++) {
          createRowMenu(data.slice(index * 3, 3 * (index + 1)), index * 3 + 1);
        }
        showPageButton(page, response.data["pages"]);
        addClickEvent();
      }
    } catch (error) {
      console.log("ERROR: ", error);
    }
  };

  const createRowMenu = (menus, start_index) => {
    const newRow = document.createElement("div");
    newRow.classList.add("row", "mx-auto", "row-main");

    menuContainer.appendChild(newRow);

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
                  ${parseIcon(element.icon_path)}
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

  const addClickEvent = () => {
    const allColumn = document.querySelectorAll(".col-4");
    allColumn.forEach((element) => {
      element.addEventListener("click", () => {
        if (!state) {
          // infoElement.style.display = "block";
          // setTimeout(() => {
          //   infoElement.style.display = "none";
          // }, 5000);
          // blink = blinking_column(element);
        } else {
          // clicked_column(element, blink);
        }
        state = !state;
      });
    });
  };

  ws.addEventListener("open", async (e) => {
    try {
      testGet();
      // const response = await axios.get("http://127.0.0.1:3000/page=1");
      // const data = response.data["menu"];
      // for (let index = 0; index < Math.ceil(data.length / 3); index++) {
      //   createRowMenu(data.slice(index * 3, 3 * (index + 1)), index * 3 + 1);
      // }
      // console.log(document.querySelectorAll(".clicked-container"));
      // showPageButton(1, response.data["pages"]);
      // addClickEvent();
    } catch (error) {
      alert("connection failed");
      console.log(error);
    }
  });

  ws.addEventListener("message", (e) => {
    incomingMessage = e.data;
  });

  ws.addEventListener("error", (e) => {
    alert("Connection Error");
  });

  ws.addEventListener("close", (e) => {
    alert("Connection Error");
  });
});
