const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const nodemailer = require("nodemailer");

const {
  registerInputValidation,
} = require("../middlewares/authInputValidation");
const User = require("../models/User");

router.post("/signup", registerInputValidation, async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userFound = await User.findOne({ email });
    if (userFound) {
      res.status(400).send({ message: "User already exists" });
      return;
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    await User.create({ name, email, password: hash });
    // Send Email
    // let testAccount = await nodemailer.createTestAccount();
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_AUTH_EMAIL,
        pass: process.env.MAIL_AUTH_PASSWORD,
      },
    });
    let info = await transporter.sendMail({
      from: process.env.MAIL_AUTH_EMAIL,
      to: email,
      subject: `Welcome ${name}`,
      text: `Hi ${name},\nThank you for registering in our portal. We heartly welcome to ours family and wish you a very happy experience with us.`,
    });

    res.status(201).json({
      message: "User registered Sucessfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

module.exports = router;
