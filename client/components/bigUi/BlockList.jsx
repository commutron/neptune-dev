import React from 'react';

import BlockRow from './BlockRow.jsx';

const BlockList = ({ id, data, lock })=> {
  let blocks = data.sort((s1, s2) => {return s1.time < s2.time});
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
              <BlockRow key={index} entry={entry} id={id} lock={lock} />
              );
          })}
        </tbody>
      </table>
    );
  }
  return (
    null
  );
};

export default BlockList;