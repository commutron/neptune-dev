import React from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import { LeapTextLink } from '../tinyUi/LeapText.jsx';
import UserNice from '../smallUi/UserNice.jsx';

import './style.css';

const TestFailTableAll = ({ failData })=> (
  <div>
    <table className='wide overviewTable subrows'>
      <thead className='fadeRed cap'>
        <tr>
          <th>{Pref.batch}</th>
          <th>{Pref.group}</th>
          <th>{Pref.widget}</th>
          <th>{Pref.item}</th>
        </tr>
      </thead>
      {failData.map( (tf, index)=>{
        return (
          <FailRow 
            key={tf.tfEntries[0].key+index}
            entries={tf.tfEntries}
            group={tf.group}
            batchNum={tf.batch}
            widget={tf.widget}
            barcode={tf.serial} />
        );
      })}
    </table>
  </div>
);

export default TestFailTableAll;

const FailRow = ({ entries, group, batchNum, widget, barcode })=> (
	<tbody>
	<tr>
    <td>
      <LeapTextLink
        title={batchNum} 
        sty='numFont noWrap blackT'
        address={'/data/batch?request=' + batchNum}
      />
    </td>
    <td>
      <LeapTextLink
        title={group} 
        sty='blackT'
        address={'/data/overview?request=groups&specify=' + group}
      />
    </td>
    <td>
      <LeapTextLink
        title={widget} 
        sty='blackT'
        address={'/data/widget?request=' + widget}
      />
    </td>
    <td>
      <LeapTextLink
        title={barcode} 
        sty='numFont noWrap blackT'
        address={'/data/batch?request=' + batchNum + '&specify=' + barcode}
      />
    </td>
  </tr>
  {entries.map( (e, ix)=>{
    return(
      <tr key={ix+e.serial+e.time.toISOString()}>
        <td colSpan={3}></td>
    		<td colSpan={1}>
    		  <dd>{moment(e.time).calendar(null, {sameElse: "ddd, MMM D /YY, h:mm a"})} by <UserNice id={e.who} /></dd>
          <dd>{e.comm}</dd>
        </td>
    	</tr>
  )})}
	</tbody>
);