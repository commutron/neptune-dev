import React from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import { LeapTextLink } from '../tinyUi/LeapText.jsx';
// import UserNice from '../smallUi/UserNice.jsx';

import './style.css';

const RapidExTable = ({ thinData })=> {
  
  const dataObj = JSON.parse(thinData);
  const dataObjS = dataObj.sort((r1, r2)=>
      r1.createdAt > r2.createdAt ? -1 : r1.createdAt < r2.createdAt ? 1 : 0 );
  
  const calString = "MMMM Do YYYY";
  
  return(
    <div>
      <table className='wide overviewTable'>
        <thead className='fadeRed cap'>
          <tr>
            <th></th>
            <th>{Pref.rapidExd}</th>
            <th>{Pref.batch}</th>
            <th>{Pref.group}</th>
            <th>type</th>
  					<th>issue</th>
  					<th>created</th>
            <th>closed</th>
          </tr>
        </thead>
        <tbody>
        {dataObjS.map( (rex, index)=>{
          return (
            <RapidExRow 
              key={rex.rapid+index}
              rex={rex}
              calString={calString} />
          );
        })}
        </tbody>
      </table>
    </div>
  );
};

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
      {rex.group}
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