import React, { Component } from 'react';
import Moment from 'moment';

class Clock extends Component {
  constructor(props) {
    super(props);
    this.state={
      dateFormatted : Moment().locale('en').format('LL').toString(),
      timeFormatted : Moment().locale('en').format('LT').toString().toLowerCase()
    };
  }
  tick = () => {
    this.setState({
      dateFormatted : Moment().locale('en').format('LL').toString(),
      timeFormatted : Moment().locale('en').format('LT').toString().toLowerCase()
    });
  }
  componentDidMount() {
    this.interval = setInterval(this.tick, 1000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  render () {
    const date = this.state.dateFormatted;
    const time = this.state.timeFormatted;
    return(
      <div className="Clock">
        <div className="Date">{date}</div>
        <div className="Time">{time}</div>
      </div>
    );
  }
}



export default Clock
