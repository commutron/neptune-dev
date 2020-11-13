import React, { useState, useEffect } from 'react';
import moment from 'moment';
// import Pref from '/client/global/pref.js';
import { ms2sc, ms2mn, sc2hr } from '/client/utility/Convert';

const TimeConvert = ()=> {

  const [ baseMS, baseMSSet ] = useState(null);
  
  const [ sec, secSet ] = useState(null);
  const [ min, minSet ] = useState(null);
  const [ hr, hrSet ] = useState(null);
  
  function baseUnit(e, val, unit) {
    const toMS = moment.duration(val, unit).asMilliseconds();
    baseMSSet(toMS);
  }
  
  useEffect( ()=> {
    !baseMS ? '' : secSet( ms2sc(baseMS) );
    !baseMS ? '' : minSet( ms2mn(baseMS) );
    !baseMS ? '' : hrSet( sc2hr(baseMS) );
  }, [baseMS]);
  
  return(
    <div>
      <h2>Time Duration</h2>
      
      <div className='rowWrap'>
        
        <label className='gap'>Seconds <var>(sec)</var><br />
          <input
            type='number'
            id='secInput'
            value={sec}
            onInput={(e)=>baseUnit(e, this.secInput.value, "seconds" )}
          />
        </label>
        
        <label className='gap'>Minutes <var>(min)</var><br />
          <input
            type='number'
            id='minInput'
            value={min}
            onInput={(e)=>baseUnit(e, this.minInput.value, "minutes" )}
          />
        </label>
        
        <label className='gap'>Hours <var>(hr)</var><br />
          <input
            type='number'
            id='hrInput'
            value={hr}
            onInput={(e)=>baseUnit(e, this.hrInput.value, "hours" )}
          />
        </label>
        
      </div>
      
    </div>
  );
};

export default TimeConvert;