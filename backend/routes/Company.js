
const express =require('express');
const router=express.Router();
const Company = require("../models/company");
const Joi = require("joi");
const { 
    verifyAdmin, 
    verifyAdminHR, 
    verifyHR, 
    verifyHREmployee, 
    verifyEmployee 
  } = require('../core/middleware'); 

const CompanyValidation = Joi.object().keys({
  _id: Joi.optional(),
  CityID: Joi.optional(),
  CompanyName: Joi.string()
    .max(200)
    .required(),
  Address: Joi.string()
    .max(2000)
    .required(),
  PostalCode: Joi.number()
    .max(999999)
    .required(),
  Website: Joi.string()
    .max(2000)
    .required(),
  Email: Joi.string()
    .max(1000)
    .required(),
  ContactPerson: Joi.string()
    .max(200)
    .required(),
  ContactNo: Joi.string()
    .max(20)
    .required(),
  FaxNo: Joi.string()
    .max(100)
    .required(),
  PanNo: Joi.string()
    .max(200)
    .required(),
  GSTNo: Joi.string()
    .max(200)
    .required(),
  CINNo: Joi.string()
    .max(200)
    .required(),
  Deleted: Joi.optional()
});


router.get("/company", verifyAdminHR, async (req, res) => {
    try {
      const companies = await Company.find().populate({
        path: "city",
        populate: {
          path: "state",
          model: "State",
          populate: {
            path: "country",
            model: "Country"
          }
        }
      });
      res.send(companies); // Send back the list of companies
    } catch (err) {
      console.log(err);
      res.status(500).send("Error fetching companies"); // General error
    }
  });
  
  router.post("/company", verifyHR, async (req, res) => {
    try {
      // Validate the request body
      await CompanyValidation.validateAsync(req.body);
  
      const newCompany = {
        CompanyName: req.body.CompanyName,
        Address: req.body.Address,
        city: req.body.CityID,
        PostalCode: req.body.PostalCode,
        Website: req.body.Website,
        Email: req.body.Email,
        ContactPerson: req.body.ContactPerson,
        ContactNo: req.body.ContactNo,
        FaxNo: req.body.FaxNo,
        PanNo: req.body.PanNo,
        GSTNo: req.body.GSTNo,
        CINNo: req.body.CINNo
      };
  
      const company = await Company.create(newCompany);
      res.status(201).send(company); // Send back the created company
      console.log("New company saved");
    } catch (err) {
      console.log(err);
      if (err.isJoi) {
        return res.status(400).send(err.details[0].message); // Joi validation error
      }
      res.status(500).send("Error creating company"); // General error
    }
  });
  
  router.put("/company/:id", verifyHR, async (req, res) => {
    try {
      // Validate the request body
      await CompanyValidation.validateAsync(req.body);
  
      const updatedCompany = {
        CompanyName: req.body.CompanyName,
        Address: req.body.Address,
        city: req.body.CityID,
        PostalCode: req.body.PostalCode,
        Website: req.body.Website,
        Email: req.body.Email,
        ContactPerson: req.body.ContactPerson,
        ContactNo: req.body.ContactNo,
        FaxNo: req.body.FaxNo,
        PanNo: req.body.PanNo,
        GSTNo: req.body.GSTNo,
        CINNo: req.body.CINNo
      };
  
      const company = await Company.findByIdAndUpdate(req.params.id, updatedCompany, { new: true });
      if (!company) {
        return res.status(404).send("Company not found");
      }
      res.send(company); // Send back the updated company
    } catch (err) {
      console.log(err);
      if (err.isJoi) {
        return res.status(400).send(err.details[0].message); // Joi validation error
      }
      res.status(500).send("Error updating company"); // General error
    }
  });

  module.exports=router;