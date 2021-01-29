import { GET_DECKS, GET_ONE_DECK } from "../actions/types"

const initialState = {
  loading: true,
  decks: null,
  deck: null,
}

export default function (state = initialState, action) {
  const { type, payload } = action

  switch (type) {
    case GET_DECKS:
      return {
        ...state,
        loading: false,
        decks: payload,
      }

    case GET_ONE_DECK:
      return {
        ...state,
        loading: false,
        deck: payload,
      }
    default:
      return state
  }
}
