const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

var departmentSchema = new mongoose.Schema({
  DepartmentName: { type: String, required: true },
  company: [{ type: mongoose.Schema.Types.ObjectId, ref: "Company" }]
});

departmentSchema.plugin(AutoIncrement, { inc_field: "DepartmentID" });

var Department = mongoose.model("Department", departmentSchema);

module.exports = Department;
