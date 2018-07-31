import React, { Component } from 'react';
import ChartLoader from '../components/ChartLoader';
import { toast } from 'react-toastify';

const API_URL = 'https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=DEMO_KEY';

export default class NeoChart extends Component {
  state = {
    data: [],
    alldata: {},
    loaded: false,
    error: false,
    dropdownOpen: false,
    orbitalBodies: [],
    orbitalBodyOptions: [],
    selectedOrbitalBody: '',
  };

  async componentDidMount() {
    await this.loadNeoNasaFromAPI();
    await this.loadUserPrefereces();
  }

  async loadNeoNasaFromAPI() {
    const res = await fetch(API_URL);
    if (res.status < 300) {
      const data = await res.json();
      toast('Data loaded', { type: 'success' });
      this.setState({
        alldata: data,
        data: data.near_earth_objects
          .map(this.transformToGraphData)
          .sort(this.sortDesc),
        ...this.getNearObitbody(data),
        loaded: true,
      });
    } else {
      toast(res.statusText, { type: 'error' });
      this.setState({ error: res.statusText || 'The request failed' });
    }
  }

  async loadUserPrefereces() {
    const res = await fetch('/api/modifiers');
    if (res.status < 300) {
      const modifiers = await res.json();
      const value = modifiers.length ? modifiers.pop().name : '';
      this.changeOrbitalBody({
        value: value === 'null' ? '' : value,
        save: false,
      });
    } else {
      toast(res.statusText, { type: 'error' });
    }
  }

  toggle = () => {
    this.setState(s => ({
      dropdownOpen: !s.dropdownOpen,
    }));
  };

  changeOrbitalBody = async ({ value, save = true }) => {
    this.filterByOrbitalBody(value);
    this.setState({ selectedOrbitalBody: value });
    if (save) {
      try {
        const res = await fetch(`/api/modifiers/${value || 'null'}`, {
          method: 'POST',
        });
        if (res.status >= 300) {
          toast('Could not save preferences', { type: 'warning' });
        }
      } catch (err) {
        console.log(err.message);
        toast('Could not save preferences', { type: 'warning' });
      }
    }
  };

  filterByOrbitalBody(selectedOrbitalBody) {
    const { orbitalBodies } = this.state;
    const filteredNames = orbitalBodies
      .filter(
        ({ orbiting_body = '' } = {}) =>
          orbiting_body.indexOf(selectedOrbitalBody) !== -1,
      )
      .map(({ name }) => name);

    this.setState(s => ({
      ...s,
      data: s.alldata.near_earth_objects
        .filter(({ name }) => filteredNames.indexOf(name) !== -1)
        .map(this.transformToGraphData)
        .sort(this.sortDesc),
    }));
  }

  getNearObitbody(neoJSON) {
    const { keys } = Object;
    const orbitalBodiesNamesObject = {};
    const orbitalBodies = neoJSON.near_earth_objects.map(neo => ({
      name: neo.name,
      orbiting_body: keys(
        // convert array to object to remove duplicates
        neo.close_approach_data.reduce((s, data) => {
          orbitalBodiesNamesObject[data.orbiting_body] = true;
          return { ...s, [data.orbiting_body]: true };
        }, {}),
      ).join(', '),
    }));
    const orbitalBodyOptions = keys(orbitalBodiesNamesObject);
    return { orbitalBodyOptions, orbitalBodies };
  }

  sortDesc = (a, b) => (b[1] + b[2]) / 2 - (a[1] + a[2]) / 2;

  transformToGraphData = neo => [
    neo.name,
    neo.estimated_diameter.kilometers.estimated_diameter_min,
    neo.estimated_diameter.kilometers.estimated_diameter_max,
  ];

  render() {
    const {
      error,
      loaded,
      selectedOrbitalBody,
      orbitalBodyOptions,
      data,
    } = this.state;
    if (error) {
      return (
        <div className="alert alert-danger" role="alert">
          Fail: {error}
        </div>
      );
    }
    if (!loaded) {
      return (
        <div className="alert alert-info" role="alert">
          Fetching data from NASA server...
        </div>
      );
    }
    return (
      <div>
        <div className="form-group">
          <select
            className="form-control"
            value={selectedOrbitalBody}
            onChange={({ target = {} } = {}) => this.changeOrbitalBody(target)}
          >
            <option value="">All</option>
            {orbitalBodyOptions.map(name => (
              <option key={name}>{name}</option>
            ))}
          </select>
        </div>
        <ChartLoader data={data} />
      </div>
    );
  }
}
