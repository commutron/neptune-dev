import React from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import LeapText from '../tinyUi/LeapText.jsx';
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
					<th>where</th>
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
            group={b.group}
            batchNum={b.batch}
            widget={b.widget}
            barcode={entry[0]} />
          );
      })}
    </tbody>
  );
};

const ScrapRow = ({ entry, group, batchNum, widget, barcode })=> (
	<tr>
    <td>
      <LeapText
        title={batchNum} 
        sty='numFont noWrap'
        address={'/data/batch?request=' + batchNum}
      />
    </td>
    <td>
      <LeapText
        title={barcode} 
        sty='numFont noWrap'
        address={'/data/batch?request=' + batchNum + '&specify=' + barcode}
      />
    </td>
    <td>
      <LeapText
        title={group} 
        sty={false}
        address={'/data/group?request=' + group}
      />
    </td>
    <td>
      <LeapText
        title={widget} 
        sty={false}
        address={'/data/widget?request=' + widget}
      />
    </td>
		<td className='cap'><UserNice id={entry.who} /></td>
    <td>{moment(entry.time).calendar(null, {sameElse: "ddd, MMM D /YY, h:mm a"})}</td>
    <td>{entry.step}</td>
    <td>{entry.comm}</td>
	</tr>
);

export default ScrapTable;