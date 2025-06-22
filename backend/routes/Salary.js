const express = require('express');
const router = express.Router();
const Role = require("../models/role");
const Employee = require("../models/employee");
const Salary = require("../models/salary"); 
const Joi = require("joi");
const { 
    verifyAdmin, 
    verifyAdminHR, 
    verifyHR, 
    verifyHREmployee, 
    verifyEmployee 
} = require('../core/middleware'); 

const SalaryValidation = Joi.object().keys({
  BasicSalary: Joi.string()
    .max(20)
    .required(),
  BankName: Joi.string()
    .max(200)
    .required(),
  AccountNo: Joi.string()
    .max(200)
    .required(),
  AccountHolderName: Joi.string()
    .max(200)
    .required(),
  IFSCcode: Joi.string()
    .max(200)
    .required(),
  TaxDeduction: Joi.string()
    .max(100)
    .required()
});

// Get salary information for all employees
router.get("/salary", verifyHR, async (req, res) => {
    try {
        const employees = await Employee.find()
            .populate({ path: "salary" })
            .select("FirstName LastName MiddleName");

        // Filter employees with exactly one salary entry
        const filteredEmployees = employees.filter(data => data.salary.length === 1);
        res.send(filteredEmployees); // Send back the filtered list of employees
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching salaries"); // General error
    }
});

// Create a new salary entry for an employee
router.post("/salary/:id", verifyHR, async (req, res) => {
    try {
        // Validate the request body
        await SalaryValidation.validateAsync(req.body);

        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).send("Employee not found");
        }

        if (employee.salary.length === 0) {
            const newSalary = {
                BasicSalary: req.body.BasicSalary,
                BankName: req.body.BankName,
                AccountNo: req.body.AccountNo,
                AccountHolderName: req.body.AccountHolderName,
                IFSCcode: req.body.IFSCcode,
                TaxDeduction: req.body.TaxDeduction
            };

            const salary = await Salary.create(newSalary);
            employee.salary.push(salary);
            await employee.save();

            console.log("New salary saved");
            res.status(201).send(salary); // Send back the created salary
        } else {
            res.status(403).send("Salary information for this employee already exists");
        }
    } catch (err) {
        console.error(err);
        if (err.isJoi) {
            return res.status(400).send(err.details[0].message); // Joi validation error
        }
        res.status(500).send("Error creating salary"); // General error
    }
});

// Update an existing salary entry
router.put("/salary/:id", verifyHR, async (req, res) => {
    try {
        // Validate the request body
        await SalaryValidation.validateAsync(req.body);

        const updatedSalary = {
            BasicSalary: req.body.BasicSalary,
            BankName: req.body.BankName,
            AccountNo: req.body.AccountNo,
            AccountHolderName: req.body.AccountHolderName,
            IFSCcode: req.body.IFSCcode,
            TaxDeduction: req.body.TaxDeduction
        };

        const salary = await Salary.findByIdAndUpdate(req.params.id, updatedSalary, { new: true });
        if (!salary) {
            return res.status(404).send("Salary not found");
        }

        res.send(salary); // Send back the updated salary
    } catch (err) {
        console.error(err);
        if (err.isJoi) {
            return res.status(400).send(err.details[0].message); // Joi validation error
        }
        res.status(500).send("Error updating salary"); // General error
    }
});

// Delete a salary entry
router.delete("/salary/:id", verifyHR, async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).send("Employee not found");
        }

        if (employee.salary.length === 0) {
            return res.status(404).send("No salary information found for this employee");
        }

        const salaryId = employee.salary[0]; // Assuming there's only one salary
        const salary = await Salary.findByIdAndRemove(salaryId);
        if (!salary) {
            return res.status(404). send("Salary not found");
        }

        // Remove the salary reference from the employee
        employee.salary.pull(salaryId);
        await employee.save();

        console.log("Salary deleted");
        res.send(salary); // Send back the deleted salary
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting salary"); // General error
    }
});

module.exports = router;