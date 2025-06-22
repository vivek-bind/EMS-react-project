// const mongoose = require("mongoose");
// const autoIncrement = require("mongoose-auto-increment");

// var employeeSchema = new mongoose.Schema({
//   FirstName: { type: String, required: true },
//   MiddleName: { type: String, required: true },
//   LastName: { type: String, required: true },
//   Email: { type: String, required: true },
//   Password: { type: String, required: true },
//   Gender: { type: String, required: true },
//   DOB: { type: Date },
//   DateOfJoining: { type: Date },
//   TerminateDate: { type: Date },
//   Deleted: { type: Boolean },
//   Photo: { type: String },
//   ContactNo: { type: String },
//   EmployeeCode: { type: String, required: true },
//   Account: { type: Number },
//   role: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role" }],
//   position: [{ type: mongoose.Schema.Types.ObjectId, ref: "Position" }],
//   department: [{ type: mongoose.Schema.Types.ObjectId, ref: "Department" }],
//   salary: [{ type: mongoose.Schema.Types.ObjectId, ref: "Salary" }],
//   education: [{ type: mongoose.Schema.Types.ObjectId, ref: "Education" }],
//   familyInfo: [{ type: mongoose.Schema.Types.ObjectId, ref: "FamilyInfo" }],
//   workExperience: [{ type: mongoose.Schema.Types.ObjectId, ref: "WorkExperience" }],
//   leaveApplication: [{ type: mongoose.Schema.Types.ObjectId, ref: "LeaveApplication" }],
//   BloodGroup: { type: String },
//   EmergencyContactNo: { type: String },
//   Hobbies: { type: String },
//   PANcardNo: { type: String },
//   PermanetAddress: { type: String },
//   PresentAddress: { type: String }
// });

// employeeSchema.plugin(autoIncrement.plugin, {
//   model: "Employee",
//   field: "EmployeeID",
//   startAt: 1,          // Start the auto-increment from 1
//   incrementBy: 1,      // Increment by 1 each time
// });

// var Employee = mongoose.model("Employee", employeeSchema);

// module.exports = Employee;



// const mongoose = require("mongoose");
// const autoIncrement = require("mongoose-auto-increment");

// const employeeSchema = new mongoose.Schema({
//   FirstName: { type: String, required: true },
//   MiddleName: { type: String, required: true },
//   LastName: { type: String, required: true },
//   Email: { type: String, required: true, unique: true }, // Ensure email is unique
//   Password: { type: String, required: true },
//   Gender: { type: String, required: true },
//   DOB: { type: Date },
//   DateOfJoining: { type: Date },
//   TerminateDate: { type: Date },
//   Deleted: { type: Boolean, default: false }, // Default to false
//   Photo: { type: String },
//   ContactNo: { type: String },
//   EmployeeCode: { type: String, required: true },
//   Account: { type: Number },
//   role: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role" }],
//   position: [{ type: mongoose.Schema.Types.ObjectId, ref: "Position" }],
//   department: [{ type: mongoose.Schema.Types.ObjectId, ref: "Department" }],
//   salary: [{ type: mongoose.Schema.Types.ObjectId, ref: "Salary" }],
//   education: [{ type: mongoose.Schema.Types.ObjectId, ref: "Education" }],
//   familyInfo: [{ type: mongoose.Schema.Types.ObjectId, ref: "FamilyInfo" }],
//   workExperience: [{ type: mongoose.Schema.Types.ObjectId, ref: "WorkExperience" }],
//   leaveApplication: [{ type: mongoose.Schema.Types.ObjectId, ref: "LeaveApplication" }],
//   BloodGroup: { type: String },
//   EmergencyContactNo: { type: String },
//   Hobbies: { type: String },
//   PANcardNo: { type: String },
//   PermanetAddress: { type: String },
//   PresentAddress: { type: String }
// });

// // Auto-increment EmployeeID
// employeeSchema.plugin(autoIncrement.plugin, {
//   model: "Employee",
//   field: "EmployeeID",
//   startAt: 1,
//   incrementBy: 1,
// });

// const Employee = mongoose.model("Employee", employeeSchema);

// module.exports = Employee;

const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const employeeSchema = new mongoose.Schema({
  EmployeeID: { type: Number, unique: true },
  FirstName: { type: String, required: true },
  MiddleName: { type: String },
  LastName: { type: String, required: true },
  Email: { type: String, required: true, unique: true },
  Password: { type: String, required: true },
  Gender: { type: String, required: true },
  DOB: { type: Date, required: true },
  DateOfJoining: { type: Date },
  TerminateDate: { type: Date },
  Deleted: { type: Boolean, default: false },
  Photo: { type: String },
  ContactNo: { type: String},
  EmployeeCode: { type: String, required: true },
  Account: { type: Number },
  role: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role" }],
  position: [{ type: mongoose.Schema.Types.ObjectId, ref: "Position" }],
  department: [{ type: mongoose.Schema.Types.ObjectId, ref: "Department" }],
  salary: [{ type: mongoose.Schema.Types.ObjectId, ref: "Salary" }],
  education: [{ type: mongoose.Schema.Types.ObjectId, ref: "Education" }],
  familyInfo: [{ type: mongoose.Schema.Types.ObjectId, ref: "FamilyInfo" }],
  workExperience: [{ type: mongoose.Schema.Types.ObjectId, ref: "WorkExperience" }],
  leaveApplication: [{ type: mongoose.Schema.Types.ObjectId, ref:"LeaveApplication" }],
  BloodGroup: { type: String },
  EmergencyContactNo: { type: String },
  Hobbies: { type: String },
  PANcardNo: { type: String },
  PermanetAddress: { type: String },
  PresentAddress: { type: String },


});

// Apply AutoIncrement plugin
employeeSchema.plugin(AutoIncrement, { inc_field: "EmployeeID" });


const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;



