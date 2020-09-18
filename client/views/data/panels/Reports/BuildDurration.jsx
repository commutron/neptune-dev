import React, { useState, useEffect, Fragment } from 'react';
import moment from 'moment';
// import Pref from '/client/global/pref.js';
// // import { CalcSpin } from '/client/components/tinyUi/Spin.jsx';
// import ReportStatsTable from '/client/components/tables/ReportStatsTable.jsx'; 
// import NumLine from '/client/components/tinyUi/NumLine.jsx';

import { round1Decimal } from '/client/utility/Convert';

const BuildDurration = ()=> {
  
  const [ result, resultSet ] = useState([]);
  
  useEffect( ()=>{
    Meteor.call('reportOnTurnAround', (err, reply)=>{
      err && console.log(err);
      reply && resultSet(reply);
    });
  }, []);
  
  
  console.log(result);
  
  return(
    <table>
      <thead><tr><th>Customer</th><th>Weeks</th><th>Days</th></tr></thead>
      <tbody>
        {result.map( (entry, index)=>{
          const dArr = entry.durrArray;
          const avg = dArr.length == 1 ? dArr[0] : dArr.length > 1 &&
            dArr.reduce( (a,c)=>a+c) / dArr.length;
          const avgWeeks = moment.duration(avg, 'minutes').asWeeks();
          const avgDays = moment.duration(avg, 'minutes').asDays();
          return(
          <Fragment key={index}>
            <tr>
              <td colSpan='3' className='medBig bold'
              >{entry.group.toUpperCase()}</td>
            </tr>
            <tr className='med bold'>
              <td>average</td>
              <td>{round1Decimal(avgWeeks)}</td>
              <td>{Math.round(avgDays)}</td>
            </tr>
            {dArr.map( (e, ix)=>{
              const toWeeks = moment.duration(e, 'minutes').asWeeks();
              const toDays = moment.duration(e, 'minutes').asDays();
              return(
                <tr key={'t'+ix}>
                  <td></td>
                  <td>{round1Decimal(toWeeks)}</td>
                  <td>{Math.round(toDays)}</td>
                </tr>
            )})}
          </Fragment>
        )})}
      </tbody>
    </table>
  
  
  );
};

export default BuildDurration;