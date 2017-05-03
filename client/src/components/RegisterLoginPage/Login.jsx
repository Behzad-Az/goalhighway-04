import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';
import InvalidCharChecker from '../partials/InvalidCharChecker.jsx';

class Login extends Component {
  constructor(props) {
    super(props);
    this.formLimits = {
      username: { min: 3, max: 30 },
      password: { min: 6, max: 30 }
    };
    this.state = {
      username: 'behzad',
      password: 'behzad123'
    };
    this._handleChange = this._handleChange.bind(this);
    this._handleLogin = this._handleLogin.bind(this);
    this._validateForm = this._validateForm.bind(this);
  }

  componentDidMount() {
    this._handleLogin();
  }

  _handleChange(e) {
    let newState = {};
    newState[e.target.name] = e.target.value;
    this.setState(newState);
  }

  _handleLogin() {
    let data = {
      username: this.state.username,
      password: this.state.password
    };

    fetch('/api/login', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(resJSON => {
      resJSON ? browserHistory.push('/home') : this.props.handleBadInput(true, 'Invalid login credentials.');
    })
    .catch(err => console.error('Unable to process login - ', err));
  }

  _validateForm() {
    return this.state.username.length >= this.formLimits.username.min &&
           !InvalidCharChecker(this.state.username, this.formLimits.username.max, 'username') &&
           this.state.password.length >= this.formLimits.password.min &&
           !InvalidCharChecker(this.state.password, this.formLimits.password.max, 'password');
  }

  render() {
    return (
      <nav className='nav login has-shadow'>
        <div className='container'>
          <div className='nav-left'>
            <Link className='nav-item logo' to='/home'><img src='../../../images/goalhighway-logo.png' alt='Bulma logo' /></Link>
          </div>
          <div className='nav-item credentials'>
            <div className='credential'>
              <label className='label'>
                Username:
                { InvalidCharChecker(this.state.username, this.formLimits.username.max, 'username') && <span className='char-limit'>Invalid</span> }
              </label>
              <input
                type='text'
                name='username'
                className='input is-primary'
                placeholder='Enter username'
                onChange={this._handleChange}
                style={{ borderColor: InvalidCharChecker(this.state.username, this.formLimits.username.max, 'username') ? '#9D0600' : '' }} />
            </div>
            <div className='credential'>
              <label className='label'>
                Password:
                { InvalidCharChecker(this.state.password, this.formLimits.password.max, 'password') && <span className='char-limit'>Invalid</span> }
              </label>
              <input
                type='password'
                name='password'
                className='input is-primary'
                placeholder='Enter password'
                onChange={this._handleChange}
                style={{ borderColor: InvalidCharChecker(this.state.password, this.formLimits.password.max, 'password') ? '#9D0600' : '' }} />
            </div>
            <button className='button' onClick={this._handleLogin} disabled={!this._validateForm()}>Log in</button>
          </div>
        </div>
      </nav>
    );
  }
}

export default Login;
