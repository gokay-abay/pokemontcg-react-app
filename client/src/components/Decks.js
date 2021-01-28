import React, { useEffect } from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { getDecks } from "../actions/deck"

const Decks = ({ getDecks, decks, loading }) => {
  // get all the decks that belong to the user
  // create an action that fetches all the decks. Call that action upon this component is rendered.
  // We want Decks data as a state. once have the data store it in a local array and map the contents

  // make a post request to create a new deck

  // make a delete request to delete a deck
  useEffect(() => {
    getDecks()
  }, [])

  // display user decks

  // Customize button will only take the user to the customize a deck page
  return (
    <div>
      <h1>Decks Dashboard</h1>
      {!loading &&
        decks.map((deck) => {
          return <h1>{deck.name}</h1>
        })}
    </div>
  )
}

Decks.propTypes = {
  getDecks: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  decks: state.deck.decks,
  loading: state.deck.loading,
})

export default connect(mapStateToProps, { getDecks })(Decks)
