/* global google */
import React, { Component } from 'react';
import Script from 'react-load-script';
import PropTypes from 'prop-types';

export default class ChartLoader extends Component {
  static propTypes = {
    titles: PropTypes.arrayOf(PropTypes.string),
    data: PropTypes.arrayOf(PropTypes.array),
  };

  static defaultProps = {
    titles: [
      'NEO Name',
      'Min Estimated Diameter (km)',
      'Max Estimated Diameter (km)',
    ],
    data: [['', 0, 0]],
  };
  state = {
    loaded: false,
    error: false,
    chart: false,
  };

  onLoad = () => {
    this.setState({ loaded: true });
    google.charts.load('current', { packages: ['bar'] });
    google.charts.setOnLoadCallback(this.chartLoaded);
  };

  chartLoaded = () => {
    const { titles, data } = this.props;
    const chart = new google.charts.Bar(document.getElementById('dual_x_div'));
    const dataTable = new google.visualization.arrayToDataTable([
      titles,
      ...data,
    ]);
    chart.draw(dataTable, this.options);
    this.setState({ chart });
  };

  options = {
    width: 900,
    chart: {
      title: 'NASA NEO Data Visualization',
    },
    bars: 'horizontal',
    series: {
      0: { axis: 'min-distance' },
      1: { axis: 'max-distance' },
    },
    axes: {
      x: {
        'min-distance': { label: 'Min Estimated Diameter (km)' },
        'max-distance': { side: 'top', label: 'Max Estimated Diameter (km)' },
      },
    },
  };

  onError = () => {
    this.setState({ error: false });
  };

  render() {
    if (this.state.error) {
      return (
        <div class="alert alert-warning" role="alert">
          Sorry something went wrong. Try to refresh the page.
        </div>
      );
    }
    return (
      <div>
        <div id="dual_x_div" style={{ width: '1000px', height: '800px' }} />
        <Script
          url="https://www.gstatic.com/charts/loader.js"
          onError={this.onError}
          onLoad={this.onLoad}
        />
      </div>
    );
  }
}
