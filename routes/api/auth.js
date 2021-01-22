const express = require("express")
const router = express.Router()
const auth = require("../../middleware/auth")
const User = require("../../models/User")
const jwt = require("jsonwebtoken")
const config = require("config")
const { check, validationResult } = require("express-validator")
const bcrypt = require("bcryptjs")

// @route GET api/auth
// @desc Test route
// @access Public
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password")
    res.json(user)
  } catch (err) {
    console.log(err.message)
    res.status(500).send("Server Error")
  }
})

// @route GET api/auth
// @desc Test authenticate user & get token
// @access Public
router.post("/", async (req, res) => {
  const { email, password } = req.body

  try {
    let user = await User.findOne({ email })

    // See if user exists
    if (!user) {
      return res.status(400).json({ errors: [{ msg: "invalid credentials" }] })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: "no credentials" }] })
    }

    // if (password !== user.password) {
    //   return res.status(400).json({ errors: [{ msg: "invalid credentials" }] })
    // }

    // return json webtoken
    const payload = {
      user: {
        id: user.id,
      },
    }

    jwt.sign(
      payload,
      config.get("jwtSecret"),
      {
        expiresIn: 360000,
      },
      (err, token) => {
        if (err) throw err
        res.json({ token })
      }
    )
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

module.exports = router
