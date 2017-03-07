import React, {Component} from 'react';
import Navbar from '../Navbar/Navbar.jsx';
import LeftSideBar from '../partials/LeftSideBar.jsx';
import RightSideBar from '../partials/RightSideBar.jsx';
import SearchBar from '../partials/SearchBar.jsx';
import WelcomeBox from './WelcomeBox.jsx';
import CourseCard from './CourseCard.jsx';

class IndexPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataLoaded: false,
      pageError: false,
      courses: [],
      updates: '',
      instId: ''
    };
    this.conditionData = this.conditionData.bind(this);
    this.renderPageAfterData = this.renderPageAfterData.bind(this);
  }

  componentDidMount() {
    $.ajax({
      method: 'GET',
      url: '/api/home',
      dataType: 'JSON',
      success: response => this.conditionData(response)
    });
  }

  conditionData(response) {
    if (response) {
      response.dataLoaded = true;
      this.setState(response);
    } else {
      this.setState({ dataLoaded: true, pageError: true });
    }
  }

  renderPageAfterData() {
    if (this.state.dataLoaded && this.state.pageError) {
      return (
        <div className="main-container">
          <p className="page-msg">
            <i className="fa fa-exclamation-triangle" aria-hidden="true" />
            Error in loading up the page
          </p>
        </div>
      );
    } else if (this.state.dataLoaded) {
      return (
        <div className="main-container">
          <SearchBar />
          { this.state.courses.map((course, index) =>
            <CourseCard key={index} course={course} updates={this.state.updates.filter(update => update.course_id === course.course_id)} />
          )}
          { this.state.dataLoaded && !this.state.courses[0] && <WelcomeBox instId={this.state.instId} /> }
        </div>
      );
    } else {
      return (
        <div className="main-container">
          <p className="page-msg">
            <i className="fa fa-spinner fa-spin fa-3x fa-fw"></i>
            <span className="sr-only">Loading...</span>
          </p>
        </div>
      );
    }
  }

  render() {
    return (
      <div className="index-page">
        <Navbar />
        <LeftSideBar />
        { this.renderPageAfterData() }
        <RightSideBar />
      </div>
    );
  }
}

export default IndexPage;
