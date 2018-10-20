import React from 'react';
import Pref from '/client/global/pref.js';
import Alert from '/client/global/alert.js';
import AppSetSimple from '/client/components/forms/AppSetSimple';

const RepeatSlide = ({app})=> {
  
  function reptRemove(key, reason) {
    Bert.alert(Alert.wait);
    Meteor.call('removeRepeatOption', key, reason, (error, reply)=>{
      if(error)
        console.log(error);
      if(reply) {
        Bert.alert(Alert.success);
      }else{
        Bert.alert(Alert.inUse);
      }
    });
  }
  function reptDormant(key, live) {
    const make = !live;
    Meteor.call('dormantRepeatOption', key, make, (error, reply)=>{
      if(error)
        console.log(error);
      if(reply) {
        Bert.alert(Alert.success);
      }else{
        Bert.alert(Alert.inUse);
      }
    });
  }
  
  return (
    <div>
      <h2>First-Off / Verify Repeat</h2>
      <p>Options for reason of a repeated first-off or verify</p>
      <i>a new smarter, keyed collection</i>
      <AppSetSimple title='Reason' action='addRepeatOption' rndmKey={Math.random().toString(36).substr(2, 5)} />
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
    </div>
  );
};

export default RepeatSlide;