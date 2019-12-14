import React from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import { LeapTextLink } from '../tinyUi/LeapText.jsx';
import UserNice from '../smallUi/UserNice.jsx';

import './style.css';

const ScrapTableAll = ({ scrapData })=> (
  <div>
    <table className='wide overviewTable'>
      <thead className='fadeRed cap'>
        <tr>
          <th>{Pref.batch}</th>
          <th>{Pref.item}</th>
          <th>{Pref.group}</th>
          <th>{Pref.widget}</th>
					<th>when</th>
					<th>who</th>
					<th>where</th>
          <th>comment</th>
        </tr>
      </thead>
      <tbody>
      {scrapData.map( (sc, index)=>{
        return (
          <ScrapRow 
            key={sc.scEntry.key+index}
            entry={sc.scEntry}
            group={sc.group}
            batchNum={sc.batch}
            widget={sc.widget}
            barcode={sc.serial} />
        );
      })}
      </tbody>
    </table>
  </div>
);

export default ScrapTableAll;

const ScrapRow = ({ entry, group, batchNum, widget, barcode })=> (
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
        title={barcode} 
        sty='numFont noWrap blackT'
        address={'/data/batch?request=' + batchNum + '&specify=' + barcode}
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
    <td>{moment(entry.time).calendar(null, {sameElse: "ddd, MMM D /YY, h:mm a"})}</td>
    <td className='cap'><UserNice id={entry.who} /></td>
    <td>{entry.step}</td>
    <td>{entry.comm}</td>
	</tr>
);