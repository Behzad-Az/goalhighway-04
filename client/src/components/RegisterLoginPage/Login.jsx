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
      username: '',
      password: '',
      processing: false
    };
    this._handleChange = this._handleChange.bind(this);
    this._handleLogin = this._handleLogin.bind(this);
    this._validateForm = this._validateForm.bind(this);
  }

  componentDidMount() {
    document.title = 'Login';
  }

  _handleChange(e) {
    let newState = {};
    newState[e.target.name] = e.target.value;
    this.setState(newState);
  }

  _handleLogin() {
    this.setState({ processing: true });

    const data = {
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
      resJSON ? browserHistory.push('/index') : this.props.handleError(true, 'Invalid credentials or unactivated account.');
    })
    .catch(err => console.error('Unable to process login - ', err))
    .then(() => this.setState({ processing: false }));
  }

  _validateForm() {
    return this.state.username.length >= this.formLimits.username.min &&
           !InvalidCharChecker(this.state.username, this.formLimits.username.max, 'username') &&
           this.state.password.length >= this.formLimits.password.min &&
           !InvalidCharChecker(this.state.password, this.formLimits.password.max, 'password') &&
           !this.state.processing;
  }

  render() {
    return (
      <nav className='nav login has-shadow'>
        <div className='container'>
          <div className='nav-left'>
            <Link className='nav-item logo' to='/index'><img src='../../../images/goalhighway-logo-no-background.png' alt='Bulma logo' /></Link>
          </div>
          <div className='nav-item credentials'>
            <div className='credential'>
              <input
                type='text'
                name='username'
                className='input'
                placeholder='Username'
                onKeyPress={e => e.key === 'Enter' && this._validateForm() ? this._handleLogin() : '' }
                onChange={this._handleChange}
                disabled={this.state.processing}
                style={{ borderColor: InvalidCharChecker(this.state.username, this.formLimits.username.max, 'username') ? '#9D0600' : '' }}
              />
            </div>
            <div className='credential'>
              <input
                type='password'
                name='password'
                className='input'
                onKeyPress={e => e.key === 'Enter' && this._validateForm() ? this._handleLogin() : '' }
                placeholder='Password'
                onChange={this._handleChange}
                disabled={this.state.processing}
                style={{ borderColor: InvalidCharChecker(this.state.password, this.formLimits.password.max, 'password') ? '#9D0600' : '' }}
              />
            </div>
            <button className='button' onClick={this._handleLogin} disabled={!this._validateForm()}>Go!</button>
            <Link className='label forgot' to='/forgot_account'>
              Forgot account?
            </Link>
          </div>
        </div>
      </nav>
    );
  }
}

export default Login;
