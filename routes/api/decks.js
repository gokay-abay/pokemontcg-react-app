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
    //   const errors = validationResult(req)
    //   if (!errors.isEmpty()) {
    //     return res.status(400).json({ errors: errors.array() })
    //   }

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

module.exports = router
