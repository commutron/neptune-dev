import React from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import LeapText from '../tinyUi/LeapText.jsx';
import UserNice from '../smallUi/UserNice.jsx';

const ScrapTableAll = ({ scrapData })=> (
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
        address={'/data/overview?request=groups&specify=' + group}
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