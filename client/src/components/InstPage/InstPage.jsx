import React, {Component} from 'react';
import Navbar from '../Navbar/Navbar.jsx';
import SearchBar from '../partials/SearchBar.jsx';
import LeftSideBar from '../partials/LeftSideBar.jsx';
import RightSideBar from '../RightSideBar/RightSideBar.jsx';
import ReactAlert from '../partials/ReactAlert.jsx';
import CoursesContainer from './CoursesContainer.jsx';
import TopRow from './TopRow.jsx';

class InstPage extends Component {
  constructor(props) {
    super(props);
    this.reactAlert = new ReactAlert();
    this.state = {
      dataLoaded: false,
      pageError: false,
      instId: this.props.params.inst_id,
      instList: [],
      currInstCourses: [],
      currUserCourseIds: [],
      filterPhrase: ''
    };
    this._loadComponentData = this._loadComponentData.bind(this);
    this._conditionData = this._conditionData.bind(this);
    this._findInstName = this._findInstName.bind(this);
    this._filterCourseList = this._filterCourseList.bind(this);
    this._renderPageAfterData = this._renderPageAfterData.bind(this);
  }

  componentDidMount() {
    this._loadComponentData();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.inst_id && (this.state.instId !== nextProps.params.inst_id)) {
      this._loadComponentData(nextProps.params.inst_id);
    }
  }

  _loadComponentData(instId) {
    instId = instId || this.state.instId;
    fetch(`/api/institutions/${instId}`, {
      method: 'GET',
      credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(resJSON => this._conditionData(resJSON, instId))
    .catch(() => this.setState({ dataLoaded: true, pageError: true }));
  }

  _conditionData(resJSON, instId) {
    if (resJSON) {
      this.setState({
        instList: resJSON.instList,
        currUserCourseIds: resJSON.currUserCourseIds,
        currInstCourses: resJSON.currInstCourses,
        instId,
        dataLoaded: true
      });
    } else {
      document.title = 'Institution Panel - Error';
      throw 'Server returned false';
    }
  }

  _findInstName() {
    const inst = this.state.instList.find(inst => inst.value == this.state.instId);
    document.title = inst ? `${inst.label} Panel` : 'Instituion Panel';
    return inst ? inst.label : '';
  }

  _filterCourseList() {
    let phrase = new RegExp(this.state.filterPhrase.toLowerCase());
    return this.state.currInstCourses.filter(course => course.full_display_name.toLowerCase().match(phrase)).slice(0, 19);
  }

  _renderPageAfterData() {
    if (this.state.dataLoaded && this.state.pageError) {
      return (
        <div className='main-container'>
          <p className='page-msg'>
            <i className='fa fa-exclamation-triangle' aria-hidden='true' />
            Error in loading up the page
          </p>
        </div>
      );
    } else if (this.state.dataLoaded) {
      return (
        <div className='main-container'>
          <SearchBar />
          <TopRow
            instId={this.state.instId}
            instList={this.state.instList}
            reload={this._loadComponentData}
          />
          <CoursesContainer
            courses={this._filterCourseList()}
            currUserCourseIds={this.state.currUserCourseIds}
            handleFilter={e => this.setState({ filterPhrase: e.target.value })}
            instId={this.state.instId}
            instName={this._findInstName()}
            reload={this._loadComponentData}
          />
          { this.state.dataLoaded && this.state.currInstCourses[0] && <p>{this.state.currInstCourses.length} courses available at this institution. Search to find your course.</p> }
          { this.state.dataLoaded && !this.state.currInstCourses[0] && <p>No courses are available for this institution. Be the first to add one.</p> }
        </div>
      );
    } else {
      return (
        <div className='main-container'>
          <p className='page-msg'>
            <i className='fa fa-spinner fa-spin fa-3x fa-fw'></i>
            <span className='sr-only'>Loading...</span>
          </p>
        </div>
      );
    }
  }

  render() {
    return (
      <div className='inst-page'>
        <Navbar />
        <LeftSideBar />
        { this._renderPageAfterData() }
        <RightSideBar />
        { this.reactAlert.container }
      </div>
    );
  }
}

export default InstPage;
