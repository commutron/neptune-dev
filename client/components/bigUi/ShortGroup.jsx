import React, {Component} from 'react';
import Pref from '/client/global/pref.js';

import ShortRow from './ShortRow.jsx';

// requires
// Single batchData
export default class ShortGroup extends Component	{

  //// Order Section \\\\
  render () {

    let b = this.props.batchData;
    let sh = b.short.sort((s1, s2) => {return s1.time < s2.time});

    if(sh.length > 0) {
      return (
        <tbody>
          <tr>
            <th className='up'>{b.batch} {b.group} {b.wIdget}</th>
          </tr>
          <tr>
            <td rowSpan={b.short.length + 1} className='lastTd'></td>
          </tr>
          {sh.map( (entry, index)=>{
            return (
              <ShortRow key={index} entry={entry} id={b._id} />
              );
          })}
        </tbody>
      );
    }
    
    return (
      <tbody></tbody>
    );
  }
}