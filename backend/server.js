const express = require("express");
const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Hello Jaswanth :)");
});

app.listen(PORT, () => {
  console.error(`Server is runningat ${PORT}`);
});
