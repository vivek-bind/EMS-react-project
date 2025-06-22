
const express =require('express');
const router=express.Router();
const Employee = require("../models/employee");
const LeaveApplication=require("../models/leaveApplication");
const Joi = require("joi");
const { 
    verifyAdmin, 
    verifyAdminHR, 
    verifyHR, 
    verifyHREmployee, 
    verifyEmployee 
  } = require('../core/middleware'); 
const LeaveApplicationValidation = Joi.object().keys({
    Leavetype: Joi.string()
      .max(100)
      .required(),
  
    FromDate: Joi.date().required(),
    ToDate: Joi.date().required(),
    Reasonforleave: Joi.string()
      .max(100)
      .required(),
    Status: Joi.number()
      .max(1)
      .required()
  });
  const LeaveApplicationHRValidation = Joi.object().keys({
    Status: Joi.number()
      .max(3)
      .required()
  });


  router.get("/leave-application-emp/:id", verifyEmployee, async (req, res) => {
    
    console.log("Authorization header:", req.headers.authorization); // Log the authorization header
    try {
      console.log("Fetching employee leave applications for ID:",req.params.id);
      const employee = await Employee.findById(req.params.id)
        .populate({ path: "leaveApplication" })
        .select("FirstName LastName MiddleName");
  
      if (!employee) {
        console.log("Employee not found");
        return res.status(404).send("Employee not found");
      }
      console.log("Employee found:", employee);
      res.send(employee); // Send back the employee data
    } catch (err) {
      console.log(err);
      console.log("error fetching leave application");
      res.status(500).send("Error fetching leave applications"); // General error
    }
  });
  
  router.post("/leave-application-emp/:id", verifyEmployee, async (req, res) => {
    try {
      // Validate the request body
      await LeaveApplicationValidation.validateAsync(req.body);
  
      const employee = await Employee.findById(req.params.id);
      if (!employee) {
        return res.status(404).send("Employee not found");
      }
  
      const newLeaveApplication = {
        Leavetype: req.body.Leavetype,
        FromDate: req.body.FromDate,
        ToDate: req.body.ToDate,
        Reasonforleave: req.body.Reasonforleave,
        Status: req.body.Status,
        employee: req.params.id
      };
  
      const leaveApplication = await LeaveApplication.create(newLeaveApplication);
      
      employee.leaveApplication.push(leaveApplication);
      await employee.save();
  
      console.log("New leave application saved");
      res.status(201).send(leaveApplication); // Send back the created leave application
    } catch (err) {
      console.log(err);
      if (err.isJoi) {
        return res.status(400).send(err.details[0].message); // Joi validation error
      }
      res.status(500).send("Error creating leave application"); // General error
    }
  });
  
  router.put("/leave-application-emp/:id", verifyEmployee, async (req, res) => {
    try {
      // Validate the request body
      await LeaveApplicationValidation.validateAsync(req.body);
  
      const updatedLeaveApplication = {
        Leavetype: req.body.Leavetype,
        FromDate: req.body.FromDate,
        ToDate: req.body.ToDate,
        Reasonforleave: req.body.Reasonforleave,
        Status: req.body.Status,
        employee: req.params.id
      };
  
      const leaveApplication = await LeaveApplication.findByIdAndUpdate(req.params.id, updatedLeaveApplication, { new: true });
      if (!leaveApplication) {
        return res.status(404).send("Leave application not found");
      }
  
      res.send(leaveApplication); // Send back the updated leave application
    } catch (err) {
      console.log(err);
      if (err.isJoi) {
        return res.status(400).send(err.details[0].message); // Joi validation error
      }
      res.status(500).send("Error updating leave application"); // General error
    }
  });
  
  router.delete("/leave-application-emp/:id/:id2", verifyEmployee, async (req, res) => {
    try {
      const employee = await Employee.findById(req.params.id);
      if (!employee) {
        return res.status(404).send("Employee not found");
      }
  
      const leaveApplication = await LeaveApplication.findByIdAndDelete(req.params.id2);
      if (!leaveApplication) {
        return res.status(404).send("Leave application not found");
      }
  
      employee.leaveApplication.pull(req.params.id2);
      await employee.save();
  
      console.log("Leave application deleted");
      res.send(leaveApplication); // Send back the deleted leave application
    } catch (err) {
      console.log(err);
      res.status(500).send("Error deleting leave application"); // General error
    }
  });
  
  // HR Leave Application Endpoints
  
  router.get("/leave-application-hr", verifyHR, async (req, res) => {
    try {
      const leaveApplications = await LeaveApplication.find()
        .populate({ path: "employee" });
  
      res.send(leaveApplications); // Send back the list of leave applications
    } catch (err) {
      console.log(err);
      res.status(500).send("Error fetching leave applications"); // General error
   }
  });
  
  router.put("/leave-application-hr/:id", verifyHR, async (req, res) => {
    try {
      // Validate the request body
      await LeaveApplicationHRValidation.validateAsync(req.body);
  
      const updatedLeaveApplication = {
        Status: req.body.Status
      };
  
      const leaveApplication = await LeaveApplication.findByIdAndUpdate(req.params.id, { $set: updatedLeaveApplication }, { new: true });
      if (!leaveApplication) {
        return res.status(404).send("Leave application not found");
      }
  
      res.send(leaveApplication); // Send back the updated leave application
    } catch (err) {
      console.log(err);
      if (err.isJoi) {
        return res.status(400).send(err.details[0].message); // Joi validation error
      }
      res.status(500).send("Error updating leave application"); // General error
    }
  });
  
  router.delete("/leave-application-hr/:id/:id2", verifyHR, async (req, res) => {
    try {
      const employee = await Employee.findById(req.params.id);
      if (!employee) {
        return res.status(404).send("Employee not found");
      }
  
      const leaveApplication = await LeaveApplication.findByIdAndDelete(req.params.id2);
      if (!leaveApplication) {
        return res.status(404).send("Leave application not found");
      }
  
      employee.leaveApplication.pull(req.params.id2);
      await employee.save();
  
      console.log("Leave application deleted");
      res.send(leaveApplication); // Send back the deleted leave application
    } catch (err) {
      console.log(err);
      res.status(500).send("Error deleting leave application"); // General error
    }
  });

  module.exports=router;