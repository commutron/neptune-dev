import React, {Component} from 'react';
import Pref from '/client/global/pref.js';

import BlockRow from './BlockRow.jsx';

// requires
// Single batchData
export default class BlockGroup extends Component	{

  //// Order Section \\\\
  render () {

    let b = this.props.batchData;
    let sh = b.blocks.sort((s1, s2) => {return s1.time < s2.time});

    if(sh.length > 0) {
      return (
        <tbody>
          <tr>
            <th className='up'>{b.batch}</th>
          </tr>
          <tr>
            <td rowSpan={b.blocks.length + 1} className='lastTd'></td>
          </tr>
          {sh.map( (entry, index)=>{
            return (
              <BlockRow key={index} entry={entry} id={b._id} />
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