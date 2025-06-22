const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

var stateSchema = new mongoose.Schema({
    StateID: { type: Number, unique: true }, 
    StateName: { type: String, required: true },
    country: [{ type: mongoose.Schema.Types.ObjectId, ref: "Country" }],
    cities: [{ type: mongoose.Schema.Types.ObjectId, ref: "City" }]
  });
  // stateSchema.plugin(autoIncrement.plugin, {
  //   model: "State",
  //   field: "StateID",
  //   startAt: 1,          // Start the auto-increment from 1
  //   incrementBy: 1,      // Increment by 1 each time
  // });
  
  stateSchema.plugin(AutoIncrement, { inc_field: "StateID" });
  
  var State = mongoose.model("State", stateSchema);

  module.exports = State;
