import React, { useEffect } from "react"
import "./App.css"
import Navbar from "./components/Navbar"
import Search from "./components/Search"
import Decks from "./components/Decks"
import Play from "./components/Play"
import CustomizeDeck from "./components/CustomizeDeck"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import Login from "./components/auth/Login"
import Register from "./components/auth/Register"
import setAuthToken from "./utils/setAuthToken"
// Redux
import { Provider } from "react-redux"
import store from "./store"
import { loadUser } from "./actions/auth"

// verify token
if (localStorage.token) {
  setAuthToken(localStorage.token)
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser())
  }, [])

  return (
    <Provider store={store}>
      <div className="App">
        <Router>
          <Navbar />
          <Route exact path="/" component={Login} />
          <Switch>
            <Route exact path="/play" component={Play} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/search" component={Search} />
            <Route exact path="/decks" component={Decks} />
            <Route exact path="/customize/:id" component={CustomizeDeck} />
          </Switch>
        </Router>
      </div>
    </Provider>
  )
}

export default App
