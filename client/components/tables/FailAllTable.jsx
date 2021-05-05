import React from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import { LeapTextLink } from '../tinyUi/LeapText.jsx';
import UserNice from '../smallUi/UserNice.jsx';

import './style.css';

const FailAllTable = ({ failData })=> (
  <div>
    <table className='wide overviewTable subrows'>
      <thead className='fadeRed cap'>
        <tr>
          <th>{Pref.xBatch}</th>
          <th>{Pref.group}</th>
          <th>{Pref.widget}</th>
          <th colSpan={2}>{Pref.item}</th>
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

export default FailAllTable;

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
    <td colSpan={2}>
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
    		  <span className='inline max300'
    		    >{moment(e.time).calendar(null, 
    		      {sameElse: "ddd, MMM D /YY, h:mm a"})
    		     } by <UserNice id={e.who} />
          </span>
        </td>
        <td colSpan={1}>
    		  <span className='inline max300'>{e.comm}</span>
        </td>
    	</tr>
  )})}
	</tbody>
);