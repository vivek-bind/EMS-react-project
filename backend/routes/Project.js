
const express =require('express');
const router=express.Router();
const Project = require("../models/project");
const Joi = require("joi");
const { 
    verifyAdmin, 
    verifyAdminHR, 
    verifyHR, 
    verifyHREmployee, 
    verifyEmployee 
  } = require('../core/middleware'); 

const ProjectValidation = Joi.object().keys({
    _id: Joi.optional(),
    ID: Joi.optional(),
    CreatedBy: Joi.optional(),
    CreatedDate: Joi.optional(),
    Deleted: Joi.optional(),
    EmpFullName: Joi.string()
      .max(200)
      .optional(),
    EstimatedCost: Joi.optional(),
    EstimatedTime: Joi.optional(),
    ModifiedBy: Joi.optional(),
    ModifiedDate: Joi.optional(),
    ProjectDesc: Joi.string()
      .max(2000)
      .optional(),
    ProjectTitle: Joi.string()
      .max(200)
      .required(),
    ProjectURL: Joi.string()
      .max(1000)
      .optional(),
    Remark: Joi.string()
      .max(2000)
      .optional(),
    ResourceID: Joi.optional(),
    Status: Joi.number()
      .max(10)
      .required(),
    portal: Joi.optional(),
    Portal_ID: Joi.optional()
  });
  

  router.get("/admin/project-bid", verifyAdmin, async (req, res) => {
    try {
      const projects = await Project.find().populate("portals");
      res.send(projects); // Send back the list of projects
    } catch (err) {
      console.log(err);
      res.status(500).send("Error fetching projects"); // General error
    }
  });
  
  router.post("/admin/project-bid", verifyAdmin, async (req, res) => {
    try {
      // Validate the request body
      await ProjectValidation.validateAsync(req.body);
  
      const project = {
        ProjectTitle: req.body.ProjectTitle,
        ProjectURL: req.body.ProjectURL,
        ProjectDesc: req.body.ProjectDesc,
        portals: req.body.Portal_ID,
        EstimatedTime: req.body.EstimatedTime,
        EstimatedCost: req.body.EstimatedCost,
        ResourceID: req.body.ResourceID,
        Status: req.body.Status,
        Remark: req.body.Remark
      };
  
      const newProject = await Project.create(project);
      console.log("New project saved",newProject);
      res.status(201).send(newProject); // Send back the created project
    } catch (err) {
      console.log(err);
      if (err.isJoi) {
        return res.status(400).send(err.details[0].message); // Joi validation error
      }
      res.status(500).send("Error creating project"); // General error
    }
  });
  
  router.put("/admin/project-bid/:id", verifyAdmin, async (req, res) => {
    try {
      // Validate the request body
      await ProjectValidation.validateAsync(req.body);
  
      const updateProject = {
        ProjectTitle: req.body.ProjectTitle,
        ProjectURL: req.body.ProjectURL,
        ProjectDesc: req.body.ProjectDesc,
        portals: req.body.Portal_ID,
        EstimatedTime: req.body.EstimatedTime,
        EstimatedCost: req.body.EstimatedCost,
        ResourceID: req.body.ResourceID,
        Status: req.body.Status,
        Remark: req.body.Remark
      };
  
      const project = await Project.findByIdAndUpdate(req.params.id, updateProject, { new: true });
      if (!project) {
        return res.status(404).send("Project not found");
      }
  
      res.send(project); // Send back the updated project
    } catch (err) {
      console.log(err);
      if (err.isJoi) {
        return res.status(400).send(err.details[0].message); // Joi validation error
      }
      res.status(500).send("Error updating project"); // General error
    }
  });
  
  router.delete("/admin/project-bid/:id", verifyAdmin, async (req, res) => {
    try {
      const project = await Project.findByIdAndDelete(req.params.id);
      if (!project) {
        return res.status(404).send("Project not found");
      }
  
      console.log("Project deleted");
      res.send(project); // Send back the deleted project
    } catch (err) {
      console.log(err);
      res.status(500).send("Error deleting project"); // General error
    }
  });

  module.exports=router;