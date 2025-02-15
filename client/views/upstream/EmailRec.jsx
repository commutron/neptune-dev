import React, { useState, useEffect } from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import { MultiSelect } from "react-multi-select-component";

const EmailRec = ({ app, users })=> {
  
  const pcbEmails = app.emailpcbKit || [];

  const lockOut = !Roles.userIsInRole(Meteor.userId(), ['admin','run','sales']);	
  
  const [ eList, eListSet ] = useState( [] );
  const [ emailChoice, emailChoiceSet ] = useState( [] );

  useEffect( ()=>{
    const liveUsers = (users || []).filter( x => Roles.userIsInRole(x._id, 'active') && 
                                                !Roles.userIsInRole(x._id, 'readOnly') );
    const listUsers = Array.from(liveUsers, x => { return { label: x.username, value: x._id } } );
    eListSet(listUsers);
    
    const emDefault = listUsers.filter( x => pcbEmails.find( y => y === x.value ));
    emailChoiceSet(emDefault);
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
    <div className='space5x5'>
      <h2 className='med cap'>Email to Notify on New {Pref.widget} {Pref.baseSerialPart} Clearance.</h2>
      <p className='indent'
        >If {Pref.xBatch} is the first of a {Pref.widget} {Pref.variant} then an emails will be sent to these users upon Upstream clearance.</p> 
      <p className='indent'
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
                className='action nSolid'
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
    </div>
  );
};

export default EmailRec;