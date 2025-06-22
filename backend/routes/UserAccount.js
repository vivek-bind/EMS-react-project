
const express =require('express');
const router=express.Router();
const Employee = require("../models/employee");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
// JWT Key setup
const jwtKey = process.env.JWTKEY || require("./jwtKey.js").jwtKey;

if (!jwtKey) {
  console.error("JWT key is missing. Please check your .env or jwtKey.js.");
  process.exit(1);  // Terminate the application if JWT key is missing
}

router.post("/login", async (req, res) => {
    try {
      const schema = Joi.object({
        email: Joi.string().max(200).required(),
        password: Joi.string().max(100).required(),
      });
  
      const { error } = schema.validate(req.body);
      if ( error) {
        console.log(error);
        return res.status(400).send(error.details[0].message);
      }
  
      const document = await Employee.findOne({ Email: req.body.email });
      if (!document) {
        return res.status(404).send("Employee not found");
      }
  
      if (document.Password === req.body.password) {
        const emp = {
          _id: document._id,
          Account: document.Account,
          FirstName: document.FirstName,
          LastName: document.LastName,
        };
  
        const token = jwt.sign(emp, jwtKey);
        return res.send(token);
      } else {
        return res.sendStatus(400); // Invalid password
      }
    } catch (err) {
      console.error("Error during login:", err);
      return res.status(500).send("Internal server error");
    }
  });


  module.exports=router;