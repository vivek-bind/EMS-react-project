const express =require('express');
const router=express.Router();
const Country = require("../models/country");
const State=require("../models/state");
const Joi = require("joi");
const { 
    verifyAdmin, 
    verifyAdminHR, 
    verifyHR, 
    verifyHREmployee, 
    verifyEmployee 
  } = require('../core/middleware'); 

const CountryValidation = Joi.object().keys({
  _id: Joi.optional(),
  CountryID: Joi.optional(),
  CountryName: Joi.string()
    .max(200)
    .required()
});



router.get("/country", verifyHR, async (req, res) => {
    try {
      const countries = await Country.find()
        .populate({ path: "states", populate: { path: "cities" } });
      res.send(countries); // Send back the list of countries
    } catch (err) {
      console.log(err);
      res.status(500).send("Error fetching countries"); // General error
    }
  });
  
  router.post("/country", verifyHR, async (req, res) => {
    try {
      // Validate the request body
      await CountryValidation.validateAsync(req.body);
  
      const newCountry = {
        CountryName: req.body.CountryName
      };
  
      const country = await Country.create(newCountry);
      console.log("New country saved");
      res.status(201).send(country); // Send back the created country
    } catch (err) {
      console.log(err);
      if (err.isJoi) {
        return res.status(400).send(err.details[0].message); // Joi validation error
      }
      res.status(500).send("Error creating country"); // General error
    }
  });
  
  router.put("/country/:id", verifyHR, async (req, res) => {
    try {
      // Validate the request body
      await CountryValidation.validateAsync(req.body);
  
      const updatedCountry = {
        CountryName: req.body.CountryName
      };
  
      const country = await Country.findByIdAndUpdate(req.params.id, updatedCountry, { new: true });
      if (!country) {
        return res.status(404).send("Country not found");
      }
  
      res.send(country); // Send back the updated country
    } catch (err) {
      console.log(err);
      if (err.isJoi) {
        return res.status(400).send(err.details[0].message); // Joi validation error
      }
      res.status(500).send("Error updating country"); // General error
    }
  });
  
  router.delete("/country/:id", verifyHR, async (req, res) => {
    try {
      const foundCountry = await Country.findById(req.params.id);
      if (!foundCountry) {
        return res.status(404).send("Country not found");
      }
  
      if (foundCountry.states.length > 0) {
        return res.status(403).send("First delete all the states in this country before deleting this country");
      }
  
      const country = await Country.findByIdAndDelete(req.params.id);
      if (!country) {
        return res.status(404).send("Country not found");
      }
  
      // Delete associated states and cities
      await State.deleteMany({ country: req.params.id });
      await City.deleteMany({ state: { country: req.params.id } });
  
      console.log("Country deleted");
      res.send(country); // Send back the deleted country
    } catch (err) {
      console.log(err);
      res.status(500).send("Error deleting country"); // General error
    }
  });

  module.exports=router;