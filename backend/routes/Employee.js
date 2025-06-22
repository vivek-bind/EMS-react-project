const express =require('express');
const router=express.Router();
const Employee = require("../models/employee");
const Joi = require("joi");
const { 
    verifyAdmin, 
    verifyAdminHR, 
    verifyHR, 
    verifyHREmployee, 
    verifyEmployee 
  } = require('../core/middleware'); 

  
  
  const EmployeeValidation = Joi.object().keys({
    RoleID: Joi.optional(),
    PositionID: Joi.optional(),
    DepartmentID: Joi.optional(),
    SalaryID: Joi.optional(),
    FirstName: Joi.string()
      .max(200)
      .required(),
    MiddleName: Joi.string()
      .max(200)
      .optional(),
    LastName: Joi.string()
      .max(200)
      .required(),
    Email: Joi.string()
      .max(200)
      .required(),
    Password: Joi.string()
      .max(100)
      .required(),
    Gender: Joi.string()
      .max(100)
      .required(),
    DOB: Joi.date().required(),
    DateOfJoining: Joi.date().required(),
    TerminateDate: Joi.date().optional(),
    Deleted: Joi.optional(),
    Photo: Joi.optional(),
    ContactNo: Joi.string()
      //.max(20)
      .pattern(/^\d{10}$/)
      .required()
      .messages({
        'string.pattern.base': 'ContactNo must be a valid 10-digit number',
      }),
    EmployeeCode: Joi.string()
      .max(100)
      .required(),
    Account: Joi.number()
      .max(3)
      .required()
  });
  const EmployeeValidationUpdate = Joi.object().keys({
    RoleID: Joi.optional(),
    PositionID: Joi.optional(),
    DepartmentID: Joi.optional(),
    SalaryID: Joi.optional(),
    FirstName: Joi.string()
      .max(200)
      .required(),
    MiddleName: Joi.string()
      .max(200)
      .required(),
    LastName: Joi.string()
      .max(200)
      .required(),
    Email: Joi.string()
      .max(200)
      .required(),
    Gender: Joi.string()
      .max(100)
      .required(),
    DOB: Joi.date().required(),
    DateOfJoining: Joi.date().required(),
    TerminateDate: Joi.date().optional(),
    Deleted: Joi.optional(),
    Photo: Joi.optional(),
    ContactNo: Joi.string()
      .max(20)
      .required()
      ,
    EmployeeCode: Joi.string()
      .max(100)
      .required(),
    Account: Joi.number()
      .max(3)
      .required()
  });
  
  

  router.get("/employee", verifyHR, async (req, res) => {
    try {
      const employees = await Employee.find()
        .populate({
          path: "role position department"
        })
        .select("-salary -education -familyInfo -workExperience -Password");
      
      res.send(employees); // Send back the list of employees
    } catch (err) {
      console.log(err);
      res.status(500).send("Error fetching employees"); // General error
    }
  });
  
  router.post("/employee", verifyHR, async (req, res) => {
    try {
      // Validate the request body
      await EmployeeValidation.validateAsync(req.body);
  
      const newEmployee = {
        Email: req.body.Email,
        Password: req.body.Password,
        role: req.body.RoleID,
        Account: req.body.Account,
        Gender: req.body.Gender,
        FirstName: req.body.FirstName,
        MiddleName: req.body.MiddleName,
        LastName: req.body.LastName,
        DOB: req.body.DOB,
        ContactNo: req.body.ContactNo,
        EmployeeCode: req.body.EmployeeCode,
        department: req.body.DepartmentID,
        position: req.body.PositionID,
        DateOfJoining: req.body.DateOfJoining,
        TerminateDate: req.body.TerminateDate
      };
  
      const employee = await Employee.create(newEmployee);
      res.status(201).send(employee); // Send back the created employee
      console.log("New employee saved");
    } catch (err) {
      console.log(err);
      if (err.isJoi) {
        return res.status(400).send(err.details[0].message); // Joi validation error
      }
      res.status(500).send("Error creating employee"); // General error
    }
  });
  
  router.put("/employee/:id", verifyHR, async (req, res) => {
    try {
      // Validate the request body
      await EmployeeValidationUpdate.validateAsync(req.body);
  
      const updatedEmployee = {
        Email: req.body.Email,
        Account: req.body.Account,
        role: req.body.RoleID,
        Gender: req.body.Gender,
        FirstName: req.body.FirstName,
        MiddleName: req.body.MiddleName,
        LastName: req.body.LastName,
        DOB: req.body.DOB,
        ContactNo: req.body.ContactNo,
        EmployeeCode: req.body.EmployeeCode,
        department: req.body.DepartmentID,
        position: req.body.PositionID,
        DateOfJoining: req.body.DateOfJoining,
        TerminateDate: req.body.TerminateDate
      };
  
      const employee = await Employee.findByIdAndUpdate(req.params.id, updatedEmployee, { new: true });
      if (!employee) {
        return res.status(404).send("Employee not found");
      }
      res.send(employee); // Send back the updated employee
    } catch (err) {
      console.log(err);
      if (err.isJoi) {
        return res.status(400).send(err.details[0].message); // Joi validation error
      }
      res.status(500).send("Error updating employee"); // General error
    }
  });
  
  router.delete("/employee/:id", verifyHR, async (req, res) => {
    try {
      const employee = await Employee.findByIdAndDelete(req.params.id);
      if (!employee) {
        return res.status(404).send("Employee not found");
      }
      console.log("Employee deleted");
      res.send(employee); // Send back the deleted employee
    } catch (err) {
      console.log(err);
      res.status(500).send("Error deleting employee"); // General error
    }
  });

  module.exports=router;

