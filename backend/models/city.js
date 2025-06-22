
const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

var citySchema = new mongoose.Schema({
    CityName: { type: String, required: true },
    state: [{ type: mongoose.Schema.Types.ObjectId, ref: "State" }],
    country: [{ type: mongoose.Schema.Types.ObjectId, ref: "Country" }] // me add this
  });

  citySchema.plugin(AutoIncrement, { inc_field: "CityID" });

  var City = mongoose.model("City", citySchema);
  
  module.exports = City;