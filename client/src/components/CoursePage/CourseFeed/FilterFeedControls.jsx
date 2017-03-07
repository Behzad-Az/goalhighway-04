import React, {Component} from 'react';

class FilterFeedControls extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.updateFilters(e.target.name, e.target.checked);
  }

  render() {
    return (
      <div className="filter-feed-controls control is-grouped">
        { this.props.categories.map((category, index) =>
          <p className="filter control" key={index}>
            <input type="checkbox" name={category.name} defaultChecked={true} onChange={this.handleChange} />
            <label className="checkbox">{ category.value }</label>
          </p>
        )}
      </div>
    );
  }
}

export default FilterFeedControls;
