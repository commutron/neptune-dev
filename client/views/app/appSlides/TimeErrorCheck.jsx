import React, { useState } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import UserNice from '/client/components/smallUi/UserNice';

const TimeErrorCheck = ()=> {
  
  const [ working, workingSet ] = useState(false);
  const [ result, resultSet ] = useState(false);
  
  const handleFetch = (run_on_db)=>{
    workingSet(true);
    Meteor.call('fetchErrorTimes', Pref.tooManyMin, run_on_db, (err, reply)=>{
      err && console.log(err);
      if(reply) {
        resultSet(reply);
        workingSet(false);
      }
    });
  };
  
  function exportTable() {
    const dateString = new Date().toLocaleDateString();
    toast(
      <a href={`data:text/plain;charset=UTF-8,${result}`}
        download={`build_pace_${dateString}.txt`}
      >Download Build Pace for {dateString} to your computer as JSON text file</a>
      , {autoClose: false, closeOnClick: false}
    );
  }
  
  return(
    <div className='overscroll wide space5x5'>
      <h3>Check for Time durations greater than {Pref.tooManyMin} minutes</h3>
      <p className='small'>aka a full day without any breaks</p>
      <p>Will automatically correct abandoned stop time blocks.</p>
      <p><b>Resource intensive function. Run during idle times.</b></p>
      <br />
      <div className='rowWrap gapsC'>
        <button
          className='action blueSolid'
          onClick={()=>handleFetch('db_xbatch')}
          disabled={working}
        >{working ?
          <n-fa0><i className='gap fas fa-spinner fa-lg fa-spin'></i></n-fa0> :
          <n-fa1><i className='gap fas fa-spinner fa-lg'></i></n-fa1>
          } Run Check On XBatch
        </button>
        <button
          className='action wetSolid'
          onClick={()=>handleFetch('db_time')}
          disabled={working}
        >{working ?
          <n-fa0><i className='gap fas fa-spinner fa-lg fa-spin'></i></n-fa0> :
          <n-fa1><i className='gap fas fa-spinner fa-lg'></i></n-fa1>
          } Run Check On TimeDB
        </button>
      </div>
      
      <div className='rowWrapR beside '>
        <button
          className='chartTableAction endSelf'
          title='Download Table'
          onClick={()=>exportTable()}
        ><i className='fas fa-download fa-fw'></i></button>
      </div>
      <table className='wide centreText'>
        <thead>
          <tr>
            <th>Person</th>
            <th>Week Day</th>
            <th>Month Day</th>
            <th>Year</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {result && JSON.parse(result).map( (entry, index)=>(
            <tr key={index}>
              <td><UserNice id={entry[1]} /></td>
              <td>{moment(entry[0]).format('w - ddd')}</td>
              <td>{moment(entry[0]).format('MMM D')}</td>
              <td>{moment(entry[0]).format('YYYY')}</td>
              <td>{entry[2] && 'AUTOFIX'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TimeErrorCheck;