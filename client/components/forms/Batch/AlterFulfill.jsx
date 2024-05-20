import React, { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment-business-time';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelSmall from '/client/components/smallUi/ModelSmall';
import PriorityKPIData from '/client/components/smallUi/StatusBlocks/PriorityKPI';


const AlterFulfill = ({ 
  batchId, createdAt, batch, end, app, canDo, lock, 
  noText, lgIcon, cleanIcon
})=> {
  const aT = !canDo ? Pref.norole : '';
  const lT = lock ? lock : '';
  const title = canDo && !lock ? `Alter ${batch || Pref.xBatch} ${Pref.end}` : `${aT}\n${lT}`;
  return(
    <ModelSmall
      button='Alter'
      title={title}
      color='blueT'
      icon='far fa-calendar-alt'
      lock={!canDo || lock}
      noText={noText}
      lgIcon={lgIcon}
      cleanIcon={cleanIcon}
    >
      <AlterFulfillForm
        batchId={batchId}
        createdAt={createdAt}
        end={end}
        app={app} 
      />
    </ModelSmall>
  );
};

export default AlterFulfill;

const AlterFulfillForm = ({ batchId, createdAt, end, app, selfclose })=> {

  const [ reasonState, reasonSet ] = useState(false);
  const [ endDateState, endDateSet ] = useState( end );
  
  const [ loadState, loadSet ] = useState( null );
  
  useEffect( ()=> {
    Meteor.call('mockDayShipLoad', endDateState, (error, reply)=>{
      error && console.log(error);
      loadSet(reply);
    });
  }, [endDateState]);
  
  function save(e) {
    e.preventDefault();
    
    const correctedEnd = moment(endDateState).endOf('day').format();
    
    Meteor.call('alterBatchXFulfill', batchId, end, correctedEnd, reasonState, 
    (error, reply)=>{
      if(error) {
        console.log(error);
        toast.error(error.reason || 'Server Error');
      }
      if(reply) {
        toast.success('Saved');
        selfclose();
      }else{
        toast.warning('Not Saved');
      }
    });
  }
  
  const daymoment = moment(endDateState);
  const shipAim = daymoment.isShipDay() ? daymoment.format('YYYY-MM-DD') :
                  daymoment.lastShippingTime().format('YYYY-MM-DD');
   
  return(
    <form className='centre vmargin' onSubmit={(e)=>save(e)}>
      <div className='centreRow max600'>
        {(app.alterFulfillReasons || []).map( (entry, index)=>{
            return(
              <label 
                key={index}
                htmlFor={entry+index} 
                className='beside breath medSm'>
                <input
                  type='radio'
                  id={entry+index}
                  name='rsn'
                  className='inlineRadio cap'
                  defaultChecked={reasonState === entry}
                  onChange={()=>reasonSet(entry)}
                  required={app.alterFulfillReasons ? true : false}
              />{entry}</label>
        )})}
      </div>
      <p>
        <label htmlFor='eDate' className='breath'>{Pref.salesOrder} {Pref.end}</label><br />
        <span className='inlineForm'>
          <input
            type='date'
            id='eDate'
            className='numberSet'
            min={moment(createdAt).format('YYYY-MM-DD')}
            defaultValue={moment(end).format('YYYY-MM-DD')}
            onChange={(e)=>endDateSet(e.target.value)}
            required 
          /><button type='submit' className='smallAction nHover'>Save</button>
        </span>
      </p>
      
      <hr className='nomargin w100' />
      
      <p className='nomargin clean'>The nearest ship day is {shipAim}</p>
      
      {loadState === null ? <em>...</em> :
       <p className='nomargin nospace clean'
        ><b>{loadState}</b> incomplete {Pref.xBatchs} are scheduled for this ship day</p>
      }
      
      <div className='balance vmarginhalf'>
        <PriorityKPIData
          batchID={batchId}
          app={app}
          mockDay={endDateState}
          stOpen={true}
        />
      </div>
    </form>
  );
};