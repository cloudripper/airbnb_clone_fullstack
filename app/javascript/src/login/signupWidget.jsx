// signupWidget.jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { safeCredentials, handleErrors } from '@utils/fetchHelper';

class SignupWidget extends React.Component {
  state = {
    email: '',
    password: '',
    username: '',
    error: '',
    invalidEmail: '',
  }


  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  emailValidation = (email) => {
    const emailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    if (email.match(emailFormat)) {
      return true
    } else {
      return false
    }
  }

  signup = (e) => {
    if (e) { e.preventDefault(); }
    this.setState({
      error: '',
    });

    if (this.emailValidation(this.state.email)) {
      fetch('/api/users', safeCredentials({
        method: 'POST',
        body: JSON.stringify({
          user: {
            email: this.state.email,
            password: this.state.password,
            username: this.state.username,
          }
        })
      }))
        .then(handleErrors)
        .then(data => {
          if (data.user) {
            this.login();
          }
        })
        .catch(error => {
          this.setState({
            error: 'Could not sign up.',
          })
        })
    } else {
      this.setState({
        invalidEmail: 'Invalid email format',
      });
    }
  }

  login = (e) => {
    if (e) { e.preventDefault(); }
    this.setState({
      error: '',
      invalidEmail: '',
    });

    fetch('/api/sessions', safeCredentials({
      method: 'POST',
      body: JSON.stringify({
        user: {
          email: this.state.email,
          password: this.state.password,
        }
      })
    }))
      .then(handleErrors)
      .then(data => {
        if (data.success) {
          const params = new URLSearchParams(window.location.search);
          const redirect_url = params.get('redirect_url') || '/';
          window.location = redirect_url;
        }
      })
      .catch(error => {
        this.setState({
          error: 'Could not log in.',
        })
      })
  }

  render () {
    const { email, password, username, error, invalidEmail } = this.state;
    return (
      <React.Fragment>
        <form onSubmit={this.signup}>
          <input name="username" type="text" className="form-control form-control-lg mb-3" placeholder="Username" value={username} onChange={this.handleChange} required />
          <input name="email" type="text" className="form-control form-control-lg mb-3" placeholder="Email" value={email} onChange={this.handleChange} required />
          <input name="password" type="password" className="form-control form-control-lg mb-3" placeholder="Password" value={password} onChange={this.handleChange} required />
          <div className="ml-2 mb-3"><i>{invalidEmail}</i></div>
          <button type="submit" className="btn btn-danger btn-block btn-lg">Sign up</button>
        </form>
        <hr/>
        <p className="mb-0">Already have an account? <Link to="/login" className="text-primary">Log in</Link></p>
      </React.Fragment>
    )
  }
}

export default SignupWidget