import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';
import AppSetSimple from '/client/components/forms/AppSetSimple';

const PhasesSlide = ({app})=> {
  
  const rndmKey1 = Math.random().toString(36).substr(2, 5);
  const rndmKey2 = Math.random().toString(36).substr(2, 5);
  
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
  
  function endTrack() {
    const last = this[rndmKey2 + 'dnTrk'].value;
    Meteor.call('endTrack', last, (error, reply)=>{
      if(error)
        console.log(error);
      if(reply) {
        toast.success('Saved');
      }else{
        toast.danger('Server Error');
      }
    });
  }
  
  let lt = app.lastTrack;
  let df = lt.step + '|' + lt.type + '|' + lt.how;
  
  return (
    <div className='invert'>
      
      <h2 className='cap'><i className='fas fa-route fa-fw'></i> {Pref.phases}</h2>
      <p>Options for Phase / Department / Tracking Catagory</p>
      <p>
        <i className='fas fa-exclamation-circle'></i>
        <i> Entries are case sensitive, smt =/= SMT.</i>
        <i> Capitalizing is unnecessary in most cases and only recommended for abbreviations.</i>
      </p>
        
      <AppSetSimple
        title={Pref.phase}
        action='addPhaseOption'
        rndmKey={rndmKey1} />
      <ol>
        {app.phases.map( (entry, index)=>{
          return( 
            <li key={rndmKey1 + index + entry.key}>
              <i>{entry}</i>
              {entry !== 'finish' &&
                <button 
                  className='miniAction redT'
                  onClick={(e)=>removePhaseOp(e, entry)}
                ><i className='fas fa-times fa-fw'></i></button>}
            </li>
        )})}
      </ol>

      
      <h2><i className='fas fa-flag-checkered fa-fw'></i> Finish Step</h2>
      <div>
      
        <i>the step that marks a {Pref.item} as finished</i>
        <label htmlFor={rndmKey2 + 'dnTrk'}><br />
          <select
            id={rndmKey2 + 'dnTrk'}
            onChange={(e)=>endTrack(e)}
            defaultValue={df}
            required
          >
            <option value='finish|finish|finish'>Finish</option>
            <option value='pack|finish|pack'>Pack</option>
            <option value='ship|finish|ship'>Ship</option>
          </select>
        </label>
      
      </div>
    </div>
  );
};

export default PhasesSlide;