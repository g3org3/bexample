/* global google */
import React, { Component } from 'react';
import Script from 'react-load-script';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

export default class ChartLoader extends Component {
  static propTypes = {
    titles: PropTypes.arrayOf(PropTypes.string),
    data: PropTypes.arrayOf(PropTypes.array),
    options: PropTypes.object,
  };

  static defaultProps = {
    titles: [
      'NEO Name',
      'Min Estimated Diameter (km)',
      'Max Estimated Diameter (km)',
    ],
    data: [['', 0, 0]],
    options: {
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
    },
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
    const chart = new google.charts.Bar(document.getElementById('dual_x_div'));
    this.setState({ chart });
  };

  onError = () => {
    toast('Could not load Google Charts :(', { type: 'warning' });
    this.setState({ error: false });
  };

  static draw({ chart, titles, data, options }) {
    const dataTable = new google.visualization.arrayToDataTable([
      titles,
      ...data,
    ]);
    chart.draw(dataTable, options);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.chart) {
      const { titles, data, options } = nextProps;
      const { chart } = prevState;
      ChartLoader.draw({ chart, titles, data, options });
    }
    return nextProps;
  }

  render() {
    if (this.state.error) {
      return (
        <div class="alert alert-warning" role="alert">
          Sorry but the app fail to load Google Charts lib.
        </div>
      );
    }
    return (
      <div>
        <div id="dual_x_div" style={{ width: '1000px', height: '700px' }} />
        <Script
          url="https://www.gstatic.com/charts/loader.js"
          onError={this.onError}
          onLoad={this.onLoad}
        />
      </div>
    );
  }
}
