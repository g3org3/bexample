import React, { Component } from 'react';
import Script from 'react-load-script';

export default class ChartLoader extends Component {
  state = { loaded: false, error: false };

  onLoad = () => {
    this.setState({ loaded: true });
    console.log('loaded');
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
