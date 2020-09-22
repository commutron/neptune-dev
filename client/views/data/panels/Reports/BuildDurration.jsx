import React, { useState, useEffect, Fragment } from 'react';
// import moment from 'moment';
// import Pref from '/client/global/pref.js';
import { CalcSpin } from '/client/components/tinyUi/Spin.jsx';
import { toast } from 'react-toastify';

import { round1Decimal } from '/client/utility/Convert';

const BuildDuration = ()=> {
  
  const [ result, resultSet ] = useState(false);
  
  useEffect( ()=>{
    Meteor.call('reportOnTurnAround', (err, reply)=>{
      err && console.log(err);
      reply && resultSet(reply);
    });
  }, []);
  
  function exportTable() {
    const dateString = new Date().toLocaleDateString();
    toast(
      <a href={`data:text/plain;charset=UTF-8,${result}`}
        download={`build_durations_${dateString}.txt`}
      >Download Build Durations for {dateString} to your computer as JSON text file</a>
      , {autoClose: false, closeOnClick: false}
    );
  }

  if(!result) {
    return(
      <div>
        <p className='centreText'>fetching...may take several minutes...</p>
        <CalcSpin />
      </div>
    );
  }
  
  return(
    <div className='overscroll wide'>
      <p>Mean average of all orders since records began. Expressed in days.</p>
      <br />
      
      <div className='rowWrapR middle '>
        <button
          className='chartTableAction endSelf'
          title='Download Table'
          onClick={()=>exportTable()}
        ><i className='fas fa-download fa-fw'></i></button>
      </div>
      <table className='wide'>
        <thead>
          <tr>
            <th>Customer</th>
            <th>Sales Start to Release</th>
            <th>Sales Start to Timer Start</th>
            <th>Sales Start to Sales End</th>
            <th>Sales Start to Complete</th>
            </tr>
        </thead>
        <tbody>
          {JSON.parse(result)
            .sort((g1, g2)=> {
              if (g1.group < g2.group) { return -1 }
              if (g1.group > g2.group) { return 1 }
              return 0;
            })
            .map( (entry, index)=>{
              const dArr = entry.durrArray;
              return(
                <Fragment key={index}>
                  <tr>
                    <td colSpan='5' className='medBig bold'
                    >{entry.group.toUpperCase()}</td>
                  </tr>
                  {dArr
                    .sort((w1, w2)=> {
                      if (w1[0] < w2[0]) { return -1 }
                      if (w1[0] > w2[0]) { return 1 }
                      return 0;
                    })
                    .map( (e, ix)=>{
                      return(
                        <tr key={'t'+ix}>
                          <td className='small'>{ e[0].toUpperCase() }</td>
                          <td>{ round1Decimal(e[1]) }</td>
                          <td>{ e[2] ? round1Decimal(e[2]) : null }</td>
                          <td>{ round1Decimal(e[3]) }</td>
                          <td>{ round1Decimal(e[4]) }</td>
                        </tr>
                  )})}
              </Fragment>
          )})}
        </tbody>
      </table>
    </div>
  );
};

export default BuildDuration;