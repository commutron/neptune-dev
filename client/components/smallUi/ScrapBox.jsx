import React, {Component} from 'react';
import moment from 'moment';
import UserNice from './UserNice.jsx';

// requires history entry

export default class ScrapBox extends Component	{

  render() {
    const dt = this.props.entry;

    return (
      <div className='actionBox red'>
        <div className='titleBar centre'>
          <h1 className='up'>{dt.type}</h1>
        </div>
        <div className='centre'>
          <p>{moment(dt.time).calendar()}</p>
          <p>by: <UserNice id={dt.who} />, at step: {dt.step}</p>
          <p className='capFL'>{dt.comm}</p>
          <br />
        </div>
      </div>
    );
  }
}