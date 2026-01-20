import { body, validationResult } from "express-validator";
import jobModel from "../models/job.model.js";

/* helper function */
const runValidation = async (req, res, rules, view) => {
  await Promise.all(rules.map(rule => rule.run(req)));

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errors.array()[0].msg
    }

    return null;
  }

/* JOB CREATE VALIDATION */
export const validateNewJob = async (req, res, next) => {
  const rules = [
    body("category").notEmpty().withMessage("Job category is required"),
    body("job_designation").notEmpty().withMessage("Job designation required"),
    body("job_location").notEmpty().withMessage("Job location required"),
    body("company_name").notEmpty().withMessage("Company name required"),
    body("salary").notEmpty().withMessage("Salary is required"),
    body("number_of_openings")
      .isInt({ gt: 0 })
      .withMessage("Openings must be greater than 0"),
    body("logo").custom((_, { req }) => {
      if (!req.file) throw new Error("Logo is required");
      return true;
    })
  ];

  const error = await runValidation(req, res, rules);

  if (error) {
    return res.render("new-job", { error });
  }

  next();
};



/* JOB UPDATE VALIDATION */
export const validateUpdateJob = async (req, res, next) => {
  const rules = [
    body("category").notEmpty().withMessage("Job category is required"),
    body("job_designation").notEmpty().withMessage("Job designation required"),
    body("job_location").notEmpty().withMessage("Job location required"),
    body("company_name").notEmpty().withMessage("Company name required"),
    body("salary").notEmpty().withMessage("Salary is required"),
    body("number_of_openings")
      .isInt({ gt: 0 })
      .withMessage("Openings must be greater than 0"),
    body("skills_required")
      .custom(val => val && val.length > 0)
      .withMessage("Select at least one skill")
  ];

  const error = await runValidation(req, res, rules);

  if (error) {
    const id = req.params.id;

    const job = jobModel.findJob(id);

    return res.render("update-job", {
      job,
      error
    });
  }

  next();
};

export const validateApplyForJob = async(req,res,next) =>{
  const rules = [
    body("fullName")
      .notEmpty().withMessage("Full Name is required")
      .trim(),
    
    body("email")
      .isEmail().withMessage("Email should be correct and required")
      .normalizeEmail(),
    
    body("phone")
      .notEmpty().withMessage("Phone number is required")
      .isMobilePhone('en-IN').withMessage('Please provide a valid mobile phone number'),
    
    body("resume").custom((_, { req }) => {
      if(!req.file) {
        throw new Error("Please upload your resume in valid format");
      }
      return true;
    }),
    
    body("terms")
      .exists().withMessage("You need to agree to the terms and conditions to proceed!")
  ];

  const error = await runValidation(req,res,rules);

  if(error){
    const id = req.params.id;
    const job = jobModel.findJob(id);
   return res.render('job-apply',{job,error:error});
  }

  next();
}


