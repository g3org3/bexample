import React, { Component } from 'react';
import ChartLoader from '../components/ChartLoader';
import { toast, ToastContainer } from 'react-toastify';
const API_URL = 'https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=DEMO_KEY';

export default class NeoChart extends Component {
  state = { data: [], loaded: false, error: false };

  async componentDidMount() {
    const res = await fetch(API_URL);
    if (res.status < 300) {
      const data = await res.json();
      toast('Data loaded', { type: 'success' });
      this.setState({ data: this.transformToGraphData(data), loaded: true });
    } else {
      toast(res.statusText, { type: 'error' });
      this.setState({ error: res.statusText || 'The request failed' });
    }
  }

  sortDesc = (a, b) => (b[1] + b[2]) / 2 - (a[1] + a[2]) / 2;

  transformToGraphData(neoJSON) {
    return neoJSON.near_earth_objects
      .map(neo => [
        neo.name,
        neo.estimated_diameter.kilometers.estimated_diameter_min,
        neo.estimated_diameter.kilometers.estimated_diameter_max,
      ])
      .sort(this.sortDesc);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="alert alert-danger" role="alert">
          Fail: {this.state.error}
        </div>
      );
    }
    if (!this.state.loaded) {
      return (
        <div className="alert alert-info" role="alert">
          Fetching data from NASA server...
        </div>
      );
    }
    return (
      <div>
        <ChartLoader data={this.state.data} />
        <ToastContainer autoClose={1000} />
      </div>
    );
  }
}
