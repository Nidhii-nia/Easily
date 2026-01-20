import session from "express-session";
import userModel from "../models/user.model.js";

export default class userController {
  getRegister(req, res) {
    res.render("user-register",{error:null});
  }

  postUser(req, res) {
    const { name, email, password } = req.body;
    const userObj = {
      name,
      email,
      password,
    };
    userModel.addUser(userObj);
    res.redirect("/login");
  }

  getLogin(req, res) {
    res.render("user-login", { error: null });
  }

  postLogin(req, res) {
    const { email, password } = req.body;

    const user = userModel.auth(email, password);

    if (user) {
      req.session.user = user;
      return res.redirect("/jobs");
    }

    res.render("user-login", { error: true });
  }

  getLogout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
      } else {
        res.clearCookie("lastVisited");
        res.redirect("/");
      }
    });
  }


  }
