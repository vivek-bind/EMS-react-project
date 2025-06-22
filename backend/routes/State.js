const express =require('express');
const router=express.Router();
const State = require("../models/state");
const Country = require("../models/country"); // Import the Country model
const Joi = require("joi");
const { 
    verifyAdmin, 
    verifyAdminHR, 
    verifyHR, 
    verifyHREmployee, 
    verifyEmployee 
  } = require('../core/middleware'); 
  
const StateValidation = Joi.object().keys({
    _id: Joi.optional(),
    CountryID: Joi.optional(),
    StateName: Joi.string()
      .max(200)
      .required()
  });
  



router.get("/state", verifyHR, async (req, res) => {
  try {
    const states = await State.find()//.populate("country cities");
    .populate({ path: "country" });
    res.send(states); // Send back the list of states
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching states"); // General error
  }
});

router.post("/state", verifyHR, async (req, res) => {
  try {
    // Validate the request body
    await StateValidation.validateAsync(req.body);

    const newState = {
      StateName: req.body.StateName,
      country: req.body.CountryID
    };

    const state = await State.create(newState);
    console.log("New state saved");

    const country = await Country.findById(req.body.CountryID);
    if (!country) {
      return res.status(404).send("Country not found");
    }

    country.states.push(state);
    await country.save();

    res.status(201).send(state); // Send back the created state
  } catch (err) {
    console.log(err);
    if (err.isJoi) {
      return res.status(400).send(err.details[0].message); // Joi validation error
    }
    res.status(500).send("Error creating state"); // General error
  }
});

router.put("/state/:id", verifyHR, async (req, res) => {
  try {
    // Validate the request body
    await StateValidation.validateAsync(req.body);

    const updatedState = {
      StateName: req.body.StateName,
      country: req.body.CountryID
    };

    const state = await State.findByIdAndUpdate(req.params.id, updatedState, { new: true });
    if (!state) {
      return res.status(404).send("State not found");
    }

    res.send(state); // Send back the updated state
  } catch (err) {
    console.log(err);
    if (err.isJoi) {
      return res.status(400).send(err.details[0].message); // Joi validation error
    }
    res.status(500).send("Error updating state"); // General error
  }
});

router.delete("/state/:id", verifyHR, async (req, res) => {
  try {
    const foundState = await State.findById(req.params.id);
    console.log("state found");
    if (!foundState) {
      return res.status(404).send("State not found");
    }

    if (foundState.cities.length > 0) {
      return res.status(403).send("First delete all the cities in this state before deleting this state");
    }

    const state = await State.findByIdAndDelete(req.params.id);
    if (!state) {
      return res.status(404).send("State not found");
    }

    await Country.updateOne(
      { _id: state.country },
      { $pull: { states: state._id } }
    );

    console.log("State deleted");
    res.send(state); // Send back the deleted state
  } catch (err) {
    console.log(err);
    res.status(500).send("Error deleting state"); // General error
  }
});


module.exports=router;