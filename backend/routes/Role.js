const express =require('express');
const router=express.Router();
const Role = require("../models/role");
const Joi = require("joi");

const Employee=require("../models/employee");
const { 
    verifyAdmin, 
    verifyAdminHR, 
    verifyHR, 
    verifyHREmployee, 
    verifyEmployee 
  } = require('../core/middleware'); 

  const RoleValidation = Joi.object().keys({
    RoleName: Joi.string()
      .max(200)
      .required(),
    CompanyID: Joi.required()
  });

router.get("/role", verifyAdminHR, async (req, res) => {
    try {
      const role = await Role.find().populate("company");
      res.send(role);
    } catch (err) {
      res.status(500).send(err); // Handle error appropriately
    }
  });

  router.post("/role", verifyAdminHR, async (req, res) => {
    try {
      // Validate the request body
      await RoleValidation.validateAsync(req.body);
  
      const newRole = {
        RoleName: req.body.RoleName,
        company: req.body.CompanyID
      };
  
      const role = await Role.create(newRole);
      res.status(201).send(role); // Send back the created role
      console.log("New Role Saved");
    } catch (err) {
      console.log(err);
      if (err.isJoi) {
        return res.status(400).send(err.details[0].message); // Joi validation error
      }
      res.status(500).send("Error creating role"); // General error
    }
  });
  
  router.put("/role/:id", verifyAdminHR, async (req, res) => {
    try {
      // Validate the request body
      await RoleValidation.validateAsync(req.body);
  
      const updateRole = {
        RoleName: req.body.RoleName,
        company: req.body.CompanyID
      };
  
      const role = await Role.findByIdAndUpdate(req.params.id, updateRole, { new: true });
      if (!role) {
        return res.status(404).send("Role not found");
      }
      res.send(role); // Send back the updated role
    } catch (err) {
      console.log(err);
      if (err.isJoi) {
        return res.status(400).send(err.details[0].message); // Joi validation error
      }
      res.status(500).send("Error updating role"); // General error
    }
  });
  
  router.delete("/role/:id", verifyAdminHR, async (req, res) => {
    try {
      const employees = await Employee.find({ role: req.params.id });
      if (employees.length > 0) {
        return res.status(403).send("This role is associated with Employee so you cannot delete this");
      }
  
      const role = await Role.findByIdAndDelete(req.params.id);
      if (!role) {
        return res.status(404).send("Role not found");
      }
      console.log("Role deleted");
      res.send(role); // Send back the deleted role
    } catch (err) {
      console.log(err);
      res.status(500).send("Error deleting role"); // General error
    }
  });

  module.exports=router;