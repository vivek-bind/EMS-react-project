const express =require('express');
const router=express.Router();
const City = require("../models/city");
const State = require("../models/state");
const Company=require("../models/company")
const Joi = require("joi");
const { 
    verifyAdmin, 
    verifyAdminHR, 
    verifyHR, 
    verifyHREmployee, 
    verifyEmployee 
  } = require('../core/middleware'); 



const CityValidation = Joi.object().keys({
    _id: Joi.optional(),
    StateID: Joi.optional(),
    CityName: Joi.string()
      .max(200)
      .required()
  });

  router.get("/city", verifyHR, async (req, res) => {
    try {
      
      const cities = await City.find()
        .populate({ path: "state", populate: { path: "country" } });
      
      res.send(cities); // Send back the list of cities
    } catch (err) {
      console.log(err);
      res.status(500).send("Error fetching cities"); // General error
    }
  });
  
  router.post("/city", verifyHR, async (req, res) => {
    try {
      // Validate the request body
      await CityValidation.validateAsync(req.body);
  
      const newCity = {
        CityName: req.body.CityName,
        state: req.body.StateID
      };
  
      const city = await City.create(newCity);
      const state = await State.findById(req.body.StateID);
  
      if (!state) {
        return res.status(404).send("State not found");
      }
  
      state.cities.push(city);
      await state.save();
  
      console.log("New city saved");
      res.status(201).send(city); // Send back the created city
    } catch (err) {
      console.log(err);
      if (err.isJoi) {
        return res.status(400).send(err.details[0].message); // Joi validation error
      }
      res.status(500).send("Error creating city"); // General error
    }
  });
  
  router.put("/city/:id", verifyHR, async (req, res) => {
    try {
      // Validate the request body
      await CityValidation.validateAsync(req.body);
  
      const updatedCity = {
        CityName: req.body.CityName,
        state: req.body.StateID
      };
  
      const city = await City.findByIdAndUpdate(req.params.id, updatedCity, { new: true });
      if (!city) {
        return res.status(404).send("City not found");
      }
  
      res.send(city); // Send back the updated city
    } catch (err) {
      console.log(err);
      if (err.isJoi) {
        return res.status(400).send(err.details[0].message); // Joi validation error
      }
      res.status(500).send("Error updating city"); // General error
    }
  });
  
  router.delete("/city/:id", verifyHR, async (req, res) => {
    try {
      const companies = await Company.find({ city: req.params.id });
      if (companies.length > 0) {
        return res.status(403).send("This city is associated with a company, so you cannot delete it");
      }
  
      const city = await City.findByIdAndDelete(req.params.id);
      if (!city) {
        return res.status(404).send("City not found");
      }
  
      await State.updateOne(
        { _id: city.state },
        { $pull: { cities: city._id } }
      );
  
      console.log("City deleted");
      res.send(city); // Send back the deleted city
    } catch (err) {
      console.log(err);
      res.status(500).send("Error deleting city"); // General error
    }
  });

  module.exports=router;