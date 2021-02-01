import { ADD_CARD, GET_DECKS, GET_ONE_DECK } from "../actions/types"

const initialState = {
  deckLoading: true,
  decks: null,
  deck: null,
  addedCards: null,
}

export default function (state = initialState, action) {
  const { type, payload } = action

  switch (type) {
    case GET_DECKS:
      return {
        ...state,
        deckLoading: false,
        decks: payload,
      }

    case GET_ONE_DECK:
      return {
        ...state,
        deckLoading: false,
        deck: payload,
      }
    case ADD_CARD:
      return {
        ...state,
        addedCards: payload,
      }
    default:
      return state
  }
}
