const express =require('express');
const router=express.Router();
const Employee = require("../models/employee");
//const FamilyInfo=require("../models/employee");
const FamilyInfo = require("../models/familyInfo");
const Joi = require("joi");
const { 
    verifyAdmin, 
    verifyAdminHR, 
    verifyHR, 
    verifyHREmployee, 
    verifyEmployee 
  } = require('../core/middleware'); 

const EmployeePersonalInfoValidation = Joi.object().keys({
    BloodGroup: Joi.string()
      .max(10)
      .required(),
    DOB: Joi.date().required(),
  
    ContactNo: Joi.string()
      .max(20)
      .required(),
    Email: Joi.string()
      .max(200)
      .required(),
    EmergencyContactNo: Joi.string()
      .max(20)
      .required(),
    Gender: Joi.string()
      .max(100)
      .required(),
    Hobbies: Joi.string()
      .max(1000)
      .required(),
    PANcardNo: Joi.string()
      .max(50)
      .required(),
    PermanetAddress: Joi.string()
      .max(200)
      .required(),
    PresentAddress: Joi.string()
      .max(200)
      .required()
  });
  
  
  const FamilyInfoValidation = Joi.object().keys({
    Name: Joi.string()
      .max(200)
      .required(),
    Relationship: Joi.string()
      .max(200)
      .required(),
    DOB: Joi.date().required(),
    Occupation: Joi.string()
      .max(100)
      .required()
  });

  router.get("/personal-info/:id", verifyHREmployee, async (req, res) => {
    try {
      console.log("personal-info", req.params.id);
      const employee = await Employee.findById(req.params.id)
        .populate({ path: "role position department" })
        .select("-salary -education -familyInfo -workExperience");
  
      if (!employee) {
        return res.status(404).send("Employee not found");
      }
  
      res.send(employee); // Send back the employee data
    } catch (err) {
      console.log(err);
      res.status(500).send("Error fetching personal info"); // General error
    }
  });
  
  router.put("/personal-info/:id", verifyEmployee, async (req, res) => {
    try {
      // Validate the request body
      await EmployeePersonalInfoValidation.validateAsync(req.body);
  
      const updatedEmployee = {
        BloodGroup: req.body.BloodGroup,
        ContactNo: req.body.ContactNo,
        DOB: req.body.DOB,
        Email: req.body.Email,
        EmergencyContactNo: req.body.EmergencyContactNo,
        Gender: req.body.Gender,
        Hobbies: req.body.Hobbies,
        PANcardNo: req.body.PANcardNo,
        PermanetAddress: req.body.PermanetAddress,
        PresentAddress: req.body.PresentAddress
      };
  
      const employee = await Employee.findByIdAndUpdate(req.params.id, { $set: updatedEmployee }, { new: true });
      if (!employee) {
        return res.status(404).send("Employee not found");
      }
  
      res.send(employee); // Send back the updated employee
    } catch (err) {
      console.log(err);
      if (err.isJoi) {
        return res.status(400).send(err.details[0].message); // Joi validation error
      }
      res.status(500).send("Error updating personal info"); // General error
    }
  });
  
  ////////////////////////////////
  ////////////////////education
  
  //////////////////////////////////
  //////////////////////////familyInfo
  
  router.get("/family-info/:id", verifyHREmployee, async (req, res) => {
    try {
      console.log(req.params.id);
      const employee = await Employee.findById(req.params.id)
        .populate({ path: "familyInfo" })
        .select("FirstName LastName MiddleName");
  
      if (!employee) {
        return res.status(404).send("Employee not found");
      }
  
      res.send(employee); // Send back the employee data
    } catch (err) {
      console.log(err);
      res.status(500).send("Error fetching family info"); // General error
    }
  });
  
  router.post("/family-info/:id", verifyEmployee, async (req, res) => {
    try {
      // Validate the request body
      await FamilyInfoValidation.validateAsync(req.body);
  
      const employee = await Employee.findById(req.params.id);
      if (!employee) {
        return res.status(404).send("Employee not found");
      }
  
      const newFamilyInfo = {
        Name: req.body.Name,
        Relationship: req.body.Relationship,
        DOB: req.body.DOB,
        Occupation: req.body.Occupation
      };
  
      const familyInfo = await FamilyInfo.create(newFamilyInfo);
      employee.familyInfo.push(familyInfo);
      await employee.save();
  
      console.log("New family info saved");
      res.status(201).send(familyInfo); // Send back the created family info
    } catch (err) {
      console.log(err);
      if (err.isJoi) {
        return res.status(400).send(err.details[0].message); // Joi validation error
      }
      res.status(500).send("Error creating family info"); // General error
    }
  });


  router.get("/family-info/:id", verifyHREmployee, async (req, res) => {
    try {
      console.log(req.params.id);
      const employee = await Employee.findById(req.params.id)
        .populate({ path: "familyInfo" })
        .select("FirstName LastName MiddleName");
  
      if (!employee) {
        return res.status(404).send("Employee not found");
      }
  
      res.send(employee); // Send back the employee data
    } catch (err) {
      console.log(err);
      res.status(500).send("Error fetching family info"); // General error
    }
  });
  
  router.post("/family-info/:id", verifyEmployee, async (req, res) => {
    try {
      // Validate the request body
      await FamilyInfoValidation.validateAsync(req.body);
  
      const employee = await Employee.findById(req.params.id);
      if (!employee) {
        return res.status(404).send("Employee not found");
      }
  
      const newFamilyInfo = {
        Name: req.body.Name,
        Relationship: req.body.Relationship,
        DOB: req.body.DOB,
        Occupation: req.body.Occupation
      };
  
      const familyInfo = await FamilyInfo.create(newFamilyInfo);
      employee.familyInfo.push(familyInfo);
      await employee.save();
  
      console.log("New family info saved");
      res.status(201).send(familyInfo); // Send back the created family info
    } catch (err) {
      console.log(err);
      if (err.isJoi) {
        return res.status(400).send(err.details[0].message); // Joi validation error
      }
      res.status(500).send("Error creating family info"); // General error
    }
  });
  
  router.put("/family-info/:id", verifyEmployee, async (req, res) => {
    try {
      // Validate the request body
      await FamilyInfoValidation.validateAsync(req.body);
  
      const updatedFamilyInfo = {
        Name: req.body.Name,
        Relationship: req.body.Relationship,
        DOB: req.body.DOB,
        Occupation: req.body.Occupation
      };
  
      const familyInfo = await FamilyInfo.findByIdAndUpdate(req.params.id, updatedFamilyInfo, { new: true });
      if (!familyInfo) {
        return res.status(404).send("Family info not found");
      }
  
      res.send(familyInfo); // Send back the updated family info
    } catch (err) {
      console.log(err);
      if (err.isJoi) {
        return res.status(400).send(err.details[0].message); // Joi validation error
      }
      res.status(500).send("Error updating family info"); // General error
    }
  });
  
  router.delete("/family-info/:id/:id2", verifyEmployee, async (req, res) => {
    try {
      const employee = await Employee.findById(req.params.id);
      if (!employee) {
        return res.status(404).send("Employee not found");
      }
  
      const familyInfo = await FamilyInfo.findByIdAndDelete(req.params.id2);
      if (!familyInfo) {
        return res.status(404).send("Family info not found");
      }
  
      employee.familyInfo.pull(req.params.id2);
      await employee.save();
  
      console.log("Family info deleted");
      res.send(familyInfo); // Send back the deleted family info
    } catch (err) {
      console.log(err);
      res.status(500).send("Error deleting family info"); // General error
    }
  });

  module.exports=router;