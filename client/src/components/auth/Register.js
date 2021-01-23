import React, { Fragment, useState } from "react"
import { Link, Redirect } from "react-router-dom"
import { connect } from "react-redux"
import axios from "axios"
import { register } from "../../actions/auth"
import PropTypes from "prop-types"

const Register = ({ register, isAuthenticated }) => {
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
    e.preventDefault()

    register({ name, email, password })
    //console.log("hello")

    // const newUser = {
    //   name,
    //   email,
    //   password,
    // }
    // try {
    //   const config = {
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   }
    //   const body = JSON.stringify(newUser)

    //   const res = await axios.post("/api/users", body, config)
    //   console.log(res.data)
    // } catch (err) {
    //   console.log(err.message)
    // }

    // fire the login action from the actions
  }

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />
  }

  return (
    <Fragment>
      <div className="container">
        <h1>Sign Up</h1>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label for="inputName">User Name</label>
            <input
              type="text"
              className="form-control"
              id="inputName"
              name="name"
              placeholder="Enter user name"
              onChange={(e) => onChange(e)}
              value={name}
            />
          </div>
          <div className="form-group">
            <label for="exampleInputEmail1">Email address</label>
            <input
              type="email"
              className="form-control"
              id="exampleInputEmail1"
              name="email"
              placeholder="Enter email"
              onChange={(e) => onChange(e)}
              value={email}
            />
          </div>
          <div className="form-group">
            <label for="exampleInputPassword1">Password</label>
            <input
              type="password"
              className="form-control"
              id="exampleInputPassword1"
              name="password"
              placeholder="Password"
              onChange={(e) => onChange(e)}
              value={password}
            />
          </div>
          <div className="form-group">
            <label for="exampleInputPassword2"> Confirm Password</label>
            <input
              type="password"
              className="form-control"
              id="exampleInputPassword2"
              name="password2"
              placeholder="Password"
              onChange={(e) => onChange(e)}
              value={password2}
            />
          </div>
          <input type="submit" className="btn btn-primary" value="Register" />
        </form>
      </div>
    </Fragment>
  )
}

Register.propTypes = {
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
})

export default connect(mapStateToProps, { register })(Register)
