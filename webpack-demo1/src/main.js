import React, { Component } from 'react'
import ReactDOM from 'react-dom'
// import _ from 'lodash'
class App extends Component {
  state = {
    number: 10,
    text: '',
    // text2: _.join([4, 5, 6], '-')
  }
  componentDidMount = () => {
    this.dynamicLodash()
  }
  dynamicLodash = () => {
    import(/*webpackChunkName: "lodash"*/'lodash').then(({ default: _ }) => {
      this.setState({ text: _.join([1, 2, 3], '-') })
    })
  }
  render() {
    const { text, text2 } = this.state
    return (
      <div>
        hello Webapck React
        <h2>{this.state.number}</h2>
        <h1>{text}</h1>
        <h1>{text2}</h1>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))

// import { add } from './utils/math'

// add();
// minus();