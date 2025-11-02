import React, { useState, useEffect } from 'react';
import Pref from '/client/global/pref.js';
import moment from 'moment';
import { toast } from 'react-toastify';
import { chunkArray } from '/client/utility/Convert';

import PrintThis from '/client/components/tinyUi/PrintThis';
import PagingSelect from '/client/components/tinyUi/PagingSelect';


const EmailLogSlide = ()=> {
  
  const [ logState, logSet ] = useState([]);
  const [ pageState, pageSet ] = useState(0);
  
  const [ confirmState, confirmSet ] = useState(false);
  
  useEffect( ()=>{
    Meteor.call('fetchEmailLog', (err, re)=>{
      err && console.log(err);
      if(re) {
        logSet( JSON.parse(re).toReversed() );
      }
    });
  }, []);
  
  function handleClear() {
    if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
      Meteor.call('removeEmailLog', (err)=>{
        err && console.log(err);
        toast('Email Log Cleared');
        logSet([]);
        pageSet(0);
      });
      confirmSet(false);
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
          <tr style={{width:'100%',margin:'0 auto',fontFamily:'Verdana, sans-serif'}}>
            <th colSpan={5}>
              <n-print style={{textAlign:'center',letterSpacing:'1px',fontWeight:'600',fontSize:'18px',padding:'0 10px',height:'50px'}}>
                <em>Page {pageState+1}/{inpieces.length}</em> - Handle Securely - Contains Private Customer and Employee Email Addresses.
              </n-print>
            </th>
          </tr>
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
              <td>{moment(entry.sentTime).format('hh:mm a, MMM DD YYYY')}</td>
              <td>{entry.subject}</td>
              <td className='wordBr'>{entry.to}</td>
              <td className='wordBr'>{entry.cc}</td>
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
        {!confirmState ?
          <p><button 
            className='action redHover'
            onClick={()=>confirmSet(true)}
            disabled={!Roles.userIsInRole(Meteor.userId(), 'admin')}
          >Delete Log</button></p>
        :
          <p><b>Permanently Delete All Log Entries? </b>
            <button
              className='action redHover inlineButton'
              onClick={()=>handleClear()}
            >YES, Delete</button>
            <button
              className='action blackHover inlineButton'
              onClick={()=>confirmSet(false)}
            >NO</button>
          </p>
        }
      </div>  
    </div>
  );
};

export default EmailLogSlide;