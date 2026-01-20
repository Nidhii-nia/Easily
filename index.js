import express from "express";
import path from "path";
import jobController from "./controllers/job.controller.js";
import expressEjsLayouts from "express-ejs-layouts";
import session from "express-session";
import cookieParser from "cookie-parser";
import userController from "./controllers/user.controller.js";
import { setLastVisited } from "./middlewares/setLastVisited.middleware.js";
import { uploadFile } from "./middlewares/file_upload.middleware.js";
import { auth } from "./middlewares/auth.middleware.js";
import {
  validateApplyForJob,
  validateNewJob,
  validateUpdateJob,
} from "./middlewares/validation.middleware.js";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser());

app.use(
  session({
    secret: "yourSecret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  }),
);

app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

app.set("view engine", "ejs");
app.set("views", path.join(path.resolve(), "views"));
app.use(expressEjsLayouts);
app.use(express.static(path.join(path.resolve(), "public")));

const job = new jobController();
const user = new userController();

app.get("/", setLastVisited, job.getWelcomePage);
app.get("/jobs", job.getJobs);
app.get("/job/:id", job.getJob);
app.get("/register", user.getRegister);
app.post("/register", user.postUser);
app.get("/login", user.getLogin);
app.post("/login", user.postLogin);
app.get("/logout", user.getLogout);
app.get("/postjob", auth, job.getNewJob);
app.post(
  "/job",
  auth,
  uploadFile.single("logo"),
  validateNewJob,
  job.postNewJob,
);
app.get("/job/update/:id", auth, job.getUpdateJob);
app.post(
  "/job/update/:id",
  auth,
  uploadFile.single("logo"),
  validateUpdateJob,
  job.postUpdateJob,
);
app.post("/job/delete/:id", auth, job.postDelete);
app.get("/job/:id/apply", job.getApplyJob);
app.post("/job/:id/apply", uploadFile.single("resume"),validateApplyForJob, job.postJobApply);
app.get("/job/:id/all-applicants", auth, job.getAllApplicants);
app.get("/search",job.getSearchPage);

app.listen(3500);
console.log("App is listening at port 3500");
