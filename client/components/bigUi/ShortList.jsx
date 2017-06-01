import React, {Component} from 'react';
import Pref from '/client/global/pref.js';

import ShortRow from './ShortRow.jsx';

// requires
// Single batchData
export default class ShortList extends Component	{

  //// Order Section \\\\
  render () {

    let b = this.props.batchData;
    let sh = b.short.sort((s1, s2) => {return s1.time < s2.time});

    if(sh.length > 0) {
      return (
        <table>
          <thead className='yellow cap'>
            <tr>
							<th>Part Number</th>
							<th>Quantity</th>
							<th>Discovered</th>
							<th>Comment</th>
              <th>Resolution</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sh.map( (entry, index)=>{
              return (
                <ShortRow key={index} entry={entry} id={b._id} />
                );
            })}
          </tbody>
        </table>
      );
    }
    
    return (
      null
    );
  }
}