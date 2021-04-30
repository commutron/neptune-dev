import React from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import { LeapTextLink } from '../tinyUi/LeapText.jsx';
// import UserNice from '../smallUi/UserNice.jsx';

import './style.css';

const RapidExTable = ({ dataObj })=> (
  <div>
    <table className='wide overviewTable'>
      <thead className='fadeRed cap'>
        <tr>
          <th></th>
          <th></th>
          <th>{Pref.batch}</th>
          <th>{Pref.group}</th>
          <th>{Pref.widget}</th>
          <th>type</th>
					<th>issue</th>
					<th>created</th>
          <th>closed</th>
        </tr>
      </thead>
      <tbody>
      {dataObj.map( (rex, index)=>{
        return (
          <RapidExRow 
            key={rex.rapid+index}
            rex={rex}
            calString="MMMM Do YYYY" />
        );
      })}
      </tbody>
    </table>
  </div>
);

export default RapidExTable;


const RapidExRow = ({ rex, calString })=> (
	<tr>
    <td className='centreText'>
      {rex.live ? <n-fa1><i className='fas fa-bolt darkOrangeT'></i></n-fa1> : null}
    </td>
    <td>
      {rex.rapid}
    </td>
    <td>
      <LeapTextLink
        title={rex.extendBatch} 
        sty='numFont noWrap blackT'
        address={'/data/batch?request=' + rex.extendBatch}
      />
    </td>
    <td>
      <LeapTextLink
        title={rex.group} 
        sty='blackT'
        address={'/data/overview?request=groups&specify=' + rex.group}
      />
    </td>
    <td>
      <LeapTextLink
        title={rex.widget} 
        sty='blackT'
        address={'/data/widget?request=' + rex.widget}
      />
    </td>
    <td>
      {rex.type}
    </td>
    <td>
      {rex.issueOrder}
    </td>
    <td>
      {moment(rex.createdAt).calendar(null, {sameElse: calString})}
    </td>
    <td>
      {rex.live ? "" : moment(rex.closedAt).calendar(null, {sameElse: calString})}
    </td>
	</tr>
);