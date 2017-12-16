import React, {Component} from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import JumpText from '../tinyUi/JumpText.jsx';
import UserNice from '../smallUi/UserNice.jsx';

const ScrapTable = ({ batchData })=> (
  <div>
    <table className='wide'>
      <thead className='fadeRed cap'>
        <tr>
          <th>{Pref.batch}</th>
          <th>{Pref.item}</th>
          <th>{Pref.group}</th>
          <th>{Pref.widget}</th>
					<th>who</th>
					<th>when</th>
					<th>{Pref.trackStep}</th>
          <th>comment</th>
        </tr>
      </thead>
      {batchData.map( (entry, index)=>{
        return (
          <ScrapGroup key={index} batchData={entry} />
        );
      })}
    </table>
  </div>
);


// Single batchData
const ScrapGroup = ({ batchData })=> {
  let b = batchData;
  let i = b.items;
  let sc = [];
  if(i != undefined) {
    i.map( (entry)=>{
      // check history for...
      for(let value of entry.history) {
        // scraps
        if(value.type === 'scrap') {
          sc.push([entry.serial, value]);
        // other
        }else{null}
      }
    });
  }else{null}
  return(
    <tbody>
      {sc.map( (entry, index)=>{
        return (
          <ScrapRow 
            key={index}
            entry={entry[1]}
            id={b._id}
            group={b.group}
            batchNum={b.batch}
            wIdget={b.wIdget}
            barcode={entry[0]} />
          );
      })}
    </tbody>
  );
};

const ScrapRow = ({ entry, id, group, batchNum, wIdget, barcode })=> (
	<tr>
    <td>{batchNum}</td>
    <td><JumpText title={barcode} link={barcode} /></td>
    <td className='up'>{group}</td>
    <td className='up'>{wIdget}</td>
		<td className='cap'><UserNice id={entry.who} /></td>
    <td>{moment(entry.time).calendar()}</td>
    <td>{entry.step}</td>
    <td>{entry.comm}</td>
	</tr>
);

export default ScrapTable;