import React, { useState } from 'react';
import { toast } from 'react-toastify';
// import Pref from '/public/pref.js';
import moment from 'moment';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/airbnb.css';

import ModelNative from '/client/layouts/Models/ModelNative';

const CounterOverride = ({ bID, quantity, waterfall, floorRelease })=> {
  
  const [ forceWFBulk, forceWFBulkSet ] = useState( false );
  
  return(
    <ModelNative
      dialogId={bID+'_countoverride_form'}
      title='Set Counter Override'
      icon='fa-solid fa-bars-progress'
      colorT='nT'>

      <div className='space centre'>
        <p>
          <span>
            <select
              id='openwaterfallSelector'
              className='dbbleWide'
              onChange={(e)=>forceWFBulkSet(e.target.value)}
              value={forceWFBulk}
              required>
              <option></option>
              {waterfall.map( (wf)=> {
                return(
                  <option 
                    key={'select'+wf.wfKey} 
                    value={wf.wfKey} 
                    disabled={wf.counts.length !== 0}
                  >{wf.gate} {wf.type}</option> 
              )})}
            </select>
            <label htmlFor='titleVal'>Counter</label>
          </span>
        </p>
        
        {waterfall.map( (wf)=> {
          if(wf.wfKey === forceWFBulk) {
            return(
              <CounterTimePicker
                key={'date'+wf.wfKey}
                bID={bID}
                maxtick={wf.type === 'slider' ? 100 : quantity}
                wtrfllKey={wf.wfKey}
                floorRelease={floorRelease}
                clear={()=>forceWFBulkSet(false)}
              /> 
            );
          }else{
            return null;
          }
        })}
      </div>
    </ModelNative>
  );
};

export default CounterOverride;


const CounterTimePicker = ({ bID, maxtick, wtrfllKey, floorRelease, clear })=> {

  const [ forcedatetime, forcedatetimeSet ] = useState( moment().format() );
  
  function handleoverrideDatetime(e) {
    const input = this.cntrOvrdDateTime.value;
    forcedatetimeSet( moment(input).format() );
  }
  function saveCounterOverride(e) {
    this.gocntovrrd.disabled = true;
   
    Meteor.call('pushCounterOverrideEvent', bID, wtrfllKey, forcedatetime, maxtick, (error, re)=>{
      error && console.log(error);
      if(re) { 
        toast.success('Saved');
        clear();
      }
    });
  }
  
  return(
    <div id='cntrOvrdSetBack'>
      <p>
        <Flatpickr
          id='cntrOvrdDateTime'
          value={forcedatetime}
          className='minWide'
          onChange={(e)=>handleoverrideDatetime(e)}
          options={{
            minDate: moment(floorRelease.time).format(),
            maxDate: moment().format(),
            minuteIncrement: 1,
            enableTime: true,
            time_24hr: false,
            altInput: true,
            altFormat: "Y-m-d G:i K",
            inline: true
          }}
        />
      </p>
      <p className='centreText'>
        <button
          type='button'
          id='gocntovrrd'
          className='action nSolid'
          onClick={(e)=>saveCounterOverride(e)}
        >Save Full Count</button>
      </p>
    </div>
  );
};