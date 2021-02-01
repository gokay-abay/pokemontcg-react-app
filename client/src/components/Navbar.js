import React from "react"
import PropTypes from "prop-types"
import { Link } from "react-router-dom"
import { connect } from "react-redux"
import { Fragment } from "react"
import { logout } from "../actions/auth"

const Navbar = ({ auth: { isAuthenticated, loading }, logout }) => {
  // get isAuthenticated prop
  // if authenticated display logout button
  // if not display register and login button

  const authLinks = (
    <ul className="navbar-list">
      <li className="navbar-item">
        <Link to="/play">Play</Link>
      </li>
      <li className="navbar-item">
        <Link to="/decks">My Decks</Link>
      </li>
      <li className="navbar-item">
        <a onClick={logout}>Logout</a>
      </li>
    </ul>
  )

  const guestLinks = (
    <ul className="navbar-list">
      <li className="navbar-item">
        <Link to="/register">Register</Link>
      </li>
      <li className="navbar-item">
        <Link to="/login">Login</Link>
      </li>
    </ul>
  )

  return (
    <nav id="navbar">
      <h1>
        <Link to="/">PokeTCG</Link>
      </h1>
      {!loading && (
        <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
      )}
    </nav>
  )
}

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  auth: state.auth,
})

export default connect(mapStateToProps, { logout })(Navbar)
