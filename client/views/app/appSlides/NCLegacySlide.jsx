import React from 'react';
import Pref from '/client/global/pref.js';
import Alert from '/client/global/alert.js';
import AppSetSimple from '/client/components/forms/AppSetSimple';

const NCLegacySlide = ({app})=> {
  
  function ncRemove(e, name) {
    Bert.alert(Alert.wait);
    Meteor.call('removeNCOption', name, (error, reply)=>{
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
      <h2 className='cap'>Legacy {Pref.nonCon} Types</h2>
      <i>Options for types of legacy {Pref.nonCon}s.</i>
      <AppSetSimple
        title='defect'
        action='addNCOption'
        rndmKey={Math.random().toString(36).substr(2, 5)} />
      <ol>
        {app.nonConOption.map( (entry, index)=>{
          return( 
            <li key={index}>
              <i>{entry}</i>
              <button 
                className='miniAction redT'
                onClick={(e)=>ncRemove(e, entry)}
              ><i className='fas fa-times fa-fw'></i></button>
            </li>
        )})}
      </ol>
    </div>
  );
};

export default NCLegacySlide;