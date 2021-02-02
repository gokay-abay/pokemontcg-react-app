import React, { useState, useEffect } from "react"
import { Link, Redirect } from "react-router-dom"
import { connect } from "react-redux"
import { getAllDecks, getDeck } from "../actions/deck"
import Draggable from "react-draggable"

import PropTypes from "prop-types"

const Play = ({
  getAllDecks,
  decks,
  deck,
  getDeck,
  deckLoading,
  decksLoading,
  isAuthenticated,
}) => {
  // ask user to select a deck
  // give them a dropdown with their decks

  // get user decks
  // give user option to select from the menu
  // once clicked we fire getDeck with the selected option's id
  // let user know the it's ready to play

  const [localDeck, setLocalDeck] = useState({
    cards: [],
    name: "",
    id: "",
  })

  const [hand, setHand] = useState([])
  const [zValue, setZValue] = useState(1)
  const [copyDeck, setCopyDeck] = useState({})

  // useEffect(() => {
  // }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!deckLoading) {
        setLocalDeck({
          cards: deck.cards,
          name: deck.name,
          id: deck._id,
        })
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [deck])

  const shuffle = () => {
    let shuffledDeck = localDeck.cards
    if (shuffledDeck.length > 0) {
      for (let i = 0; i < 1000; i++) {
        let location1 = Math.floor(Math.random() * shuffledDeck.length)
        let location2 = Math.floor(Math.random() * shuffledDeck.length)
        let temp = shuffledDeck[location1]
        shuffledDeck[location1] = shuffledDeck[location2]
        shuffledDeck[location2] = temp
      }
    }
    setLocalDeck((prevState) => {
      return {
        ...prevState,
        cards: shuffledDeck,
      }
    })
  }

  // draws the top card from the deck
  const draw = () => {
    let drawnDeck = localDeck.cards
    if (drawnDeck.length > 0) {
      let drawnCard = drawnDeck.shift()
      setLocalDeck((prevState) => {
        return {
          ...prevState,
          cards: drawnDeck,
        }
      })
      setHand([...hand, drawnCard])
    }
  }

  const restart = () => {
    setHand([])
    setZValue(1)
    getDeck(localDeck.id)
  }

  // Brings the card front on click
  // get the element by its id and then increase its z-index by 1
  const bringFront = (cardId) => {
    let elem = document.getElementById(cardId)
    setZValue(zValue + 1)
    elem.style.zIndex = zValue
  }

  //   const handleOptionChange = (e) => {
  //     setCopyDeck(e.target.value)
  //     console.log(copyDeck)
  //   }

  //   const onSubmit = async (e) => {
  //     e.preventDefault()
  //     const timer = setTimeout(() => {
  //       if (deck != null) {
  //         setLocalDeck({
  //           cards: copyDeck.cards,
  //           name: copyDeck.name,
  //           id: copyDeck._id,
  //         })
  //       }
  //     }, 500)
  //   }

  // I need input to ask the user which deck they want
  // get the deck. feed it into the functions.

  if (!isAuthenticated) {
    return <Redirect to="/" />
  }

  return (
    <div className="playmat">
      {/* <form onSubmit={onSubmit}>
        <select
          className="form-control select-item"
          value={deck}
          onChange={handleOptionChange}
        >
          <option>Choose Deck..</option>
          {decks.map((deck) => (
            <option key={deck._id} value={deck} selected>
              {deck.name}
            </option>
          ))}
        </select>
        <input className="btn btn-primary" type="submit" value="Select" />
      </form> */}
      <div className="bench1-placeholder">Bench</div>
      <div className="bench2-placeholder">Bench</div>
      <div className="active-pokemon1-placeholder">Active Pokemon</div>
      <div className="active-pokemon2-placeholder">Active Pokemon</div>
      <div className="discard-pile-placeholder">Discard Pile</div>
      <img
        id="card-back-img"
        draggable="false"
        src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/4f7705ec-8c49-4eed-a56e-c21f3985254c/dah43cy-a8e121cb-934a-40f6-97c7-fa2d77130dd5.png/v1/fill/w_1024,h_1420,strp/pokemon_card_backside_in_high_resolution_by_atomicmonkeytcg_dah43cy-fullview.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3siaGVpZ2h0IjoiPD0xNDIwIiwicGF0aCI6IlwvZlwvNGY3NzA1ZWMtOGM0OS00ZWVkLWE1NmUtYzIxZjM5ODUyNTRjXC9kYWg0M2N5LWE4ZTEyMWNiLTkzNGEtNDBmNi05N2M3LWZhMmQ3NzEzMGRkNS5wbmciLCJ3aWR0aCI6Ijw9MTAyNCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.6Au-hxTt7FuZ5paCMWMJrAiCi-ClaG35bEG2TgGg0VE"
        alt="pokecard"
        width="100px"
      />
      <button onClick={shuffle}>Shuffle</button>
      <button onClick={draw}>Draw</button>
      <button onClick={restart}>Restart</button>
      <div className="hand-div">
        <ul className="list" id="hand-ul">
          {hand.map((card, index) => (
            <Draggable>
              <li
                className="poke-card-game"
                key={index}
                id={index}
                onClick={() => bringFront(index)}
              >
                <img
                  src={card.imageUrl}
                  draggable="false"
                  alt={card.name}
                  width="100px"
                />
              </li>
            </Draggable>
          ))}
        </ul>
      </div>
    </div>
  )
}

Play.propTypes = {
  getDeck: PropTypes.func.isRequired,
  getAllDecks: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  deck: state.deck.deck,
  deckLoading: state.deck.deckLoading,
  isAuthenticated: state.auth.isAuthenticated,
  decks: state.deck.decks,
  decksLoading: state.deck.decksLoading,
})

export default connect(mapStateToProps, { getDeck, getAllDecks })(Play)
