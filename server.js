const express = require("express")
const connectDB = require("./config/db")
const User = require("./models/User")
const Deck = require("./models/Deck")
const { default: axios } = require("axios")
const { db } = require("./models/User")
const cors = require("cors")

const app = express()

// Connect Database
connectDB()

// cors middleware
app.use(cors())
// Init Middleware
app.use(express.json({ extended: false }))

// Define routes

const user = new User({
  name: "Gokay Abay",
  email: "test@email.com",
  password: "123456",
})

// user.save()

// var pikachuCard = ""
// axios
//   .get("https://api.pokemontcg.io/v1/cards?setCode=base1&name=pikachu")
//   .then((res) => {
//     pikachuCard = JSON.stringify(res.data.cards[0])
//   })
//   .then(() => run())

//create deck
// const createDeck = function (deck) {
//   Deck.create(deck).then((docDeck) => {
//     return docDeck
//   })
// }

// const run = async function () {
//   var deck = await createDeck({
//     user: user._id,
//     name: "Fire",
//     cards: [],
//   })
// }

// add deck to user user
// const addDeckToUser = (deckId, userId) => {
//   return Deck.findByIdAndUpdate(
//     deckId,
//     { user: userId },
//     { new: true, useFindAndModify: false }
//   )
// }

// insert a card to the database
app.get("/addCardToDeck", (req, res) => {
  Deck.findOneAndUpdate(
    { name: "Electric" },
    { $push: { cards: pikachuCard } },
    { useFindAndModify: false },
    (err, found) => {
      if (!err) console.log("the card is inserted")
    }
  )
})

app.get("/getUser", (req, res) => {
  // Deck.findById({ user: user._id }, (err, found) => {
  //   if (!err) console.log(found)
  //   else console.log(err)
  // })
})

app.use("/api/auth", require("./routes/api/auth"))
app.use("/api/users", require("./routes/api/users"))
app.use("/api/decks", require("./routes/api/decks"))

// import the Search class and the fetch api method
// port
const PORT = process.env.PORT || 4000

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
