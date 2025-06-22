const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

var leaveApplicationSchema = new mongoose.Schema({
  Leavetype: { type: String, required: true },
  FromDate: { type: Date, required: true },
  ToDate: { type: Date, required: true },
  Reasonforleave: { type: String, required: true },
  Status: { type: String, required: true },
  employee: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }]
  //employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" }
  
});
console.log("Applying AutoIncrement Plugin..."); ////////
leaveApplicationSchema.plugin(AutoIncrement, { inc_field: "LeaveApplicationID" });

console.log("Creating Model...");/////////
var LeaveApplication = mongoose.model("LeaveApplication", leaveApplicationSchema);
console.log("Model Successfully Created.");/////////
module.exports = LeaveApplication;
