const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

var countrySchema = new mongoose.Schema({
    CountryID: { type: Number, unique: true }, 
    CountryName: { type: String, required: true },
    states: [{ type: mongoose.Schema.Types.ObjectId, ref: "State" }]
  });
  // countrySchema.plugin(autoIncrement.plugin, {
  //   model: "Country",
  //   field: "CountryID",
  //   startAt: 1,          // Start the auto-increment from 1
  //   incrementBy: 1,      // Increment by 1 each time
  // });

  countrySchema.plugin(AutoIncrement, { inc_field: "CountryID" });

  var Country = mongoose.model("Country", countrySchema);

  module.exports = Country;