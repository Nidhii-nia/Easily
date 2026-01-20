import jobs from "../assets/jobs.js";



export default class jobModel {
  static getAllJobs(req, res) {
    return jobs;
  }

  static findJob(id) {
    const job = jobs.find((p) => p.id == id);
    if (!job) {
      console.log(`Job with id ${id} not found`);
      return null;
    }
    return job;
  }

  static addJob(
    job_category,
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
  ) {

    const maxId = jobs.length > 0 
    ? Math.max(...jobs.map(job => job.id)) 
    : 0;


    const jobObj = {
      id: maxId + 1,
      category: job_category,
      applicants: 0,
      number_of_openings,
      featured: false,
      logo,
      job_designation,
      company_name,
      job_type,
      job_location,
      experience,
      salary,
      employees,
      job_posted: new Date(Date.now()).toLocaleDateString(),
      skills_required: skills_required,
      apply_by,
      company_founded,
    };

    jobs.push(jobObj);
    console.log(jobObj);
    return jobs;
  }

  static updateJob(
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
    foundJobId,
  ) {
    const index = jobs.findIndex((job) => job.id == foundJobId);

    if (index === -1) {
      return;
    }

    const jobObj = {
      id: foundJobId,
      category,
      applicants: [],
      number_of_openings,
      featured: false,
      logo,
      job_designation,
      company_name,
      job_type,
      job_location,
      experience,
      salary,
      employees,
      job_posted: new Date(Date.now()).toLocaleDateString(),
      skills_required: skills_required,
      apply_by,
      company_founded,
    };

    Object.assign(jobs[index], jobObj);
  }

  static deleteJob(id) {
    const index = jobs.findIndex((job) => job.id == id);

    if (index === -1) {
      return false;
    }

    jobs.splice(index, 1);
    return true;
  }

  static addApplicant(id,fullName,email,phone,resume){
    const jobApplicant = jobs.find(job=>job.id == id);
    if(!jobApplicant){
      return false;
    }
    const applicantDetails = {
      fullName,
      email,
      phone,
      resume
    }
    jobApplicant.applicants.push(applicantDetails);
    return true;
  }

  static searchJob(query){
    const searchTerm = String(query).toLowerCase().trim()
    const matchingJobs = jobs.filter(job => {
    return (
      job.job_designation.toLowerCase().includes(searchTerm) ||
      job.category.toLowerCase().includes(searchTerm) ||
      job.company_name.toLowerCase().includes(searchTerm) ||
      job.job_location.toLowerCase().includes(searchTerm) ||
      job.skills_required.some(skill => 
        skill.toLowerCase().includes(searchTerm)
      )
    );
  });

  return matchingJobs;
  }
}
