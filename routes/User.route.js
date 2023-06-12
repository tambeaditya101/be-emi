const express = require("express");
const userRouter = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { UserModel } = require("../models/User.model");

userRouter.get("/", async (req, res) => {
  const data = await UserModel.find();
  res.status(200).send(data);
});

userRouter.post("/register", async (req, res) => {
  const { email, pass, name } = req.body;
  try {
    bcrypt.hash(pass, 5, async (err, hash) => {
      const userdata = new UserModel({ email, pass: hash, name });
      await userdata.save();
      res.status(200).send({ msg: "New user added" });
    });
  } catch (error) {
    res.status(400).send({ err: error.message });
  }
});
userRouter.post("/login", async (req, res) => {
  const { email, pass } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      bcrypt.compare(pass, user.pass, function (err, result) {
        // result == true
        if (result) {
          const token = jwt.sign({ authorID: user._id }, "masai");
          res.status(200).send({ msg: "Login sucees", token: token });
        } else {
          res.status(200).send({ msg: "wrong credintials " });
        }
      });
    } else {
      res.status(200).send({ msg: "wrong credintials " });
    }
  } catch (error) {
    res.status(400).send({ err: error.message });
  }
});

userRouter.get("/profile", async (req, res) => {
  const token = req.headers.authorization;
  //console.log(token);
  if (token) {
    try {
      const decoded = jwt.verify(token, "masai");
      if (decoded) {
        const data = await UserModel.findOne({ _id: decoded.authorID });
        res.status(200).send(data);
      }
    } catch (error) {
      console.log(error);
      res.status(400).send({ err: error.message });
    }
  } else {
    res.send({ msg: "Please check" });
  }
});

userRouter.post("/emi-calculator", async (req, res) => {
  //console.log(req.body);
  let { loan, annual, tenure } = req.body;
  try {
    let p = loan;
    let r = +(annual / 12 / 100).toFixed(6);
    let n = tenure;
    const EMI = (p * r * (1 + r) * n) / ((1 + r) * n - 1);
    const interest = EMI * n - p;
    console.log(p, r, n, EMI);
    res.status(200).send({ total: EMI * n, EMI, interest });
  } catch (error) {
    res.status(400).send({ err: error.message });
  }
});
module.exports = {
  userRouter,
};
