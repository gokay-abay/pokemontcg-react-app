import React from "react"
import "./App.css"
import Search from "./components/Search"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import Login from "./components/auth/Login"
import Register from "./components/auth/Register"

function App() {
  return (
    <div className="App">
      <Router>
        <Route exact path="/" component={Login} />
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/search" component={Search} />
        </Switch>
      </Router>
    </div>
  )
}

export default App
