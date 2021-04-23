import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

function flowGo(serial) {
  Meteor.call('serialLookup', serial, (error, reply)=>{
    error && console.log(error);
    reply ? FlowRouter.go(`/data/batch?request=${reply}&specify=${serial}`)
    : toast.warn('Not an internal serial number');
  });
}

const SubItemLink = ({ seriesId, serial, nestedSerial, debugPull })=> {
  
  function handleFix() {
    if(seriesId && serial && nestedSerial && debugPull) {
      Meteor.call('DEBUGpullSubItem', seriesId, serial, nestedSerial);
    }
  }
  
  const auth = Roles.userIsInRole(Meteor.userId(), 'admin') &&
                Roles.userIsInRole(Meteor.userId(), 'debug');
                
  if(debugPull && auth) {
    return(
      <span>
        <button
          className='inlineLink'
          onClick={()=>flowGo(nestedSerial)}
          disabled={!Pref.regexSN.test(nestedSerial)}
          readOnly
        >{nestedSerial}</button>
        <button
          className='miniAction gap redT'
          onClick={()=>handleFix()}
          readOnly
        >remove</button>
      </span>
    );
  }
  return(
    <button
      className='inlineLink'
      onClick={()=>flowGo(nestedSerial)}
      disabled={!Pref.regexSN.test(nestedSerial)}
      readOnly
    >{nestedSerial}</button>
  );
};

export default SubItemLink;