const express =require('express');
const router=express.Router();
const Education = require("../models/education");
const Employee = require("../models/employee");
const Joi = require("joi");
const { 
    verifyAdmin, 
    verifyAdminHR, 
    verifyHR, 
    verifyHREmployee, 
    verifyEmployee 
  } = require('../core/middleware'); 



const EducationValidation = Joi.object().keys({
    SchoolUniversity: Joi.string()
      .max(200)
      .required(),
    Degree: Joi.string()
      .max(200)
      .required(),
    Grade: Joi.string()
      .max(50)
      .required(),
    PassingOfYear: Joi.string()
      .max(10)
      .required()
  });
  

  
router.get("/education/:id", verifyHREmployee, async (req, res) => {
    try {
      const employee = await Employee.findById(req.params.id)
        .populate({
          path: "education"
        })
        .select("FirstName LastName MiddleName");
  
      if (!employee) {
        return res.status(404).send("Employee not found");
      }
  
      res.send(employee); // Send back the employee with education
    } catch (err) {
      console.log(err);
      res.status(500).send("Error fetching employee education"); // General error
    }
  });
  
  router.post("/education/:id", verifyEmployee, async (req, res) => {
    try {
      // Validate the request body
      await EducationValidation.validateAsync(req.body);
  
      const employee = await Employee.findById(req.params.id);
      if (!employee) {
        return res.status(404).send("Employee not found");
      }
  
      const newEducation = {
        SchoolUniversity: req.body.SchoolUniversity,
        Degree: req.body.Degree,
        Grade: req.body.Grade,
        PassingOfYear: req.body.PassingOfYear
      };
  
      const education = await Education.create(newEducation);
      employee.education.push(education);
      await employee.save();
  
      console.log("New education saved");
      res.status(201).send(education); // Send back the created education
    } catch (err) {
      console.log(err);
      if (err.isJoi) {
        return res.status(400).send(err.details[0].message); // Joi validation error
      }
      res.status(500).send("Error creating education"); // General error
    }
  });
  
  router.put("/education/:id", verifyEmployee, async (req, res) => {
    try {
      // Validate the request body
      await EducationValidation.validateAsync(req.body);
  
      const updatedEducation = {
        SchoolUniversity: req.body.SchoolUniversity,
        Degree: req.body.Degree,
        Grade: req.body.Grade,
        PassingOfYear: req.body.PassingOfYear
      };
  
      const education = await Education.findByIdAndUpdate(req.params.id, updatedEducation, { new: true });
      if (!education) {
        return res.status(404).send("Education not found");
      }
  
      res.send(education); // Send back the updated education
    } catch (err) {
      console.log(err);
      if (err.isJoi) {
        return res.status(400).send(err.details[0].message); // Joi validation error
      }
      res.status(500).send("Error updating education"); // General error
    }
  });
  
  router.delete("/education/:id/:id2", verifyEmployee, async (req, res) => {
    try {
      const employee = await Employee.findById(req.params.id);
      if (!employee) {
        return res.status(404).send("Employee not found");
      }
  
      const education = await Education.findByIdAndDelete(req.params.id2);
      if (!education) {
        return res.status(404).send("Education not found");
      }
  
      employee.education.pull(req.params.id2);
      await employee.save();
  
      console.log("Education deleted");
      res.send(education); // Send back the deleted education
    } catch (err) {
      console.log(err);
      res.status(500).send("Error deleting education"); // General error
    }
  });

  module.exports=router;