import React, { useState } from 'react';
//import moment from 'moment';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelMedium from '../smallUi/ModelMedium.jsx';

// required data
/// batchId={b._id}
/// batchNow={b.batch}
/// versionNow={vKey}
/// versions={w.versions}
/// lock={!w.versions}

export const AlterFulfill = ({ batchId, end, app, lock })=> {

  const [ reasonState, reasonSet ] = useState(false);

  function save(e) {
    e.preventDefault();
    
    const endDate = e.target.eDate.value;
    
    Meteor.call('alterBatchFulfill', batchId, end, endDate, reasonState, (error, reply)=>{
      if(error) {
        console.log(error);
        toast.error('Server Error');
      }
      if(reply) {
        toast.success('Saved');
      }else{
        toast.warning('Not Saved');
      }
    });
  }
    
  return (
    <ModelMedium
      button={'Alter ' + Pref.end}
      title={`Alter ${Pref.batch} ${Pref.end}`}
      color='blueT'
      icon='fa-calendar-alt'
      smIcon={true}
      lock={!Roles.userIsInRole(Meteor.userId(), ['edit', 'sales']) || lock}
      noText={true}>
      <form className='centre' onSubmit={(e)=>save(e)}>
        <div className='centreRow'>
          {app.alterFulfillReasons && 
            app.alterFulfillReasons.map( (entry, index)=>{
              return(
                <label 
                  key={index}
                  htmlFor={entry+index} 
                  className='beside breath'>
                  <input
                    type='radio'
                    id={entry+index}
                    name='rsn'
                    className='inlineRadio cap'
                    defaultChecked={reasonState === entry}
                    onChange={()=>reasonSet(entry)}
                    required 
                />{entry}</label>
          )})}
        </div>
        <p>
          <label htmlFor='eDate' className='breath'>{Pref.end}<br />
          <input
            type='date'
            id='eDate'
            className='numberSet'
            defaultValue={end}
            required 
          /></label>
        </p>
        <p><button type='submit' className='action clear greenHover'>Save</button></p>
      </form>
    </ModelMedium>
  );
};