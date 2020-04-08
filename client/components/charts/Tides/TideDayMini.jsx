import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { TimeInDay } from '/client/components/utilities/WorkTimeCalc.js';
import Pref from '/client/global/pref.js';
import NumStatRing from '/client/components/charts/Dash/NumStatRing.jsx';


const TideDayMini = ({ tideTimes, dateTime, showUser, app })=> {
  
  const [ userTotal, userSet ] = useState(0);
  const [ batchTotal, batchSet ] = useState([]);
  const [ durrTotal, durrSet ] = useState(0);
  const [ maxHours, maxHoursSet ] = useState(0);
  
  useEffect( ()=> {
    const dayHours = TimeInDay( app.nonWorkDays, dateTime );
    maxHoursSet(dayHours);
  }, [dateTime]);
  
  
  useEffect( ()=> {
    const unqUsers = new Set( Array.from(tideTimes, x => x.who ) ).size;
    userSet(unqUsers);
    
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
    
    const dArr = Array.from(tideTimes, x => {
      let mStop = x.stopTime ? moment(x.stopTime) : moment();
      let durr = moment.duration(mStop.diff(x.startTime)).asHours();
      return durr;
    });
    let dTotal = dArr.reduce( (arr, x)=>
      typeof x === 'number' && arr + x, 0 );
    let dTotalNice = dTotal < 10 ? dTotal.toPrecision(2) : dTotal.toPrecision(3);
    durrSet(dTotalNice);
    
  }, [tideTimes]);
    
  const calcEx = showUser ? ` (people x ${maxHours})` : '';
  
  return(
    <div className='balance middle'>
      
      {showUser &&
        <NumStatRing
          total={userTotal}
          nums={[1]}
          name={userTotal == 1 ? 'Person' : 'People'}
          title={`how many different people`}
          maxSize='chart10Contain'
        />}
      
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
        nums={[ durrTotal, ((userTotal * maxHours) - durrTotal) ]}
        name='Total Hours'
        title={`total of durations in hours \nout of ${userTotal * maxHours}${calcEx}`}
        colour='blueBi'
        maxSize='chart10Contain'
      />
      
    </div>
  );
};

export default TideDayMini;