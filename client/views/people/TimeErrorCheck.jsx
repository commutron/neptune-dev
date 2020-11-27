import React, { useState, useEffect } from 'react';
import moment from 'moment';
// import Pref from '/client/global/pref.js';
import { CalcSpin } from '/client/components/tinyUi/Spin.jsx';
import { toast } from 'react-toastify';

import UserNice from '/client/components/smallUi/UserNice.jsx';

const TimeErrorCheck = ()=> {
  
  const [ result, resultSet ] = useState(false);
  
  useEffect( ()=>{
    Meteor.call('fetchErrorTimes', (err, reply)=>{
      err && console.log(err);
      reply && resultSet(reply);
    });
  }, []);
  
  function exportTable() {
    const dateString = new Date().toLocaleDateString();
    toast(
      <a href={`data:text/plain;charset=UTF-8,${result}`}
        download={`build_pace_${dateString}.txt`}
      >Download Build Pace for {dateString} to your computer as JSON text file</a>
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
    <div className='overscroll wide space5x5'>
      <p>Time durrations greater than 500 minutes</p>
      <br />
      
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
          {JSON.parse(result).map( (entry, index)=>(
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