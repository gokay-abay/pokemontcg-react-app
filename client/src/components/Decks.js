import React, { useEffect, useState } from "react"
import { Link, Redirect } from "react-router-dom"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { getAllDecks, getDeck } from "../actions/deck"
import axios from "axios"
import e from "cors"

const Decks = ({ getAllDecks, getDeck, decks, loading }) => {
  const [deckName, setDeckName] = useState("")
  // get all the decks that belong to the user
  // create an action that fetches all the decks. Call that action upon this component is rendered.
  // We want Decks data as a state. once have the data store it in a local array and map the contents
  useEffect(() => {
    getAllDecks()
  }, [])

  const onChange = (e) => {
    setDeckName(e.target.value)
  }

  // make a post request to create a new deck
  const onSubmit = async () => {
    await axios
      .post("http://localhost:4000/api/decks", {
        name: deckName,
      })
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
  }

  // make a delete request to delete a deck
  const deleteDeck = async (e) => {
    await axios
      .delete(`http://localhost:4000/api/decks/${e.target.value}`)
      .then(() => getAllDecks())
      .catch((err) => console.log(err))
  }

  // Customize button will only take the user to the customize a deck page
  // get a fetch request to get the deck that was requested by the user
  const onClick = async (e) => {
    const id = e.target.value
    getDeck(id)
  }

  return (
    <div className="container">
      <h1>Decks Dashboard</h1>
      {!loading &&
        decks.map((deck) => {
          return (
            <div className="container row" key={deck._id}>
              <div className="card-back">
                <img
                  src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/4f7705ec-8c49-4eed-a56e-c21f3985254c/dah43cy-a8e121cb-934a-40f6-97c7-fa2d77130dd5.png/v1/fill/w_1024,h_1420,strp/pokemon_card_backside_in_high_resolution_by_atomicmonkeytcg_dah43cy-fullview.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3siaGVpZ2h0IjoiPD0xNDIwIiwicGF0aCI6IlwvZlwvNGY3NzA1ZWMtOGM0OS00ZWVkLWE1NmUtYzIxZjM5ODUyNTRjXC9kYWg0M2N5LWE4ZTEyMWNiLTkzNGEtNDBmNi05N2M3LWZhMmQ3NzEzMGRkNS5wbmciLCJ3aWR0aCI6Ijw9MTAyNCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.6Au-hxTt7FuZ5paCMWMJrAiCi-ClaG35bEG2TgGg0VE"
                  alt="pokecard"
                  width="50px"
                />
              </div>
              <div className="deck-name">
                <h3>{deck.name}</h3>
              </div>
              <div className="col btn-div">
                <Link to={`/customize/${deck._id}`}>
                  <button
                    value={deck._id}
                    onClick={(e) => {
                      onClick(e)
                    }}
                  >
                    Customize
                  </button>
                </Link>
                <button
                  value={deck._id}
                  onClick={(e) => {
                    deleteDeck(e)
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          )
        })}

      <form onSubmit={onSubmit}>
        <input
          className="form-control"
          type="text"
          name="deckName"
          value={deckName}
          onChange={(e) => onChange(e)}
          placeholder="New Deck Name.."
          required
        />
        <input type="submit" value="Create New Deck" />
      </form>
    </div>
  )
}

Decks.propTypes = {
  getAllDecks: PropTypes.func.isRequired,
  getDeck: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  decks: state.deck.decks,
  loading: state.deck.loading,
})

export default connect(mapStateToProps, { getAllDecks, getDeck })(Decks)
