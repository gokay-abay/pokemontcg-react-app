import React, { useState, useEffect } from "react"
import { connect } from "react-redux"
import { getDeck, addCardToDeck } from "../actions/deck"
import axios from "axios"
import PropTypes from "prop-types"
import { options } from "./inputOptions"

const SearchCards = (props) => {
  const [genCode, setGenCode] = useState(options[0].value)
  const [pokeName, setPokeName] = useState("")

  const [searchCards, setSearchCards] = useState([])
  const [searchLoaded, setSearchLoaded] = useState(false)

  const [qty, setQty] = useState([])

  const fetchData = () => {
    fetch(
      `https://api.pokemontcg.io/v1/cards?setCode=${genCode}&name=${pokeName}`
    )
      .then((res) => res.json())
      .then((json) => {
        setSearchCards(json.cards)
        setSearchLoaded(true)
      })
  }

  const handleOptionChange = (e) => {
    setGenCode(e.target.value)
  }

  const handleSearchChange = (e) => {
    setPokeName(e.target.value)
  }

  const onSubmit = (e) => {
    e.preventDefault()
    fetchData()
  }

  const handleQtyChange = (e) => {
    setQty(e.target.value)
  }

  return (
    <div className="container">
      <h1>Search for Cards</h1>
      <div className="select-container">
        <select
          className="form-control select-item"
          value={genCode}
          onChange={handleOptionChange}
        >
          {options.map((option) => (
            <option key={option.id} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <form onSubmit={onSubmit} className="form-inline my-lg-0 form-container">
        <input
          className="form-control mr-sm-2 col-9"
          type="search"
          placeholder="Search for Pokemon"
          aria-label="Search"
          onChange={handleSearchChange}
          value={pokeName}
        />
        <input
          className="btn btn-outline-success my-2 my-sm-0 col"
          type="submit"
          value="Search"
        />
      </form>
      <div id="display-container">
        {searchLoaded && (
          <ul className="list">
            {searchCards.map((card, index) => (
              <li className="poke-card" key={index}>
                <img src={card.imageUrl} alt={card.name} width="100px" />
                <div>
                  <label for="qty"></label>
                  <input
                    type="number"
                    name="qty"
                    id="qty"
                    onChange={handleQtyChange}
                    value={qty}
                    min="1"
                    max={card.supertype === "Energy" ? "60" : "4"}
                  />
                  <button
                    className="btn-primary"
                    onClick={() => {
                      props.addCardToDeck(card, qty)
                      setQty(1)
                    }}
                  >
                    Add
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

SearchCards.propTypes = {
  getDeck: PropTypes.func.isRequired,
  addCardToDeck: PropTypes.func.isRequired,
}

export default connect(null, { getDeck, addCardToDeck })(SearchCards)
