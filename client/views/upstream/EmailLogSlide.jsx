import React, { useState, useEffect } from 'react';
import Pref from '/client/global/pref.js';
import moment from 'moment';
import { toast } from 'react-toastify';
import { chunkArray } from '/client/utility/Convert';

import PrintThis from '/client/components/tinyUi/PrintThis';
import PagingSelect from '/client/components/tinyUi/PagingSelect';


const EmailLogSlide = ({ app })=> {
  
  const [ lockState, lockSet ] = useState(true);
  
  const [ logState, logSet ] = useState([]);
  const [ pageState, pageSet ] = useState(0);
  
  useEffect( ()=>{
    Meteor.call('fetchEmailLog', (err, re)=>{
      err && console.log(err);
      if(re) {
        const log = JSON.parse(re);
        const LOg = log.sort((l1, l2)=>
            l1.sentTime > l2.sentTime ? -1 : l1.sentTime < l2.sentTime ? 1 : 0);
        logSet(LOg);
      }
    });
    
    lockSet(!Roles.userIsInRole(Meteor.userId(), 'run'));
  }, []);
  
  function handleClear() {
    const check = window.confirm('Permanently Delete All Log Entries?');
    if(check) {
      Meteor.call('removeEmailLog', (err, re)=>{
        err && console.log(err);
        toast('Email Log Cleared');
        logSet([]);
        pageSet(0);
      });
    }
  }
  
  const inpieces = chunkArray(logState, Pref.pagingSize);
  
  return(
    <div className='space'>
      <div className='noPrint rowWrap'>
        <span className='flexSpace' />
        <PrintThis />
      </div>
      
      <PagingSelect 
        multiArray={inpieces}
        isSet={pageState}
        doChange={(e)=>pageSet(e)}
      />
          
      <table className='wide cap'>
        <thead>
          <tr className='leftText'>
            <th>Sent (Local Time)</th>
            <th>Subject</th>
            <th>To</th>
            <th>CC</th>
            <th className='noRightBorder'>Summary</th>
          </tr>
        </thead>
        {(inpieces[pageState] || []).map( (entry, index)=>(
          <tbody key={index}>
            <tr className='clean'>
              <td className='numFont'>{moment(entry.sentTime).format('hh:mm a, MMM DD YYYY')}</td>
              <td>{entry.subject}</td>
              <td>{entry.to}</td>
              <td>{entry.cc}</td>
              <td className='noRightBorder'>{entry.text}</td>
            </tr>
          </tbody>
        ))}
      </table>
      
      <PagingSelect 
        multiArray={inpieces}
        isSet={pageState}
        doChange={(e)=>pageSet(e)}
      />
      
      <div className='noPrint rowWrap'>
        <span className='flexSpace' />
        <button 
          className='action redHover'
          onClick={()=>handleClear()}
          disabled={lockState}
        >Delete Log</button>
      </div>  
    </div>
  );
};

export default EmailLogSlide;