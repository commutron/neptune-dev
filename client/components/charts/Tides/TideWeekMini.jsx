import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { TimeInWeek } from '/client/utility/WorkTimeCalc.js';
import { UserTime } from '/client/utility/WorkTimeCalc.js';
import { round2Decimal } from '/client/utility/Convert.js';
import Pref from '/client/global/pref.js';
import NumStatRing from '/client/components/charts/Dash/NumStatRing.jsx';


const TideWeekMini = ({ tideTimes, dateTime, app, user })=> {
  
  const [ batchTotal, batchSet ] = useState([]);
  const [ durrTotal, durrSet ] = useState(0);
  const [ maxHours, maxHoursSet ] = useState(0);
  
  useEffect( ()=> {
    const weekHours = TimeInWeek( app.nonWorkDays, dateTime );
    
    const proHours = UserTime( user, dateTime, 'week', weekHours );
      
    maxHoursSet(proHours);
  }, [dateTime]);
  
  
  useEffect( ()=> {
    const qBatches = tideTimes.reduce( (allBatch, batch, index, array)=> { 
      const objkey = !batch ? false : batch.batch;
      objkey &&
        objkey in allBatch ? allBatch[objkey]++ : allBatch[objkey] = 1;
      return allBatch;
    }, {});
    const qBatchesClean = _.omit(qBatches, (value, key, object)=> {
      return key == false;
    });
    const bITR = Object.entries(qBatchesClean);
    const bXY = Array.from(bITR, (arr)=> { return {x: arr[0], y: arr[1]} } );
    batchSet(bXY);
    
    const dTotal = tideTimes.reduce( (arr, x)=> { return arr + x.durrAsMin }, 0);
    const durrHr = moment.duration(dTotal, 'minutes').asHours();
    const dTotalNice = round2Decimal(durrHr);
    durrSet(dTotalNice);
    
  }, [tideTimes]);
  
  return(
    <div className='balance middle'>
      
      <NumStatRing
        total={batchTotal.length}
        nums={batchTotal}
        name={batchTotal.length == 1 ? Pref.batch : Pref.batches}
        title={`how many different ${Pref.batches}`}
        colour='blue'
        maxSize='chart10Contain'
      />
      
      <NumStatRing
        total={durrTotal}
        nums={[ durrTotal, ((maxHours) - durrTotal) ]}
        name='Total Hours'
        title={`total of durations in hours \nout of ${maxHours}`}
        colour='blueBi'
        maxSize='chart10Contain'
      />
      
    </div>
  );
};

export default TideWeekMini;