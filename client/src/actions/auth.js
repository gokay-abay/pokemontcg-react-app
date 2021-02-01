import axios from "axios"
import setAuthToken from "../utils/setAuthToken"
import {
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  AUTH_ERROR,
  USER_LOADED,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT,
} from "./types"

// Load User
export const loadUser = () => async (dispatch) => {
  // check to see if there is token
  // if there is put it into the header
  if (localStorage.token) {
    setAuthToken(localStorage.token)
  }

  try {
    const res = await axios.get("http://localhost:4000/api/auth")

    dispatch({
      type: USER_LOADED,
      payload: res.data,
    })
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    })
  }
}

// Register User
export const register = ({ name, email, password }) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  }

  const body = JSON.stringify({ name, email, password })

  try {
    const res = await axios.post(
      "http://localhost:4000/api/users",
      body,
      config
    )

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    })
    dispatch(loadUser())
  } catch (err) {
    dispatch({
      type: REGISTER_FAIL,
    })
  }
}

// Login User
export const login = (email, password) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  }

  const body = JSON.stringify({ email, password })

  try {
    const res = await axios.post("http://localhost:4000/api/auth", body, config)

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    })
    dispatch(loadUser())
  } catch (err) {
    dispatch({
      type: LOGIN_FAIL,
    })
  }
}

// Logout // Clear Profile
export const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT })
}
