export const blinking_column = (col_n) => {
  let warning_div = col_n.querySelector(".warning");

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

export const stop_blinking_column = (col_n, blinkId) => {
  let warning_div = col_n.querySelector(".warning");
  warning_div.style.display = "none";
  clearInterval(blinkId);
  warning_div.style.opacity = "0%";
};

export const clicked_column = async (col_n, blink, text) => {
  let modeText = document.querySelector("#mode");
  let warning_div = col_n.querySelector(".warning");

  warning_div.style.display = "none";
  warning_div.style.opacity = "0%";
  clearInterval(blink);

  return await new Promise((resolve, reject) => {
    let timesRun = 0;
    let index = 95;
    let data = 0;

    const interval = setInterval(() => {
      if (timesRun > 1) {
        clearInterval(interval);
        setTimeout(() => {
          col_n.style.transform = `scale(${1}, ${1})`;
          modeText.textContent = text;
          setTimeout(() => {
            resolve(true);
          }, 500);
        }, 750);
      }
      data = index / 100;
      col_n.style.transform = `scale(${data}, ${data})`;
      index -= 5;
      timesRun++;
    }, 100);
  });
  return interval;
};
