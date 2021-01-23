/*
do we need to destructure the card object?
not really I think i can just store the whole object

*/

const mongoose = require("mongoose")

const DeckSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  name: {
    type: String,
    required: true,
  },

  // array of string objects
  // cards is just the name of the field
  cards: [],
})

module.exports = Deck = mongoose.model("deck", DeckSchema)
