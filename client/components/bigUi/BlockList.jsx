import React, {Component} from 'react';
import Pref from '/client/global/pref.js';

import BlockRow from './BlockRow.jsx';

// requires
// blocks data
export default class BlockList extends Component	{

  render () {

    let blocks = this.props.data.sort((s1, s2) => {return s1.time < s2.time});

    if(blocks.length > 0) {
      return (
        <table>
          <thead className='yellow cap'>
            <tr>
							<th>Blocker</th>
							<th>Recorded</th>
							<th>Solved</th>
							<th></th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {blocks.map( (entry, index)=>{
              return (
                <BlockRow key={index} entry={entry} id={this.props.id} lock={this.props.lock} />
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