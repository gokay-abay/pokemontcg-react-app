import { combineReducers } from "redux"
import auth from "./auth"
import deck from "./deck"

export default combineReducers({
  auth,
  deck,
})
