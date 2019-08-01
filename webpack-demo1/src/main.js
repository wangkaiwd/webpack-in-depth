import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './assets/styles/main.scss';

console.log('MODE', process.env.MODE);
console.log('hello webpack');

class App extends Component {
  state = {
    number: 12,
    text: '',
    time: ''
  };
  componentDidMount = () => {
  };
  dynamicLodash = () => {
    import(
      /* webpackChunkName: "lodash" */
      /* webpackPrefetch: true */
      'lodash').then(({ default: _ }) => {
      this.setState({ text: _.join([1, 2, 3], '-') });
    });
  };
  dynamicDayjs = () => {
    import(
      /* webpackChunkName: "dayjs" */
      /* webpackPreload: true */
      'dayjs'
      ).then(({ default: dayjs }) => {
      this.setState({ time: dayjs().format() });
    });
  };

  render () {
    const { text, time } = this.state;
    return (
      <div>
        hello Webpack React
        <h2>{this.state.number}</h2>
        <h1>{text}</h1>
        <h1>{time}</h1>
        <button onClick={this.dynamicLodash}>load lodash</button>
        <button onClick={this.dynamicDayjs}>load dayJs</button>
      </div>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('root'));
// import { add } from './utils/math'

// add();
// minus();
