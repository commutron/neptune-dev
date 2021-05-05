import React from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import { LeapTextLink } from '../tinyUi/LeapText.jsx';
// import UserNice from '../smallUi/UserNice.jsx';

import './style.css';

const FailWidgetTable = ({ failData })=> (
  <div>
    <n-col-table className='wide forceScrollStyle'>
      <n-col-table-head className='fadeRed cap'>
        <span>{Pref.group}</span>
        <span>{Pref.widget}</span>
        <span>Total Batches</span>
        <span>Total {Pref.items}</span>
        <span>Total Fails</span>
        <span>Comments</span>
      </n-col-table-head>
      {failData.map( (tf, index)=>(
        <FailCol 
          key={tf.widget+index}
          tf={tf}
          failItems={tf.failItems}
          group={tf.group}
          widget={tf.widget}
        />
      ))}
    </n-col-table>
  </div>
);

export default FailWidgetTable;

const FailCol = ({ tf, group, widget, failItems })=> {
  
  const bchNum = _.uniq( Array.from(failItems, i => i.batch) ).length;
 
  
  return(
  	<n-col-table-col>
      <span>
        <LeapTextLink
          title={group} 
          sty='blackT'
          address={'/data/overview?request=groups&specify=' + group}
        />
      </span>
      <span>
        <LeapTextLink
          title={widget} 
          sty='blackT'
          address={'/data/widget?request=' + widget}
        />
      </span>
      <span>
        {bchNum}
      </span>
      <span>
        {tf.totalItems}
      </span>
      <span>
        {tf.totalFails}
      </span>
      <span>
      <ul>
        {tf.failComms.map( (e, ix)=>(
          <li key={ix}>{e}
      		</li>
      	))}
      </ul>
      </span>
  	</n-col-table-col>
  );
};