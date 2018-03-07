import React from 'react';
import Pref from '/client/global/pref.js';

import BlockRow from './BlockRow.jsx';

const BlockTable = ({ batchData })=> (
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
      {batchData.map( (entry, index)=>{
        return (
          <BlockGroup key={index} batchData={entry} />
      )})}
    </table>
  </div>
);

const BlockGroup = ({ batchData })=> {
  let b = batchData;
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
};

export default BlockTable;