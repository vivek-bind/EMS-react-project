const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

var familyInfoSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  Relationship: { type: String, required: true },
  DOB: { type: Date, required: true },
  Occupation: { type: String, required: true }
});

familyInfoSchema.plugin(AutoIncrement, { inc_field: "FamilyInfoID" });

var FamilyInfo = mongoose.model("FamilyInfo", familyInfoSchema);

module.exports = FamilyInfo;
