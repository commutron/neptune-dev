import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';
import AppSetSimple from '/client/components/forms/AppSetSimple';

const ReasonsSlide = ({app})=> {
  
  function reptRemove(key, reason) {
    toast.info('This may take a moment');
    Meteor.call('removeRepeatOption', key, reason, (error, reply)=>{
      if(error)
        console.log(error);
      if(reply) {
        toast.success('entry removed');
      }else{
        toast.warning('Cannot be removed, entry is in use');
      }
    });
  }
  function reptDormant(key, live) {
    const make = !live;
    Meteor.call('dormantRepeatOption', key, make, (error, reply)=>{
      if(error)
        console.log(error);
      if(reply) {
        toast.success('entry de-activated');
      }else{
        toast.warning('Cannot be de-activated, entry is in use');
      }
    });
  }
  
  function altrRemove(reason) {
    Meteor.call('removeAlterFulfillOption', reason, (error, reply)=>{
      if(error)
        console.log(error);
      if(reply) {
        toast.success('Entry removed');
      }else{
        toast.warning('Cannot be removed');
      }
    });
  }
  
  return (
    <div>
      <h2>First-Off / Verify Repeat</h2>
      <p>Options for reason of a repeated first-off or verify</p>
      <em>a new smarter, keyed collection</em>
      <AppSetSimple title='Repeat Reason' action='addRepeatOption' rndmKey={Math.random().toString(36).substr(2, 5)} />
      <ol>
        {app.repeatOption && app.repeatOption.map( (entry)=>{
          return( 
            <li key={entry.key}>
              <i className={entry.live ? '' : 'fade'}>{entry.reason}</i>
              <button 
                className='miniAction redT'
                onClick={()=>reptRemove(entry.key, entry.reason)}
              ><i className='fas fa-times fa-fw'></i></button>
              <button 
                className='miniAction redT'
                onClick={()=>reptDormant(entry.key, entry.live)}
              ><i className='fas fa-power-off fa-fw'></i></button>
            </li>
        )})}
      </ol>
      
      <hr />
      
      <h2>Alter {Pref.end}</h2>
      <p>Options for reason of altering a {Pref.end}</p>
      <AppSetSimple title='Alter Reason' action='addAlterFulfillOption' rndmKey={Math.random().toString(36).substr(2, 5)} />
      <ol>
        {app.alterFulfillReasons && app.alterFulfillReasons.map( (entry, index)=>{
          return( 
            <li key={index}>
              <i>{entry}</i>
              <button 
                className='miniAction redT'
                onClick={()=>altrRemove(entry)}
              ><i className='fas fa-times fa-fw'></i></button>
            </li>
        )})}
      </ol>
    </div>
  );
};

export default ReasonsSlide;