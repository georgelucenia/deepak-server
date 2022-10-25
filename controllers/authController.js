const User = require("../models/userModel");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
  try {
    const userData = { ...req.body };
    const salt = await bcrypt.genSalt(10);
    userData.username = userData?.username?.toLowerCase();
    userData.password = await bcrypt.hash(userData.password, salt);

    await User.create(userData);

    res.status(201).json({
      status: "success",
      data: "User registered successfully",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({
      username: username.toLowerCase(),
    });
    if (user) {
      const validPassword = await bcrypt.compare(password, user.password);
      if (validPassword) {
        res
          .status(200)
          .json({ status: "success", message: "Login successful." });
      } else {
        res.status(400).json({ status: "fail", message: "Invalid Password" });
      }
    } else {
      res.status(401).json({ status: "fail", message: "User not found" });
    }
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
