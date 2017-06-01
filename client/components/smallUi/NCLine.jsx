import React, {Component} from 'react';
import moment from 'moment';

import UserNice from './UserNice.jsx';

export default class NCLine extends Component {

  render() {
    
    const dt = this.props.entry;
    
    const fix = dt.fix !== false ?
                <p>fixed: {moment(dt.fix.time).calendar()} by <UserNice id={dt.fix.who} /></p>
                :
                <p>fixed:</p>;
    
    const inspect = dt.inspect !== false ?
                    <p>inspected: {moment(dt.inspect.time).calendar()} by <UserNice id={dt.inspect.who} /></p>
                    :
                    <p>inspected:</p>;
    
    const skip = dt.skip !== false ?
                 <p>skipped: {moment(dt.skip.time).calendar()} by <UserNice id={dt.skip.who} /></p>
                 :
                 <p></p>;

    return (
      <div className='infoBox'>
        <div className='titleBar'>
          {dt.ref} {dt.type} {moment(dt.time).calendar()} by <UserNice id={dt.who} /> at {dt.where}
        </div>
        {dt.comm}
        {fix}
        {inspect}
        {skip}
      </div>
    );
  }
}