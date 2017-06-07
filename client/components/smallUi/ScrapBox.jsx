import React, {Component} from 'react';
import moment from 'moment';
import UserNice from './UserNice.jsx';

// requires history entry

export default class ScrapBox extends Component	{

  render() {
    const dt = this.props.entry;

    return (
      <div className='actionBox red cap'>
        <div className='titleBar centre'>
          <h1 className='up'>{dt.type}</h1>
        </div>
        <div className='centre'>
          <p>{moment(dt.time).calendar()}</p>
          <p>by: <UserNice id={dt.who} /></p>
          <p>at: {dt.step}</p>
          <br />
        </div>
      </div>
    );
  }
}