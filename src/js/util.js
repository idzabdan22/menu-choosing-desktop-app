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
});
