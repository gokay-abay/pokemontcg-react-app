import React, { useState, useEffect } from "react"
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

  // can store the id in the redux action and then make a call inside the component
  useEffect(() => {
    const timer = setTimeout(() => {
      setDeckName(deck.name)
      setDeckCards(deck.cards)
      setDeckId(deck._id)
    }, 2000)
    return () => clearTimeout(timer)
  }, [deck])

  // increase the number of an existing card in deck

  // remove existing cards from deck

  //console.log(deck)
  return (
    <div className="container">
      <div className="deck-info-card-list">
        <div className="deck-info">
          <h1></h1>
          <p>{deckName}</p>
          <p>{deckCards.length}</p>
        </div>
        <div className="card-list">{deckCards.map((card, index) => {})}</div>
      </div>
      <div className="search-card">
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
