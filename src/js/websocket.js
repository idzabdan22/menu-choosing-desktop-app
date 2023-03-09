window.addEventListener("load", (e) => {
  try {
    const ws = new WebSocket("ws://127.0.0.1:3000/ws");
    console.log(ws);
    let incomingMessage = "";
    if (ws.readyState === 1) {
      ws.addEventListener("open", () => {});

      ws.addEventListener("error", () => {
        alert("Connection Error");
      });

      ws.addEventListener("close", () => {
        alert("Connection Closed");
      });

      ws.addEventListener("message", (event) => {
        incomingMessage = event.data;
      });
    } else {
      alert("Cannot found server adress");
    }
  } catch (error) {
    console.log(error);
  }
});
