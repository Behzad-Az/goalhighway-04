import React, {Component} from 'react';
import { Link } from 'react-router';
import SingleSelect from '../partials/SingleSelect.jsx';

class Register extends Component {
  constructor(props) {
    super(props);
    this.academicYears = [ { value: 1, label: 'Year 1'}, { value: 2, label: 'Year 2'}, { value: 3, label: 'Year 3'}, { value: 4, label: 'Year 4'}, { value: 5, label: 'Year 5'}, { value: 6, label: 'Year 6'} ];
    this.state = {
      dataLoaded: false,
      pageError: false,
      username: '',
      email: '',
      password: '',
      passwordConfirm: '',
      instId: '',
      progId: '',
      userYear: '',
      instProgDropDownList: [],
      usernameAvaialble: false,
      emailAvaialble: false
    };
    this.conditionData = this.conditionData.bind(this);
    this.handleInstChange = this.handleInstChange.bind(this);
    this.handleProgChange = this.handleProgChange.bind(this);
    this.handleUserYearChange = this.handleUserYearChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getUserAvailability = this.getUserAvailability.bind(this);
    this.getEmailAvailability = this.getEmailAvailability.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
  }

  componentDidMount() {
    fetch('/api/institutions_programs', {
      method: 'GET',
      credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(resJSON => this.conditionData(resJSON))
    .catch(() => this.setState({ dataLoaded: true, pageError: true }));
  }

  conditionData(resJSON) {
    if (resJSON) {
      let instProgDropDownList = resJSON.map(inst => {
        let value = inst.id;
        let label = inst.inst_display_name;
        let programs = inst.programs.map(prog => {
          let value = prog.prog_id;
          let label = prog.prog_display_name;
          return { value, label };
        });
        return { value, label, programs};
      });
      this.setState({ instProgDropDownList, dataLoaded: true });
    } else {
      throw 'Server returned false';
    }
  }

  handleInstChange(instId) {
    this.setState({ instId });
  }

  handleProgChange(progId) {
    this.setState({ progId });
  }

  handleUserYearChange(userYear) {
    this.setState({ userYear });
  }

  handleChange(e) {
    let obj = {};
    obj[e.target.name] = e.target.value;
    this.setState(obj);
  }

  getUserAvailability(e) {
    let username = e.target.value.toLowerCase();
    if (username.length > 2) {
      fetch('/api/username_availability', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username })
      })
      .then(response => response.json())
      .then(usernameAvaialble => this.setState({ usernameAvaialble, username }));
    } else {
      this.setState({ usernameAvaialble: false, username });
    }
  }

  getEmailAvailability(e) {
    let email = e.target.value.toLowerCase();
    let emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if (email.length > 5 && email.match(emailRegex)) {
      fetch('/api/email_availability', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })
      .then(response => response.json())
      .then(emailAvaialble => this.setState({ emailAvaialble, email }));
    } else {
      this.setState({ emailAvaialble: false, email });
    }
  }

  validateForm() {
    return this.state.username &&
           this.state.email &&
           this.state.password &&
           this.state.passwordConfirm &&
           this.state.instId &&
           this.state.progId &&
           this.state.userYear &&
           this.state.emailAvaialble &&
           this.state.usernameAvaialble &&
           this.state.password === this.state.passwordConfirm;
  }

  handleRegister() {
    let data = {
      username: this.state.username,
      email: this.state.email,
      password: this.state.password,
      passwordConfirm: this.state.passwordConfirm,
      instId: this.state.instId,
      progId: this.state.progId,
      userYear: this.state.userYear
    };

    fetch('/api/register', {
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
      resJSON ? this.props.handleSuccessfulRegister(true) : this.props.handleBadInput(true, 'Unable to register new user.');
    })
    .catch(err => console.error('Unable to process registeration - ', err));
  }

  render() {
    let programList = this.state.instId ? this.state.instProgDropDownList.find(item => item.value === this.state.instId).programs : [];
    return (
      <div className='card'>
        <header className='card-header'>
          <p className='card-header-title'>
            Register Here
          </p>
        </header>

        <div className='card-content'>
          <div className='control'>
            <label className='label'>Username: {this.state.usernameAvaialble && <i className='fa fa-check' />}</label>
            <input type='text' className='input is-primary'
                   placeholder='Enter username' name='username'
                   onChange={this.getUserAvailability} />
          </div>
          <div className='control'>
            <label className='label'>Email: {this.state.emailAvaialble && <i className='fa fa-check' />}</label>
            <input type='email' className='input is-primary'
                   placeholder='Enter email' name='email'
                   onChange={this.getEmailAvailability} />
          </div>
          <div className='control'>
            <label className='label'>Password:</label>
            <input type='password' className='input is-primary'
                   placeholder='Enter password' name='password'
                   onChange={this.handleChange} />
          </div>
          <div className='control'>
            <label className='label'>Confirm Password:</label>
            <input type='password' className='input is-primary'
                   placeholder='Enter password' name='passwordConfirm'
                   onChange={this.handleChange} />
          </div>

          <div className='control'>
            <label className='label'>Primary Institution:</label>
            <SingleSelect disabled={false} initialValue={this.state.instId} options={this.state.instProgDropDownList} name='instId' handleChange={this.handleInstChange} />
          </div>

          <div className='control'>
            <label className='label'>Primary Program:</label>
            <SingleSelect disabled={false} initialValue={this.state.progId} options={programList} name='progId' handleChange={this.handleProgChange} />
          </div>

          <div className='control'>
            <label className='label'>Primary Academic Year:</label>
            <SingleSelect disabled={false} initialValue={this.state.userYear} options={this.academicYears} name='userYear' handleChange={this.handleUserYearChange} />
          </div>
        </div>
        <footer className='card-footer'>
          <Link className='card-footer-item' onClick={this.handleRegister}>Register!</Link>
        </footer>
      </div>
    );
  }
}

export default Register;
