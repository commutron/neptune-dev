import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

const FinishSlide = ({app})=> {
  
  const rndmKey = Math.random().toString(36).substr(2, 5);
  
  function endTrack() {
    const last = this[rndmKey + 'dnTrk'].value;
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
    <div>
      <h2 className='cap'>final {Pref.trackProcess} step</h2>
      <i>the step that marks a {Pref.item} as finished</i>
      <label htmlFor={rndmKey + 'dnTrk'}><br />
        <select
          id={rndmKey + 'dnTrk'}
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
  );
};

export default FinishSlide;