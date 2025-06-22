const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

var positionSchema = new mongoose.Schema({
  PositionName: { type: String, required: true },
  company: [{ type: mongoose.Schema.Types.ObjectId, ref: "Company" }]
});


positionSchema.plugin(AutoIncrement, { inc_field: "PositionID" });

var Position = mongoose.model("Position", positionSchema);

module.exports = Position;
