import React, { useState, useEffect } from "react"
import { Link, Redirect } from "react-router-dom"
import { connect } from "react-redux"
import { getDeck, addCardToDeck } from "../actions/deck"
import axios from "axios"
import PropTypes from "prop-types"
import e from "cors"
import SearchCards from "./SearchCards"

const CustomizeDeck = ({
  getDeck,
  addCardToDeck,
  addedCards,
  deck,
  deckLoading,
  auth: { isAuthenticated, loading },
}) => {
  const [localDeck, setLocalDeck] = useState({
    cards: [],
    name: "",
    id: "",
  })
  const [localAddedCards, setLocalAddedCards] = useState(addedCards)
  // can store the id in the redux action and then make a call inside the component

  useEffect(() => {
    const timer = setTimeout(() => {
      if (deck !== null) {
        setLocalDeck({
          cards: deck.cards,
          name: deck.name,
          id: deck._id,
        })
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [deck])

  //  when the addedCards get updated run this useEffect
  // The avoid the first execution of deck update we need to check if the addedCards has a value.
  // if it doesn't have a value it means add to card is not clicked. don't do anything
  // if it does have a value it might be a new or an old value.
  // store every value locally to see if the value is new or not

  useEffect(() => {
    // if addedCards is not null run this piece of logic
    if (addedCards !== null && addedCards !== localAddedCards) {
      setLocalAddedCards(addedCards)
      setLocalDeck((prevState) => {
        return {
          ...prevState,
          cards: [...prevState.cards, ...addedCards],
        }
      })
    }
  }, [addedCards])

  // for the number of added card array run a for loop
  // find the id and index of the card which is to be incread in number
  // insert the new card in that index possibly slice method
  //

  // I have two cards to add to the local deck. When should I run the function that add these to the deck. When add button is clicked I can fire some bool to do that

  // array that keeps count of unique id occurences

  // array taht contains uniqueIds
  //let unique = cardIds.filter((item, i, ar) => ar.indexOf(item) === i)

  // maps the unique objects in an array to a new array
  const result = []
  const map = new Map()
  for (const item of localDeck.cards) {
    if (!map.has(item.id)) {
      map.set(item.id, true)
      result.push(item)
    }
  }

  // function that takes in the card to get the count from the counts dictionary of that particular card
  const getCardCount = (card) => {
    let cardIds = []
    let counts = {}
    localDeck.cards.forEach((card) => cardIds.push(card.id))
    cardIds.forEach((id) => (counts[id] = (counts[id] || 0) + 1))
    return counts[card.id]
  }

  // remove existing cards from deck
  const removeCardfromDeck = (card) => {
    let splicedCards = localDeck.cards
    for (let i = 0; i < localDeck.cards.length; i++) {
      if (localDeck.cards[i].id === card.id) {
        splicedCards.splice(i, 1)
        setLocalDeck((prevState) => {
          return {
            ...prevState,
            cards: splicedCards,
          }
        })
        return
      }
    }
  }

  // Save the localDeck to database
  const onSubmit = async (e) => {
    e.preventDefault()
    await axios
      .put(`/api/decks/${localDeck.id}`, {
        cards: localDeck.cards,
      })
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
  }

  // Reset Changes
  const resetChanges = () => {
    getDeck(localDeck.id)
  }

  if (!isAuthenticated) {
    return <Redirect to="/" />
  }

  const { cards, name, id } = localDeck

  return (
    <div className="customize-div container">
      <div className="deck-info-card-list col-sm-6">
        <div className="deck-info">
          <h1></h1>
          <h1>{name}</h1>
          <p>Number of Cards: {cards.length}</p>
        </div>

        <div className="card-list-div">
          <h3>Card list</h3>
          <form id="save-changes-form" onSubmit={onSubmit}>
            <input
              className="btn btn-dark"
              type="button"
              value="Cancel"
              onClick={resetChanges}
            />
            <input
              className="btn btn-primary"
              type="submit"
              value="Save Changes"
            />
          </form>
          <ul id="card-list">
            {cards
              ? result.map((card, index) => {
                  return (
                    <li key={index}>
                      <img src={card.imageUrl} alt={card.name} width="50px" />
                      <p>
                        <span>{card.name}</span> x{getCardCount(card)}
                      </p>
                      <div className="btn-div">
                        <button
                          className="btn btn-success"
                          onClick={() => addCardToDeck(card, 1)}
                        >
                          <i class="fas fa-plus"></i>
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => removeCardfromDeck(card)}
                        >
                          <i class="fas fa-minus"></i>
                        </button>
                      </div>
                    </li>
                  )
                })
              : "Loading"}
          </ul>
        </div>
      </div>
      <div className="search-card col-sm">
        <SearchCards deckId={id} />
      </div>
    </div>
  )
}

CustomizeDeck.propTypes = {
  getDeck: PropTypes.func.isRequired,
  addCardToDeck: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  deck: state.deck.deck,
  loading: state.deck.loading,
  addedCards: state.deck.addedCards,
  auth: state.auth,
})

export default connect(mapStateToProps, { getDeck, addCardToDeck })(
  CustomizeDeck
)