// router.get("/employee", verifyHR, (req, res) => {
//     //{path: 'projects', populate: {path: 'portals'}}
//     Employee.find()
//       // .populate({ path: "city", populate: { path: "state" } ,populate: { populate: { path: "country" } } })
//       .populate({
//         path: "role position department"
//         // populate: {
//         //   path: "state",
//         //   model: "State",
//         //   populate: {
//         //     path: "country",
//         //     model: "Country"
//         //   }
//         // }
//       })
//       .select("-salary -education -familyInfo -workExperience -Password")
//       .exec(function (err, employee) {
//         res.send(employee);
//       });
//   });
  
//   router.post("/employee", verifyHR, (req, res) => {
//     Joi.validate(req.body, EmployeeValidation, (err, result) => {
//       if (err) {
//         console.log(err);
//         res.status(400).send(err.details[0].message);
//       } else {
//         let newEmployee;
  
//         newEmployee = {
//           Email: req.body.Email,
//           Password: req.body.Password,
//           role: req.body.RoleID,
//           Account: req.body.Account,
//           Gender: req.body.Gender,
//           FirstName: req.body.FirstName,
//           MiddleName: req.body.MiddleName,
//           LastName: req.body.LastName,
//           DOB: req.body.DOB,
//           ContactNo: req.body.ContactNo,
//           EmployeeCode: req.body.EmployeeCode,
//           department: req.body.DepartmentID,
//           position: req.body.PositionID,
//           DateOfJoining: req.body.DateOfJoining,
//           TerminateDate: req.body.TerminateDate
//         };
  
//         Employee.create(newEmployee, function (err, employee) {
//           if (err) {
//             console.log(err);
//             res.send("error");
//           } else {
//             res.send(employee);
  
//             console.log("new employee Saved");
//           }
//         });
//         console.log(req.body);
//       }
//     });
//   });
  
//   router.put("/employee/:id", verifyHR, (req, res) => {
//     Joi.validate(req.body, EmployeeValidationUpdate, (err, result) => {
//       if (err) {
//         console.log(err);
//         res.status(400).send(err.details[0].message);
//       } else {
//         let newEmployee;
//         newEmployee = {
//           Email: req.body.Email,
//           // Password: req.body.Password,
//           Account: req.body.Account,
//           role: req.body.RoleID,
//           Gender: req.body.Gender,
//           FirstName: req.body.FirstName,
//           MiddleName: req.body.MiddleName,
//           LastName: req.body.LastName,
//           DOB: req.body.DOB,
//           ContactNo: req.body.ContactNo,
//           EmployeeCode: req.body.EmployeeCode,
//           department: req.body.DepartmentID,
//           position: req.body.PositionID,
//           DateOfJoining: req.body.DateOfJoining,
//           TerminateDate: req.body.TerminateDate
//         };
  
//         Employee.findByIdAndUpdate(req.params.id, newEmployee, function (
//           err,
//           employee
//         ) {
//           if (err) {
//             res.send("error");
//           } else {
//             res.send(newEmployee);
//           }
//         });
//       }
  
//       console.log("put");
//       console.log(req.body);
//     });
//   });
  
//   router.delete("/employee/:id", verifyHR, (req, res) => {
//     // Employee.findByIdAndRemove({ _id: req.params.id }, function (err, employee) {
//     //   if (!err) {
//     //     console.log(" state deleted");
//     //     res.send(employee);
//     //   } else {
//     //     console.log(err);
//     //     res.send("error");
//     //   }
//     // });
//     res.send("error");
//     console.log("delete");
//     console.log(req.params.id);
//   });
  