import React from 'react';
import Pref from '/client/global/pref.js';
import Alert from '/client/global/alert.js';
import AppSetSimple from '/client/components/forms/AppSetSimple';

const NCTypeSlide = ({app})=> {
  
  function ncRemoveA(key, defect) {
    Bert.alert(Alert.wait);
    Meteor.call('removePrimaryNCOption', key, defect, (error, reply)=>{
      if(error)
        console.log(error);
      if(reply) {
        Bert.alert(Alert.success);
      }else{
        Bert.alert(Alert.inUse);
      }
    });
  }
  function ncDormantA(key, live) {
    const make = !live;
    Meteor.call('dormantPrimaryNCOption', key, make, (error, reply)=>{
      if(error)
        console.log(error);
      if(reply) {
        Bert.alert(Alert.success);
      }else{
        Bert.alert(Alert.inUse);
      }
    });
  }
  
  function ncRemoveB(key, defect) {
    Bert.alert(Alert.wait);
    Meteor.call('removeSecondaryNCOption', key, defect, (error, reply)=>{
      if(error)
        console.log(error);
      if(reply) {
        Bert.alert(Alert.success);
      }else{
        Bert.alert(Alert.inUse);
      }
    });
  }
  function ncDormantB(key, live) {
    const make = !live;
    Meteor.call('dormantSecondaryNCOption', key, make, (error, reply)=>{
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
      <h2 className='cap'>Primary {Pref.nonCon} Types</h2>
      <p>Options for types of Primary {Pref.nonCon}s</p>
      <i>a new smarter, keyed collection for serialized batches</i>
      <AppSetSimple
        title='defect'
        action='addPrimaryNCOption'
        rndmKey={Math.random().toString(36).substr(2, 5)} />
      <ol>
        {app.nonConOptionA && app.nonConOptionA.map( (entry)=>{
            return( 
              <li key={entry.key}>
                <i className={entry.live ? '' : 'fade'}>{entry.defect}</i>
                <button 
                  className='miniAction redT'
                  onClick={()=>ncRemoveA(entry.key, entry.defect)}
                ><i className='fas fa-times fa-fw'></i></button>
                <button 
                  className='miniAction redT'
                  onClick={()=>ncDormantA(entry.key, entry.live)}
                ><i className='fas fa-power-off fa-fw'></i></button>
              </li>
        )})}
      </ol>
      
      <hr />
      
      <h2 className='cap'>Secondary {Pref.nonCon} Types</h2>
      <p>Options for types of Secondary {Pref.nonCon}s</p>
      <i>a new smarter, keyed collection for NON serialized batches</i>
      <AppSetSimple
        title='defect'
        action='addSecondaryNCOption'
        rndmKey={Math.random().toString(36).substr(2, 5)} />
      <ol>
        {app.nonConOptionB && app.nonConOptionB.map( (entry)=>{
          return( 
            <li key={entry.key}>
              <i className={entry.live ? '' : 'fade'}>{entry.defect}</i>
              <button 
                className='miniAction redT'
                onClick={()=>ncRemoveB(entry.key, entry.defect)}
              ><i className='fas fa-times fa-fw'></i></button>
              <button 
                className='miniAction redT'
                onClick={()=>ncDormantB(entry.key, entry.live)}
              ><i className='fas fa-power-off fa-fw'></i></button>
            </li>
        )})}
      </ol>
    </div>
  );
};

export default NCTypeSlide;