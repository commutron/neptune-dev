import React, { useState, useEffect, Fragment } from 'react';
import moment from 'moment';
// import Pref from '/client/global/pref.js';
import { CalcSpin } from '/client/components/tinyUi/Spin.jsx';
// import ReportStatsTable from '/client/components/tables/ReportStatsTable.jsx'; 
// import NumLine from '/client/components/tinyUi/NumLine.jsx';

import { round1Decimal } from '/client/utility/Convert';
import { avgOfArray } from '/client/utility/Convert';


const BuildDurration = ()=> {
  
  const [ result, resultSet ] = useState(false);
  
  useEffect( ()=>{
    Meteor.call('reportOnTurnAround', (err, reply)=>{
      err && console.log(err);
      reply && resultSet(reply);
    });
  }, []);

  if(!result) {
    return(
      <div>
        <p className='centreText'>fetching...</p>
        <CalcSpin />
      </div>
    );
  }
  
  return(
    <div className='overscroll'>
      <p>since records began. expressed in days.</p>
      <p><em>a negative number would indicate a user improperly backdated an entry</em></p>
      <br />
      
      <table className='wide'>
        <thead><tr>
          <th>Customer</th>
          <th>Sale Start to Release</th>
          <th>Sales Start to Timer Start</th>
          <th>Sales Start to Sales End</th>
          <th>Sales Start to Complete</th>
        </tr></thead>
        <tbody>
          {JSON.parse(result).map( (entry, index)=>{
            const dArr = entry.durrArray;
            const relAvg = avgOfArray( Array.from(dArr, x => x[1]) );
            const stAvg = avgOfArray( Array.from(dArr, x => x[2]) );
            const endAvg = avgOfArray( Array.from(dArr, x => x[3]) );
            const compAvg = avgOfArray( Array.from(dArr, x => x[4]) );
            
            return(
              <Fragment key={index}>
                <tr>
                  <td colSpan='5' className='medBig bold'
                  >{entry.group.toUpperCase()}</td>
                </tr>
                <tr className='med bold'>
                  <td>averages</td>
                  <td>{round1Decimal(relAvg)}</td>
                  <td>{round1Decimal(stAvg)}</td>
                  <td>{round1Decimal(endAvg)}</td>
                  <td>{round1Decimal(compAvg)}</td>
                </tr>
                
                
                {dArr.map( (e, ix)=>{
                  return(
                    <tr key={'t'+ix}>
                      <td className='small'>{ e[0].toUpperCase() }</td>
                      <td>{ Math.round(e[1]) }</td>
                      <td>{ e[2] ? Math.round(e[2]) : null }</td>
                      <td>{ Math.round(e[3]) }</td>
                      <td>{ Math.round(e[4]) }</td>
                    </tr>
                )})}
            
            </Fragment>
          )})}
        </tbody>
      </table>
    </div>
  );
};

export default BuildDurration;