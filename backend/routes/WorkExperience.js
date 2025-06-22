const express =require('express');
const router=express.Router();
const WorkExperience=require("../models/workExperience");
const Employee = require("../models/employee");
const Joi = require("joi");
const { 
    verifyAdmin, 
    verifyAdminHR, 
    verifyHR, 
    verifyHREmployee, 
    verifyEmployee 
  } = require('../core/middleware'); 

const WorkExperienceValidation = Joi.object().keys({
  CompanyName: Joi.string()
    .max(200)
    .required(),
  Designation: Joi.string()
    .max(200)
    .required(),
  FromDate: Joi.date().required(),
  ToDate: Joi.date().required()
});


router.get("/work-experience/:id", verifyHREmployee, async (req, res) => {
    try {
      console.log(req.params.id);
      const employee = await Employee.findById(req.params.id)
        .populate({ 
          path: "workExperience" })
        .select("FirstName LastName MiddleName");
  
      if (!employee) {
        return res.status(404).send("Employee not found");
      }
  
      res.send(employee); // Send back the employee data
    } catch (err) {
      console.log(err);
      res.status(500).send("Error fetching work experience"); // General error
    }
  });
  
  router.post("/work-experience/:id", verifyEmployee, async (req, res) => {
    try {
      // Validate the request body
      await WorkExperienceValidation.validateAsync(req.body);
  
      const employee = await Employee.findById(req.params.id);
      if (!employee) {
        return res.status(404).send("Employee not found");
      }
  
      const newWorkExperience = {
        CompanyName: req.body.CompanyName,
        Designation: req.body.Designation,
        FromDate: req.body.FromDate,
        ToDate: req.body.ToDate
      };
  
      const workExperience = await WorkExperience.create(newWorkExperience);
      employee.workExperience.push(workExperience);
      await employee.save();
  
      console.log("New work experience saved");
      res.status(201).send(workExperience); // Send back the created work experience
    } catch (err) {
      console.log(err);
      if (err.isJoi) {
        return res.status(400).send(err.details[0].message); // Joi validation error
      }
      res.status(500).send("Error creating work experience"); // General error
    }
  });
  
  router.put("/work-experience/:id", verifyEmployee, async (req, res) => {
    try {
      // Validate the request body
      await WorkExperienceValidation.validateAsync(req.body);
  
      const updatedWorkExperience = {
        CompanyName: req.body.CompanyName,
        Designation: req.body.Designation,
        FromDate: req.body.FromDate,
        ToDate: req.body.ToDate
      };
  
      const workExperience = await WorkExperience.findByIdAndUpdate(req.params.id, updatedWorkExperience, { new: true });
      if (!workExperience) {
        return res.status(404).send("Work experience not found");
      }
  
      res.send(workExperience); // Send back the updated work experience
    } catch (err) {
      console.log(err);
      if (err.isJoi) {
        return res.status(400).send(err.details[0].message); // Joi validation error
      }
      res.status(500).send("Error updating work experience"); // General error
    }
  });
  
  router.delete("/work-experience/:id/:id2", verifyEmployee, async (req, res) => {
    try {
      const employee = await Employee.findById(req.params.id);
      if (!employee) {
        return res.status(404).send("Employee not found");
      }
  
      const workExperience = await WorkExperience.findByIdAndDelete(req.params.id2);
      if (!workExperience) {
        return res.status(404).send("Work experience not found");
      }
  
      employee.workExperience.pull(req.params.id2);
      await employee.save();
  
      console.log("Work experience deleted");
      res.send(workExperience); // Send back the deleted work experience
    } catch (err) {
      console.log(err);
      res.status(500).send("Error deleting work experience"); // General error
    }
  });

  module.exports=router;