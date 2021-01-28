import axios from "axios"
import setAuthToken from "../utils/setAuthToken"

import { GET_DECKS } from "./types"

// get decks
export const getDecks = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token)
  }

  try {
    const res = await axios.get("http://localhost:4000/api/decks")

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
