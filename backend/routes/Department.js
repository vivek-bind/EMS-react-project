const express =require('express');
const router=express.Router();
const Department = require("../models/department");
const Employee =require("../models/employee")
const Joi = require("joi");
const { 
    verifyAdmin, 
    verifyAdminHR, 
    verifyHR, 
    verifyHREmployee, 
    verifyEmployee 
  } = require('../core/middleware'); 

const DepartmentValidation = Joi.object().keys({
  DepartmentName: Joi.string()
    .max(200)
    .required(),
  CompanyID: Joi.required()
});

router.get("/department", verifyAdminHR, async (req, res) => {
    try {
      const departments = await Department.find().populate("company");
      res.send(departments); // Send back the list of departments
    } catch (err) {
      console.log(err);
      res.status(500).send("Error fetching departments"); // General error
    }
  });
  
  router.post("/department", verifyAdminHR, async (req, res) => {
    try {
      // Validate the request body
      await DepartmentValidation.validateAsync(req.body);
  
      const newDepartment = {
        DepartmentName: req.body.DepartmentName,
        company: req.body.CompanyID
      };
  
      const department = await Department.create(newDepartment);
      console.log("New department saved");
      res.status(201).send(department); // Send back the created department
    } catch (err) {
      console.log(err);
      if (err.isJoi) {
        return res.status(400).send(err.details[0].message); // Joi validation error
      }
      res.status(500).send("Error creating department"); // General error
    }
  });
  
  router.put("/department/:id", verifyAdminHR, async (req, res) => {
    try {
      // Validate the request body
      await DepartmentValidation.validateAsync(req.body);
  
      const updateDepartment = {
        DepartmentName: req.body.DepartmentName,
        company: req.body.CompanyID
      };
  
      const department = await Department.findByIdAndUpdate(req.params.id, updateDepartment, { new: true });
      if (!department) {
        return res.status(404).send("Department not found");
      }
  
      res.send(department); // Send back the updated department
    } catch (err) {
      console.log(err);
      if (err.isJoi) {
        return res.status(400).send(err.details[0].message); // Joi validation error
      }
      res.status(500).send("Error updating department"); // General error
    }
  });
  
  router.delete("/department/:id", verifyAdminHR, async (req, res) => {
    try {
      const employees = await Employee.find({ department: req.params.id });
      if (employees.length > 0) {
        return res.status(403).send("This department is associated with an employee, so you cannot delete it");
      }
  
      const department = await Department.findByIdAndDelete(req.params.id);
      if (!department) {
        return res.status(404).send("Department not found");
      }
  
      console.log("Department deleted");
      res.send(department); // Send back the deleted department
    } catch (err) {
      console.log(err);
      res.status(500).send("Error deleting department"); // General error
    }
  });

  module.exports=router;