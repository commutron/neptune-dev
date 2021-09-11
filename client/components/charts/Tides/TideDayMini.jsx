import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { TimeInDay } from '/client/utility/WorkTimeCalc.js';
import { UsersTimeTotal } from '/client/utility/WorkTimeCalc.js';
import { round1Decimal } from '/client/utility/Convert.js';
import Pref from '/client/global/pref.js';
import NumStatRing from '/client/components/charts/Dash/NumStatRing.jsx';


const TideDayMini = ({ tideTimes, dateTime, showUser, app, users })=> {
  
  const [ userTotal, userSet ] = useState(0);
  const [ batchTotal, batchSet ] = useState([]);
  const [ durrTotal, durrSet ] = useState(0);
  const [ dayHours, dayHoursSet ] = useState(0);
  const [ userHours, userHoursSet ] = useState(0);
  
  useEffect( ()=> {
    const getDayHours = TimeInDay( app, dateTime );
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
    
    const dTotal = tideTimes.reduce( (arr, x)=> { return arr + x.durrAsMin }, 0);
    const durrHr = moment.duration(dTotal, 'minutes').asHours();
    const dTotalNice = round1Decimal(durrHr);
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
        name={batchTotal.length == 1 ? Pref.xBatch : Pref.xBatchs}
        title={`how many different ${Pref.xBatchs}`}
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