
const express =require('express');
const router=express.Router();
const Position = require("../models/position");
const Employee = require("../models/employee"); 



const Joi = require("joi");
const { 
    verifyAdmin, 
    verifyAdminHR, 
    verifyHR, 
    verifyHREmployee, 
    verifyEmployee 
  } = require('../core/middleware'); 

const PositionValidation = Joi.object().keys({
  PositionName: Joi.string()
    .max(200)
    .required(),
  CompanyID: Joi.required()
});

router.get("/position", verifyAdminHR, async (req, res) => {
    try {
      const positions = await Position.find().populate("company");
      res.send(positions); // Send back the list of positions
    } catch (err) {
      console.log(err);
      res.status(500).send("Error fetching positions"); // General error
    }
  });
  
  router.post("/position", verifyAdminHR, async (req, res) => {
    try {
      // Validate the request body
      await PositionValidation.validateAsync(req.body);
  
      const newPosition = {
        PositionName: req.body.PositionName,
        company: req.body.CompanyID
      };
  
      const position = await Position.create(newPosition);
      console.log("New position saved");
      res.status(201).send(position); // Send back the created position
    } catch (err) {
      console.log(err);
      if (err.isJoi) {
        return res.status(400).send(err.details[0].message); // Joi validation error
      }
      res.status(500).send("Error creating position"); // General error
    }
  });
  
  router.put("/position/:id", verifyAdminHR, async (req, res) => {
    try {
      // Validate the request body
      await PositionValidation.validateAsync(req.body);
  
      const updatePosition = {
        PositionName: req.body.PositionName,
        company: req.body.CompanyID
      };
  
      const position = await Position.findByIdAndUpdate(req.params.id, updatePosition, { new: true });
      if (!position) {
        return res.status(404).send("Position not found");
      }
  
      res.send(position); // Send back the updated position
    } catch (err) {
      console.log(err);
      if (err.isJoi) {
        return res.status(400).send(err.details[0].message); // Joi validation error
      }
      res.status(500).send("Error updating position"); // General error
    }
  });
  
  router.delete("/position/:id", verifyAdminHR, async (req, res) => {
    try {
      const employees = await Employee.find({ position: req.params.id });
      if (employees.length > 0) {
        return res.status(403).send("This position is associated with an employee, so you cannot delete it");
      }
  
      const position = await Position.findByIdAndDelete(req.params.id);
      if (!position) {
        return res.status(404).send("Position not found");
      }
  
      console.log("Position deleted");
      res.send(position); // Send back the deleted position
    } catch (err) {
      console.log(err);
      res.status(500).send("Error deleting position"); // General error
    }
  });

  module.exports=router;