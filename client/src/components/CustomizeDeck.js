import React, { useState, useEffect, useCallback } from "react"
import { connect } from "react-redux"
import { getDeck } from "../actions/deck"
import axios from "axios"
import PropTypes from "prop-types"
import { options } from "./inputOptions"
import e from "cors"
import SearchCards from "./SearchCards"

const CustomizeDeck = ({ getDeck, deck, loading }) => {
  const [deckName, setDeckName] = useState("")
  const [deckCards, setDeckCards] = useState([])
  const [deckId, setDeckId] = useState("")
  const [cardCount, setCardCount] = useState(1)
  const [success, setSuccess] = useState("")
  const [deleteLoaded, setDeleteLoaded] = useState(false)
  //   const [selectedCard, setSelectedCard] = useState({})

  // can store the id in the redux action and then make a call inside the component
  useEffect(() => {
    const timer = setTimeout(() => {
      setDeckName(deck.name)
      setDeckCards(deck.cards)
      setDeckId(deck._id)
    }, 500)
    return () => clearTimeout(timer)
  }, [deck])

  let cardIds = []
  deckCards.forEach((card) => {
    cardIds.push(card.id)
  })

  // array that keeps count of unique id occurences
  let counts = {}
  cardIds.forEach((id) => (counts[id] = (counts[id] || 0) + 1))
  console.log(counts)

  // array taht contains uniqueIds
  let unique = cardIds.filter((item, i, ar) => ar.indexOf(item) === i)
  console.log(unique)

  // maps the unique objects in an array to a new array
  const result = []
  const map = new Map()
  for (const item of deckCards) {
    if (!map.has(item.id)) {
      map.set(item.id, true)
      result.push(item)
    }
  }

  // function that takes in the card to get the count from the counts dictionary of that particular card
  const getCardCount = (card) => {
    return counts[card.id]
  }

  // remove existing cards from deck
  const removeCardfromDeck = async (card) => {
    await axios
      .put(`http://localhost:4000/api/decks/removecard/${deckId}`, {
        id: card.id,
      })
      .then(() => getDeck(deckId))
      .catch((err) => console.log(err))
  }

  console.log(deckCards)
  console.log(deck)

  return (
    <div className="container row">
      <div className="deck-info-card-list col-sm-6">
        <div className="deck-info">
          <h1></h1>
          <p>{deckName}</p>
          <p>{deckCards.length}</p>
        </div>
        <div className="card-list">
          <h2>Card list</h2>
          <ul>
            {deckCards
              ? result.map((card, index) => {
                  return (
                    <li key={index}>
                      {/* {() => setSelectedCard(card)} */}
                      <p>
                        {card.name} x
                        {deleteLoaded ? getCardCount(card) : getCardCount(card)}
                      </p>
                      <button onClick={() => removeCardfromDeck(card)}>
                        Delete
                      </button>
                    </li>
                  )
                })
              : "Loading"}
          </ul>
        </div>
      </div>
      <div className="search-card col-sm-6 row">
        <SearchCards deckId={deckId} />
      </div>
    </div>
  )
}

CustomizeDeck.propTypes = {
  getDeck: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  deck: state.deck.deck,
  loading: state.deck.loading,
})

export default connect(mapStateToProps, { getDeck })(CustomizeDeck)
