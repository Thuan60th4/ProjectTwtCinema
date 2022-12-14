const User = require("../models/user");
const bcrypt = require("bcrypt");

class AuthController {
  async register(req, res) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(req.body.password, salt);
      req.body.password = hashPassword;
      const user = new User(req.body);
      await user.save();
      console.log(user._id);
      res.status(200).json({
        success: true,
        message: "Đăng ký tài khoản thành công",
        data: {
          id: user._id,
          email: req.body.email,
          name: req.body.name,
          avatar: req.body.avatar,
        },
      });
    } catch (error) {
      res.status(200).json({
        success: false,
        error,
        message: "Tài khoản này đã được đăng kí trên hệ thống",
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email: email });
      if (user) {
        const validiti = await bcrypt.compare(password, user.password);
        if (validiti) {
          res.status(200).json({
            success: true,
            message: "Đăng nhập thành công",
            data: {
              id: user._id,
              email: user.email,
              name: user.name,
              avatar: user.avatar,
            },
          });
        } else {
          res.status(200).json({
            success: false,
            message: "Tài khoản hoặc mật khẩu không hợp lệ",
          });
        }
      } else {
        res.status(200).json({
          success: false,
          message: "Email chưa được đăng kí trên hệ thống",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new AuthController();
