import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { TimeInDay } from '/client/utility/WorkTimeCalc.js';
import { UsersTimeTotal } from '/client/utility/WorkTimeCalc.js';
import Pref from '/client/global/pref.js';
import NumStatRing from '/client/components/charts/Dash/NumStatRing.jsx';


const TideDayMini = ({ tideTimes, dateTime, showUser, app, users })=> {
  
  const [ userTotal, userSet ] = useState(0);
  const [ batchTotal, batchSet ] = useState([]);
  const [ durrTotal, durrSet ] = useState(0);
  const [ dayHours, dayHoursSet ] = useState(0);
  const [ userHours, userHoursSet ] = useState(0);
  
  useEffect( ()=> {
    const getDayHours = TimeInDay( app.nonWorkDays, dateTime );
    dayHoursSet(getDayHours);
  }, [dateTime]);
  
  
  useEffect( ()=> {
    const userIDs = new Set( Array.from(tideTimes, x => x.who ) );
    const unqUsers = userIDs.size;
    userSet(unqUsers);
    
    const getUsersTime = UsersTimeTotal( userIDs, users, dateTime, 'day', dayHours );
    userHoursSet(getUsersTime);
    
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
        nums={[ durrTotal, (userHours - durrTotal) ]}
        name='Total Hours'
        title={`total of durations in hours \nout of potential max user time: ${userHours} hours`}
        colour='blueBi'
        maxSize='chart10Contain'
      />
      
    </div>
  );
};

export default TideDayMini;