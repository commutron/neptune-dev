import React, { useState } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelMedium from '/client/components/smallUi/ModelMedium.jsx';
import PrioritySquareData from '/client/components/smallUi/StatusBlocks/PrioritySquare.jsx';


export const AlterFulfill = ({ batchId, isX, end, app, lock })=> (
  <ModelMedium
    button={'Alter ' + Pref.end}
    title={`Alter ${Pref.batch} ${Pref.end}`}
    color='blueT'
    icon='fa-calendar-alt'
    lock={!Roles.userIsInRole(Meteor.userId(), ['edit', 'sales']) || lock}
    noText={true}>
    <AlterFulfillForm
      batchId={batchId}
      isX={isX}
      end={end}
      app={app} />
  </ModelMedium>
);


const AlterFulfillForm = ({ batchId, isX, end, app, selfclose })=> {

  const [ reasonState, reasonSet ] = useState(false);
  const [ endDateState, endDateSet ] = useState( end );
  
  function save(e) {
    e.preventDefault();
    
    const callMthd = !isX ? 'alterBatchFulfill' : 'alterBatchXFulfill';
    
    const clientTZ = moment.tz.guess();
    
    Meteor.call(callMthd, batchId, end, endDateState, reasonState, clientTZ, (error, reply)=>{
      if(error) {
        console.log(error);
        toast.error('Server Error');
      }
      if(reply) {
        toast.success('Saved');
        selfclose();
      }else{
        toast.warning('Not Saved');
      }
    });
  }
    
  return(
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
          onChange={(e)=>endDateSet(e.target.value)}
          required 
        /></label>
        <button type='submit' className='action clear greenHover'>Save</button>
      </p>
      <div className='vmarginhalf'>
        <PrioritySquareData
          batchID={batchId}
          app={app}
          mockDay={endDateState}
          showExtra={true} />
      </div>
    </form>
  );
};