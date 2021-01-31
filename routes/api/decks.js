const express = require("express")
const router = express.Router()
const auth = require("../../middleware/auth")
const User = require("../../models/User")
const Deck = require("../../models/Deck")
const jwt = require("jsonwebtoken")
const config = require("config")
const { check, validationResult } = require("express-validator")

// @route   GET api/decks
// @desc    GET all decks
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password")
    console.log(user.id)

    let decks = await Deck.find({ user: user.id }, (err, found) => {
      if (!err) res.send(found)
      else console.log(err)
    })
  } catch (error) {}
})

// @route   GET api/decks/:id
// @desc    GET deck by ID
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const deck = await Deck.findById(req.params.id)

    if (!deck) {
      return res.status(404).json({ msg: "Deck not found" })
    }

    res.json(deck)
  } catch (err) {
    console.log(err.message)
    res.status(500).send("Server Error")
  }
})

// @route   DELETE api/decks/:id
// @desc    Delete a deck
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const deck = await Deck.findById(req.params.id)

    if (!deck) {
      return res.status(404).json({ msg: "Deck not found" })
    }

    await deck.remove()
    res.json({ msg: "Deck removed" })
  } catch (err) {}
})

// @route   POST api/decks/
// @desc    Create a deck
// @access  Private
router.post(
  "/",
  auth,
  check("name", "Name is required").not().isEmpty(),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      const user = await User.findById(req.user.id).select("-password")

      const newDeck = new Deck({
        user: user.id,
        name: req.body.name,
        cards: [],
      })

      const deck = await newDeck.save()
      res.json(deck)
    } catch (err) {
      console.log(err.message)
      res.status(500).send("Server Error")
    }
  }
)

// @route   PUT api/decks/:id
// @desc    Update deck with new cards
// @access  Private

router.put("/:id", auth, async (req, res) => {
  try {
    const deck = await Deck.findById(req.params.id)

    if (!deck) {
      return res.status(404).json({ msg: "Deck not found" })
    }

    const cards = req.body.cards

    if (cards == null) {
      return res.status(404).json({ msg: "Can not add null values" })
    }

    deck.cards = cards
    await deck.save()
    return res.json(deck)
  } catch (err) {
    res.status(500).send("Server Error")
  }
})

// @route   PUT api/decks/:id
// @desc    Add a card to deck
// @access  Private
router.put("/addcard/:id", auth, async (req, res) => {
  try {
    const deck = await Deck.findById(req.params.id)

    if (!deck) {
      return res.status(404).json({ msg: "Deck not found" })
    }

    const card = req.body.card

    if (card == null) {
      return res.status(404).json({ msg: "Can not add null values" })
    }
    // if the card id exists and if it is more than 4 copies of it exists and if it is not an energy then store the card in the array

    const updatedDeck = await Deck.findByIdAndUpdate(
      { _id: deck.id },
      { $push: { cards: card } },
      { useFindAndModify: false }
    )
    return res.json(card)
  } catch (err) {
    console.log(err.message)
    res.status(500).send("Server error")
  }
})

// @route   PUT api/decks/:id
// @desc    Delete a card from deck
// @access  Private
router.put("/removecard/:id", auth, async (req, res) => {
  try {
    // find the card by its id in the array and remove it
    const deck = await Deck.findById(req.params.id)

    if (!deck) {
      return res.status(404).json({ msg: "Deck not found" })
    }

    // const name = req.body.name
    //console.log(deck.cards)

    // Deck.findByIdAndUpdate(
    //   { _id: deck.id },
    //   { $pull: { cards: name } },
    //   { useFindAndModify: false },
    //   (err, updated) => {
    //     if (!err) console.log("success")
    //     else console.log("fail")
    //   }
    // )

    // deck.cards.filter((card) => {
    //   card === req.body.name
    // })
    // found.cards.forEach((card, index) => {
    //     if (card.id === req.body.id) {
    //       const spliced = found.cards.splice(index, 1)
    //       console.log("delete request run")
    //       return
    //     }
    //   }

    const id = req.body.id

    for (let i = 0; i < deck.cards.length; i++) {
      if (deck.cards[i].id === id) {
        const spliced = deck.cards.splice(i, 1)
        deck.save()
        return res.status(200).json(spliced)
      }
    }
    return res.json(deck.cards)
  } catch (err) {
    console.error(err.message)
    return res.status(500).send("Server Error")
  }
})

// @route   PUT api/deckname/:id
// @desc    change deck name
// @access  Private
router.put("/newdeckname/:id", auth, async (req, res) => {
  try {
    const deck = await Deck.findById(req.params.id)

    if (!deck) {
      return res.status(404).json({ msg: "Deck not found" })
    }
    const newDeckname = req.body.deckName
    deck.name = newDeckname
    await deck.save()
    return res.json(deck.name)
  } catch (err) {
    console.log(err.message)
    return res.status(500).send("Server Error")
  }
})

// @route   PUT api/removeallcards/:id
// @desc    Remove all cards from deck
// @access  Private
router.put("/removeallcards/:id", auth, async (req, res) => {
  try {
    const deck = await Deck.findById(req.params.id)
    if (!deck) {
      return res.status(404).json({ msg: "Deck not found" })
    }
    deck.cards = []
    await deck.save()
    return res.json(deck.cards)
  } catch (err) {
    console.log(err.message)
    return res.status(500).send("Server Error")
  }
})

module.exports = router
