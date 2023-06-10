const express = require("express");
require("dotenv").config();
const { connection } = require("./db");
const { userRouter } = require("./routes/User.route");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());
app.use("/users", userRouter);

app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log("connected to the db");
  } catch (error) {
    console.log(error);
    console.log("failed to connect");
  }
  console.log("server is running on port 8080");
});
// all done
