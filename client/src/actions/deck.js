import axios from "axios"
import setAuthToken from "../utils/setAuthToken"

import { GET_DECKS, GET_ONE_DECK, ADD_CARD } from "./types"

// get all decks
export const getAllDecks = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token)
  }

  try {
    const res = await axios.get("/api/decks")

    dispatch({
      type: GET_DECKS,
      payload: res.data,
    })

    console.log(res.data)
  } catch (err) {
    // dispatch({
    //     type: Get error
    // })
    console.log("data fetch failed")
  }
}
// get one deck
export const getDeck = (id) => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token)
  }

  try {
    const res = await axios.get(`/api/decks/${id}`)

    dispatch({
      type: GET_ONE_DECK,
      payload: res.data,
    })
    console.log(res.data)
  } catch (err) {
    console.log("data fetch failed")
  }
}

export const addCardToDeck = (card, qty) => (dispatch) => {
  let cardsAdded = []
  for (let i = 0; i < qty; i++) {
    cardsAdded.push(card)
  }
  dispatch({
    type: ADD_CARD,
    payload: cardsAdded,
  })
}
