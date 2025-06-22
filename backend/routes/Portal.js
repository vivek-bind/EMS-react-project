const mongoose = require("mongoose");
const express =require('express');
const router=express.Router();
const Portal = require("../models/portal");
const Project = require("../models/project");
const Joi = require("joi");
const { 
    verifyAdmin, 
    verifyAdminHR, 
    verifyHR, 
    verifyHREmployee, 
    verifyEmployee 
  } = require('../core/middleware'); 

const PortalValidation = Joi.object().keys({
    _id: Joi.optional(),
    ID: Joi.optional(),
    CreatedBy: Joi.optional(),
    CreatedDate: Joi.optional(),
    Deleted: Joi.optional(),
    ModifiedBy: Joi.optional(),
    ModifiedDate: Joi.optional(),
    PortalName: Joi.string()
      .max(200)
      .required(),
    Status: Joi.number()
      .max(1)
      .required()
  });
  



  router.get("/admin/portal", verifyAdmin, async (req, res) => {
    try {
      const portalData = await Portal.find().populate({ path: "projects" });
      res.send(portalData); // Send back the list of portals
    } catch (err) {
      console.log(err);
      res.status(500).send("Error fetching portals"); // General error
    }
  });
  
  router.post("/admin/portal", verifyAdmin, async (req, res) => {
    try {
      // Validate the request body
      await PortalValidation.validateAsync(req.body);
  
      const newPortal = {
        PortalName: req.body.PortalName,
        Status: req.body.Status
      };
  
      const portalData = await Portal.create(newPortal);
      console.log("New portal saved");
      res.status(201).send(portalData); // Send back the created portal
    } catch (err) {
      console.log(err);
      if (err.isJoi) {
        return res.status(400).send(err.details[0].message); // Joi validation error
      }
      res.status(500).send("Error creating portal"); // General error
    }
  });



  router.put("/admin/portal/:id", verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the _id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send("Invalid Portal ID format");
    }

    // Validate the request body
    await PortalValidation.validateAsync(req.body);

    const updatePortal = {
      PortalName: req.body.PortalName,
      Status: req.body.Status
    };

    const portal = await Portal.findByIdAndUpdate(id, updatePortal, { new: true });
    if (!portal) {
      return res.status(404).send("Portal not found");
    }

    res.send(portal); // Send back the updated portal
  } catch (err) {
    console.log(err);
    if (err.isJoi) {
      return res.status(400).send(err.details[0].message); // Joi validation error
    }
    res.status(500).send("Error updating portal"); // General error
  }
});



  router.put("/admin/portal/:id", verifyAdmin, async (req, res) => {
    try {
      // Validate the request body
      await PortalValidation.validateAsync(req.body);
  
      const updatePortal = {
        PortalName: req.body.PortalName,
        Status: req.body.Status
      };
  
      const portal = await Portal.findByIdAndUpdate(req.params.id, updatePortal, { new: true });
      if (!portal) {
        return res.status(404).send("Portal not found");
      }
  
      res.send(portal); // Send back the updated portal
    } catch (err) {
      console.log(err);
      if (err.isJoi) {
        return res.status(400).send(err.details[0].message); // Joi validation error
      }
      res.status(500).send("Error updating portal"); // General error
    }
  });
  
  router.delete("/admin/portal/:id", verifyAdmin, async (req, res) => {
    try {
      const portal = await Portal.findByIdAndDelete(req.params.id);
      if (!portal) {
        return res.status(404).send("Portal not found");
      }
  
      console.log("Portal deleted");
      res.send(portal); // Send back the deleted portal
  
      // Delete associated projects
      await Project.deleteMany({ portals: portal._id });
      console.log("Associated projects deleted");
    } catch (err) {
      console.log(err);
      res.status(500).send("Error deleting portal"); // General error
    }
  });

  module.exports=router;