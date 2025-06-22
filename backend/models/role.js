const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

var roleSchema = new mongoose.Schema({
  RoleName: { type: String, required: true },
  company: [{ type: mongoose.Schema.Types.ObjectId, ref: "Company" }]
});

roleSchema.plugin(AutoIncrement, { inc_field: "RoleID" });
var Role = mongoose.model("Role", roleSchema);

module.exports = Role;
