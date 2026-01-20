import jobModel from "../models/job.model.js";
import { sendMail } from "../public/js/nodemailer.js";

export default class jobController {
  getWelcomePage(req, res) {
    res.render("landing-page");
  }

  getJobs(req, res) {
    const jobs = jobModel.getAllJobs();
    res.render("list-all-jobs", { jobs: jobs, searchQuery:null });
  }

  getJob(req, res) {
    const id = req.params.id;
    console.log("getJob");
    
    const foundJob = jobModel.findJob(id);

    res.render("job-details", { data: foundJob,error:null });
  }

  getNewJob(req, res) {
    res.render("new-job", { error: null });
  }

  postNewJob(req, res) {
    const {
      category,
      job_designation,
      job_location,
      company_name,
      company_founded,
      employees,
      salary,
      number_of_openings,
      experience,
      skills_required,
      apply_by,
      job_type,
    } = req.body;
    console.log(req.body);

    const logo = "/files/" + req.file.filename;
    const job = jobModel.addJob(
      category,
      job_designation,
      job_location,
      company_name,
      company_founded,
      employees,
      salary,
      number_of_openings,
      experience,
      skills_required,
      apply_by,
      job_type,
      logo,
    );
    if (job) {
      res.render("list-all-jobs", { jobs: job , searchQuery:null});
    } else {
      res.render("new-job", {
        error: "An error occurred while posting the job! Please try again.",
      });
    }
  }

  getUpdateJob(req, res) {
    const id = req.params.id;
    console.log("getUpdateJob");
    const foundJob = jobModel.findJob(id);

    if (!foundJob) {
      return res.status(404).send("Job not found");
    }

    res.render("update-job", { job: foundJob,error:null });
  }

  postUpdateJob(req, res) {
    const id = req.params.id;

    const foundJob = jobModel.findJob(id);
    if (!foundJob) {
      return res.status(404).send("Job not found");
    }

    const {
      category,
      job_designation,
      job_location,
      company_name,
      company_founded,
      employees,
      salary,
      number_of_openings,
      experience,
      skills_required,
      apply_by,
      job_type,
    } = req.body;

    const logo = req.file
      ? "/files/" + req.file.filename
      : req.body.current_logo;

      jobModel.updateJob(
      category,
      job_designation,
      job_location,
      company_name,
      company_founded,
      employees,
      salary,
      number_of_openings,
      experience,
      skills_required,
      apply_by,
      job_type,
      logo,
      id
    );

    // res.redirect('/jobs');
    res.redirect(`/job/${id}`);
  }

postDelete(req, res) {
  const id = req.params.id;
  const deleted = jobModel.deleteJob(id);

  if (!deleted) {
    return res.status(404).json({ success: false, message: "Job not found" });
  }

  // Return success with updated jobs list
  const jobs = jobModel.getAllJobs();
  res.json({ 
    success: true, 
    jobs: jobs,
    message: "Job deleted successfully" 
  });
}

getApplyJob(req,res){
  const id = req.params.id;
  const job = jobModel.findJob(id);
  res.render('job-apply',{job:job,error:null});
}

postJobApply(req, res) {
  const { id, fullName, email, phone } = req.body;
  const job = jobModel.findJob(id);
  const resume = '/files/' + req.file.filename;
  
  const addDetails = jobModel.addApplicant(id, fullName, email, phone, resume);
  
  if (!addDetails) {
    res.render('job-details', { 
      data: job, 
      error: "Failed to apply due to some error" 
    });
  } else {
    try {
      sendMail(
        email,
        job.job_designation,
        fullName
      ).then(() => {
        console.log(`Confirmation email sent to ${email} for job: ${job.job_designation}`);
      }).catch(emailError => {
        console.error('Failed to send email:', emailError);
      });
      
    } catch (error) {
      console.error('Error in email sending:', error);
    }
    
    res.redirect(`/job/${id}`);
  }
}

getAllApplicants(req,res){
  const id = req.params.id;
  const job = jobModel.findJob(id);
  res.render('all-applicants',{allApplicants:job.applicants});
}

getSearchPage(req, res) {
  const query = req.query.q;
  console.log("Search query received:", query);
  
  const searchedJobs = jobModel.searchJob(query);
  console.log("Jobs found:", searchedJobs); 
  
  res.render('list-all-jobs', {
    jobs: searchedJobs,
    searchQuery: query
  });
}

}
