/* global google */
import React, { Component } from 'react';
import Script from 'react-load-script';
import neoJSON from '../data/nasaneo.json';

export default class ChartLoader extends Component {
  state = { loaded: false, error: false };

  onLoad = () => {
    this.setState({ loaded: true });
    google.charts.load('current', { packages: ['bar'] });
    google.charts.setOnLoadCallback(this.drawGraph);
    console.log('loaded');
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

  drawGraph = () => {
    const neo = neoJSON.near_earth_objects
      .map(neo => [
        neo.name,
        neo.estimated_diameter.kilometers.estimated_diameter_min,
        neo.estimated_diameter.kilometers.estimated_diameter_max,
      ])
      .sort((a, b) => b[1] - a[1]);
    const data = new google.visualization.arrayToDataTable([
      [
        'NEO Name',
        'Min Estimated Diameter (km)',
        'Max Estimated Diameter (km)',
      ],
      ...neo,
    ]);

    const chart = new google.charts.Bar(document.getElementById('dual_x_div'));
    chart.draw(data, this.options);
  };

  onError = () => {
    this.setState({ error: false });
    console.log('error');
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
