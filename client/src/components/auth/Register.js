import React, { Fragment, useState } from "react"
import { Link, Redirect } from "react-router-dom"
import { connect } from "react-redux"
import PropTypes from "prop-types"

const Register = (props) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  })

  const { name, email, password, password2 } = formData

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const onSubmit = async (e) => {
    e.preventdefault()
    // fire the login action from the actions
  }

  return (
    <Fragment>
      <div className="container">
        <h1>Sign Up</h1>
        <form>
          <div className="form-group">
            <label for="inputName">User Name</label>
            <input
              type="text"
              className="form-control"
              id="inputName"
              placeholder="Enter user name"
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <label for="exampleInputEmail1">Email address</label>
            <input
              type="email"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="Enter email"
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <label for="exampleInputPassword1">Password</label>
            <input
              type="password"
              className="form-control"
              id="exampleInputPassword1"
              placeholder="Password"
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <label for="exampleInputPassword2"> Confirm Password</label>
            <input
              type="password"
              className="form-control"
              id="exampleInputPassword2"
              placeholder="Password"
              onChange={onChange}
            />
          </div>
          <button type="submit" className="btn btn-primary" onSubmit={onSubmit}>
            Submit
          </button>
        </form>
      </div>
    </Fragment>
  )
}

Register.propTypes = {}

export default Register
