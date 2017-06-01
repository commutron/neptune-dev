import React, {Component} from 'react';
import Pref from '/client/global/pref.js';

import ShortGroup from './ShortGroup.jsx';

// requires data
// all batchData
export default class ShortTable extends Component {

  //// Shortage Table \\\\
  render () {
    
    return (
      <div>
        <table className='wide'>
          <thead className='yellow cap'>
            <tr>
              <th>{Pref.batch}</th>
							<th>Part Number</th>
							<th>Quantity</th>
							<th>Discovered</th>
							<th>Comment</th>
              <th>Resolution</th>
              <th></th>
            </tr>
          </thead>
          {this.props.batchData.map( (entry, index)=>{
            return (
              <ShortGroup key={index} batchData={entry} />
              );
          })}
        </table>
      </div>
    );
  }
}