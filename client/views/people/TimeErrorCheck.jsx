import React, { useState } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import UserNice from '/client/components/smallUi/UserNice';

const TimeErrorCheck = ()=> {
  
  const [ working, workingSet ] = useState(false);
  const [ result, resultSet ] = useState(false);
  
  const handleFetch = ()=>{
    workingSet(true);
    Meteor.call('fetchErrorTimes', Pref.tooManyMin, (err, reply)=>{
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
      <div className='rowWrap'>
        <button
          className='smallAction blackHover'
          onClick={()=>handleFetch()}
          disabled={working}
        >{working ?
          <n-fa0><i className='gap fas fa-spinner fa-lg fa-spin'></i></n-fa0> :
          <n-fa1><i className='gap fas fa-spinner fa-lg'></i></n-fa1>
          } Run Check
        </button>
      </div>
      
      <div className='rowWrapR middle '>
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
          </tr>
        </thead>
        <tbody>
          {result && JSON.parse(result).map( (entry, index)=>(
            <tr key={index}>
              <td><UserNice id={entry[1]} /></td>
              <td>{moment(entry[0]).format('w - ddd')}</td>
              <td>{moment(entry[0]).format('MMM D')}</td>
              <td>{moment(entry[0]).format('YYYY')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TimeErrorCheck;