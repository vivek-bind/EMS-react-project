const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

var projectSchema = new mongoose.Schema({
  ProjectID: { type: Number, unique: true }, // Use a unique auto-increment field
  CreatedBy: { type: String },
  CreatedDate: { type: Date, default: Date.now },
  Deleted: { type: Boolean },
  EmpFullName: { type: String },
  EstimatedCost: { type: Number },
  EstimatedTime: { type: Number },
  ModifiedBy: { type: String },
  ModifiedDate: { type: Date },
  ProjectDesc: { type: String },
  ProjectTitle: { type: String, required: true },
  ProjectURL: { type: String },
  Remark: { type: String },
  ResourceID: { type: Number },
  Status: { type: Number, required: true },
  portals: [{ type: mongoose.Schema.Types.ObjectId, ref: "Portal" }]
});

// projectSchema.plugin(autoIncrement.plugin, {
//   model: "Project",
//   field: "ID",
//   startAt: 1,          // Start the auto-increment from 1
//   incrementBy: 1,      // Increment by 1 each time
// });
projectSchema.plugin(AutoIncrement, { inc_field: "ProjectID" });

var Project = mongoose.model("Project", projectSchema);

module.exports = Project;
