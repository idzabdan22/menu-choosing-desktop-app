export const blinking_column = (col_n) => {
  // Create new warning div
  let warning_div = col_n.querySelector(".warning");
  // warning_div.classList.add("warning");

  // add warning to selected column and select the warning div
  // col_n.prepend(warning_div);
  warning_div.style.display = "block";

  let op = 0;

  let blinking = setInterval(() => {
    if (op >= 100) {
      op = 0;
    }
    warning_div.style.opacity = `${op}%`;
    op += 5;
  }, 75);

  return blinking;
};

export const clicked_column = (col_n, blink) => {
  let warning_div = col_n.querySelector(".warning");
  warning_div.style.display = "none";
  clearInterval(blink)
  warning_div.style.opacity = "0%";
  let timesRun = 0;
  let index = 95;
  let data = 0;
  const interval = setInterval(() => {
    if (timesRun > 1) {
      clearInterval(interval);
      setTimeout(() => {
        col_n.querySelector(
          ".clicked-container"
        ).style.transform = `scale(${1}, ${1})`;
        const mode_index = Object.keys(numberToColumn).find((index) => {
          return numberToColumn[Number(index)] === col_n;
        });
        mode.textContent = `${modes[mode_index - 1]}`;
      }, 750);
    }
    data = index / 100;
    col_n.querySelector(
      ".clicked-container"
    ).style.transform = `scale(${data}, ${data})`;
    index -= 5;
    timesRun++;
  }, 100);
};
