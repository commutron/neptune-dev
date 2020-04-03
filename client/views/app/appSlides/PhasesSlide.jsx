import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

const PhasesSlide = ({app})=> {
  
  const rndmKey1 = Math.random().toString(36).substr(2, 5);

  function removePhaseOp(e, name) {
    Meteor.call('removePhaseOption', name, (error, reply)=>{
      if(error)
        console.log(error);
      if(reply) {
        toast.success(`${Pref.phase} removed`);
      }else{
        toast.warning(`Cannot remove, ${Pref.phase} is in use`);
      }
    });
  }
  
  return (
    <div className='invert'>
      
      <h2 className='cap'><i className='fas fa-route fa-fw'></i> {Pref.phases}</h2>
      <p>Options for Phase [ DEPRECIATED ]</p>
      
      <hr />
      
      <ol>
        {app.phases.map( (entry, index)=>{
          return( 
            <li key={rndmKey1 + index + entry.key}>
              <i>{entry}</i>
              <button 
                className='miniAction redT'
                onClick={(e)=>removePhaseOp(e, entry)}
              ><i className='fas fa-times fa-fw'></i></button>
            </li>
        )})}
      </ol>
      
    </div>
  );
};

export default PhasesSlide;