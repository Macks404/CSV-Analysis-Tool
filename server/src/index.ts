import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.json({ message: "API running" });
});

app.listen(3000, () => {
  console.log("Server started");
});
