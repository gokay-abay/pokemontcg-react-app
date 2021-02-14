const express = require("express")
const connectDB = require("./config/db")
const cors = require("cors")
const path = require("path")
const io = require("socket.io")({
  cors: {
    origin: "*",
  },
})

const app = express()

// Connect Database
connectDB()

// cors middleware
app.use(cors())
// Init Middleware
app.use(express.json({ extended: false }))

// Define routes

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
// app.get("/addCardToDeck", (req, res) => {
//   Deck.findOneAndUpdate(
//     { name: "Electric" },
//     { $push: { cards: pikachuCard } },
//     { useFindAndModify: false },
//     (err, found) => {
//       if (!err) console.log("the card is inserted")
//     }
//   )
// })

// app.get("/getUser", (req, res) => {
//   // Deck.findById({ user: user._id }, (err, found) => {
//   //   if (!err) console.log(found)
//   //   else console.log(err)
//   // })
// })

// on connection emit the socket id so that client knows what to render
io.on("connection", (socket) => {
  console.log(`Socket ${socket.id} connected`)

  // on create event send the socket id to the client
  socket.on("createGame", () => {
    io.emit("resSocketId", socket.id)
  })

  socket.on("activePkmn", (card) => {
    socket.broadcast.emit("backActivePkmn", card)
  })
  // socket.on("activePkmn", (card, socketId) => {
  //   io.emit("backActivePkmn", (card, socketId))
  // })
})

// io.on("activePkmn", (socket) => {
//   socket.emit("activePkmn", socket)
// })

app.use("/api/auth", require("./routes/api/auth"))
app.use("/api/users", require("./routes/api/users"))
app.use("/api/decks", require("./routes/api/decks"))

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set Static folder
  app.use(express.static("client/build"))

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  })
}

// import the Search class and the fetch api method
// port
const PORT = process.env.PORT || 4000

// create server
const server = app.listen(PORT, () =>
  console.log(`Server is running on port ${PORT}`)
)

// listen server with io
io.listen(server)
