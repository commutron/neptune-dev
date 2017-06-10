import React, {Component} from 'react';
import Pref from '/client/global/pref.js';

import BlockGroup from './BlockGroup.jsx';

// requires data
// all batchData
export default class BlockTable extends Component {

  //// Blocker Table \\\\
  render () {
    
    return (
      <div>
        <table className='wide'>
          <thead className='yellow cap'>
            <tr>
              <th>{Pref.batch}</th>
							<th>Blocker</th>
							<th>Recorded</th>
							<th>Solved</th>
							<th></th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          {this.props.batchData.map( (entry, index)=>{
            return (
              <BlockGroup key={index} batchData={entry} />
              );
          })}
        </table>
      </div>
    );
  }
}