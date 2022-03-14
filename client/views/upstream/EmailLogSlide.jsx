import React, { useState, useEffect } from 'react';
import Pref from '/client/global/pref.js';
import moment from 'moment';
import { toast } from 'react-toastify';
import { chunkArray } from '/client/utility/Convert';

import MultiSelect from "react-multi-select-component";
import PrintThis from '/client/components/tinyUi/PrintThis';
import PagingSelect from '/client/components/tinyUi/PagingSelect';


const EmailLogSlide = ({ app, users })=> {
  
  const [ lockState, lockSet ] = useState(true);
  
  const [ logState, logSet ] = useState([]);
  const [ pageState, pageSet ] = useState(0);
  
  const [ confirmState, confirmSet ] = useState(false);
  
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
    Meteor.call('removeEmailLog', (err, re)=>{
      err && console.log(err);
      toast('Email Log Cleared');
      logSet([]);
      pageSet(0);
    });
    confirmSet(false);
  }
  
  const inpieces = chunkArray(logState, Pref.pagingSize);
  
  return(
    <div className='space'>
      <EmailsForm 
        pcbEmails={app.emailpcbKit}
        users={users}
      />
      
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
            disabled={lockState}
          >Delete Log</button></p>
        :
          <p><b>Permanently Delete All Log Entries? </b>
            <button
              className='action redHover inlineButton'
              onClick={()=>handleClear()}
            >YES, Delete</button>
            <button
              className='action blackHover inlineButton'
              onClick={(e)=>confirmSet(false)}
            >NO</button>
          </p>
        }
      </div>  
    </div>
  );
};

export default EmailLogSlide;

const EmailsForm = ({ pcbEmails, users })=> {
  
  const lockOut = !Roles.userIsInRole(Meteor.userId(), ['admin','run','sales']);	
  
  const [ eList, eListSet ] = useState( [] );
  const [ emailChoice, emailChoiceSet ] = useState( [] );

  useEffect( ()=>{
    const liveUsers = users.filter( x => Roles.userIsInRole(x._id, 'active') && 
                                        !Roles.userIsInRole(x._id, 'readOnly') );
    const listUsers = Array.from(liveUsers, x => { return { label: x.username, value: x._id } } );
    eListSet(listUsers);
  }, []);
  
  
  function addPCBEmail(e) {
    e.preventDefault(e);
    
    const emailUsers = Array.from(emailChoice, u => u.value);

    if(emailUsers) {
      Meteor.call('pcbEmailSet', emailUsers, (error, reply)=>{
        error && toast.error(error.reason || 'Error');
        reply && toast.success('New Email Saved');
      });
    }else{
      null;
    }
  }
  
  function clearPCBEmail(address) {
    Meteor.call('pcbEmailRemove', address, (error, reply)=>{
      error && toast.error(error.reason || 'Error');
      reply ? toast.success('Email Removed') : toast.warning('Email Cannot be removed');
    });
  }
  
  return(
    <details className='blueBorder noPrint'>
      <summary className='med cap'><i className="fa-solid fa-at gapR"></i> Email to Notify on New {Pref.widget} {Pref.baseSerialPart} clearence</summary>
      <p className='indent'
        >If {Pref.xBatch} is the first of a {Pref.widget} {Pref.variant} then an emails will be sent to these users upon Upstream clearance.</p> 
      <p className='small nospace indent'
        >If a person does not have a email address set, they will be sent an internal Neptune message.</p>
              
      <div className='balancer'>
        <div className='min300 max500'>
          <form onSubmit={(e)=>addPCBEmail(e)} disabled={lockOut}>
            <h4>Set Email Addresses</h4>
            
            <span>
              <div className='vmargin'>
                <label htmlFor='userPCBNotify' className='emailForm'>
                  <MultiSelect
                    id='userPCBNotify'
                    options={eList}
                    value={emailChoice}
                    onChange={(e)=>emailChoiceSet(e)}
                    labelledBy='Select people to email'
                    className='multi-select'
                    hasSelectAll={false}
                    disableSearch={false}
                />Notify People by Email</label>
              </div>
            </span>
            <p> 
              <button
                type='submit'
                id='addPCBEmailSubmit'
                className='action clearBlue'
                disabled={lockOut}
               >Save Emails</button>
            </p>
          </form>
        </div>
        
        <div>
          <h4>Currently Emailing</h4>
          <dl className='vmargin'>
            {Array.isArray(pcbEmails) && pcbEmails.map( (entry, index)=>{
              const niceName = eList.find( x => x.value === entry );
              if(niceName) {
                return( 
                  <dt key={index} className='comfort bottomLine'>
                    <i>{niceName.label}</i>
                    <button 
                      className='miniAction redT'
                      onClick={()=>clearPCBEmail(entry)}
                    ><i className='fas fa-times fa-fw'></i> remove</button>
                  </dt>
                );
              }else{null}
            })}
          </dl>
        </div>
      </div>
    </details>
  );
};