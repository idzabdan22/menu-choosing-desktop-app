

window.addEventListener("load", (e) => {
  const blinking_column = (col_n) => {
    // Create new warning div
    let warning_div = document.createElement("div");
    warning_div.classList.add("warning");

    // add warning to selected column and select the warning div
    col_n.prepend(warning_div);
    warning = document.querySelector(".warning");

    let op = 0;

    blinking = setInterval(() => {
      if (op >= 100) {
        op = 0;
      }
      warning.style.opacity = `${op}%`;
      op += 5;
    }, 75);
  };

  const clicked_column = (col_n) => {
    col_n.removeChild(col_n.firstElementChild);
    let timesRun = 0;
    let index = 95;
    let data = 0;
    const interval = setInterval(() => {
      if (timesRun > 1) {
        clearInterval(interval);
        setTimeout(() => {
          col_n.style.transform = `scale(${1}, ${1})`;
          const mode_index = Object.keys(numberToColumn).find((index) => {
            return numberToColumn[Number(index)] === col_n;
          });
          mode.textContent = `${modes[mode_index - 1]}`;
        }, 750);
      }
      data = index / 100;
      col_n.style.transform = `scale(${data}, ${data})`;
      index -= 5;
      timesRun++;
    }, 100);
  };

  const addClickEvent = () => {
    const allColumn = document.querySelectorAll(".col-main");
    allColumn.forEach((element) => {
      console.log(element);
      element.addEventListener("click", () => {
        alert("CLICKED");
      });
    });
  };

  try {
    const ws = new WebSocket("ws://127.0.0.1:3000/ws");
    console.log(ws);
    addClickEvent();
    // let incoming_message = "";
    // if (ws.readyState === 1) {
    //   ws.addEventListener("open", () => {});

    //   ws.addEventListener("error", () => {
    //     alert("Connection Error");
    //   });

    //   ws.addEventListener("close", () => {
    //     alert("Connection Closed");
    //   });

    //   ws.addEventListener("message", (event) => {
    //     const allColumn = document.querySelectorAll(".col-main");

    //     // const col_1 = allColumn[0];
    //     // const col_2 = allColumn[1];
    //     // const col_3 = allColumn[2];
    //     // const col_4 = allColumn[3];
    //     // const col_5 = allColumn[4];
    //     // const col_6 = allColumn[5];

    //     incoming_message = event.data;
    //     if (Number(incoming_message) && Number(incoming_message) !== state) {
    //       // if a number coming
    //       blinking_column(allColumn[Number(incoming_message) - 1]);
    //       state = Number(incoming_message);
    //     } else {
    //       // if not a number coming
    //       switch (key) {
    //         case "Yes":
    //           if (state !== null) {
    //             clicked_column(allColumn[state - 1]);
    //             ws.send(`r${state}`);
    //           }
    //           break;
    //         case "No":
    //           if (state !== null) {
    //             // clicked_column(numberToColumn[state]);
    //             ws.send(`s${state}`);
    //           }
    //           break;
    //         case "On":
    //           if (state !== null) {
    //             // clicked_column(numberToColumn[state]);
    //             // ws.send("r1");
    //           }
    //           break;
    //         case "Off":
    //           if (state !== null) {
    //             // clicked_column(numberToColumn[state]);
    //             // ws.send("r1");
    //           }
    //           break;
    //         case "Info":
    //           if (state !== null) {
    //             // clicked_column(numberToColumn[state]);
    //             // ws.send("r1");
    //           }
    //           break;
    //         default:
    //           break;
    //       }
    //     }
    //   });
    // } else {
    //   alert("Cannot found server adress");
    // }
  } catch (error) {
    console.log(error);
  }
});
