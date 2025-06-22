require("dotenv").config();  // Load environment variables
const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const Joi = require("joi");

const app = express();

dotenv.config();
app.use(cors());

// Middleware for JSON parsing and handling CORS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Setup CORS middleware

app.use(cors({
  origin: '*', // Allow all origins
  methods: '*', // Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
  allowedHeaders: '*', // Allow all headers
}));

// MongoDB URI
let mongoURI = process.env.DATABASEURL || require("./config.js").DATABASEURL;

if (!mongoURI) {
  console.error("Database URI is missing. Please check your .env or config file.");
  process.exit(1);  // Terminate the application if the DB URI is missing
}

// JWT Key setup
const jwtKey = process.env.JWTKEY || require("./jwtKey.js").jwtKey;

if (!jwtKey) {
  console.error("JWT key is missing. Please check your .env or jwtKey.js.");
  process.exit(1);  // Terminate the application if JWT key is missing
}

// Connect to MongoDB using Mongoose
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
    console.log("Ready to perform database operations");
    // Optionally seed data here
    // seedData();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

  //const { seedData } = require("./seed"); // Adjust the path if needed

  mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to db');
  });
  
  mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
  });
  
  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
  });




const Role=require("./routes/Role");

app.use("/api",Role);

const Employee=require("./routes/Employee");
app.use("/api",Employee);

const Salary=require("./routes/Salary");
app.use("/api",Salary);

const Education=require("./routes/Education");
app.use("/api",Education);

const Company=require("./routes/Company");
app.use("/api",Company);

const Position=require("./routes/Position");
app.use("/api",Position);

const Department=require("./routes/Department");
app.use("/api",Department);

const Portal=require("./routes/Portal");
app.use("/api",Portal);

const Project=require("./routes/Project");
app.use("/api",Project);

const Country=require("./routes/Country");
app.use("/api",Country);

const State=require("./routes/State");
app.use("/api",State);

const PersonalInfo=require("./routes/PersonalInfo");
app.use("/api",PersonalInfo);

const LeaveApplication=require("./routes/LeaveApplication");
app.use("/api",LeaveApplication);

const WorkExperience=require("./routes/WorkExperience");
app.use("/api",WorkExperience);

const UserAccount=require("./routes/UserAccount");
app.use("/api",UserAccount);

const City = require("./routes/City");
app.use("/api",City);
const resetpass = require("./routes/Resetpass.js");
app.use("/api", resetpass);





var port = 4000;
if (process.env.PORT) {
  app.listen(process.env.PORT, process.env.IP, () => {
    console.log("started");
  });
} else
  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
