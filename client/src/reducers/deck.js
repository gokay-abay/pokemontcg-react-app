import { GET_DECKS } from "../actions/types"

const initialState = {
  loading: true,
  decks: null,
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
    default:
      return state
  }
}
