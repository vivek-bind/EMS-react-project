const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

var portalSchema = new mongoose.Schema({
  CreatedBy: { type: String },
  CreatedDate: { type: Date, default: Date.now },
  Deleted: { type: Boolean },
  ModifiedBy: { type: String },
  ModifiedDate: { type: Date },
  PortalName: { type: String, required: true },
  Status: { type: Number, required: true },
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }]
});


portalSchema.plugin(AutoIncrement, { inc_field: "ID" });

var Portal = mongoose.model("Portal", portalSchema);

module.exports = Portal;
