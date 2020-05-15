import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { TimeInWeek } from '/client/utility/WorkTimeCalc.js';
import { UserTime } from '/client/utility/WorkTimeCalc.js';
import { round2Decimal } from '/client/utility/Convert.js';
import Pref from '/client/global/pref.js';
import NumStatRing from '/client/components/charts/Dash/NumStatRing.jsx';


const TideWorkSplit = ({ tideTimes, dateTime, app, user })=> {
  
  const [ batchTotal, batchSet ] = useState([]);
  const [ taskTotal, taskSet ] = useState([]);
  
  const [ durrTotal, durrSet ] = useState(0);
  const [ maxHours, maxHoursSet ] = useState(0);
  
  useEffect( ()=> {
    const weekHours = TimeInWeek( app.nonWorkDays, dateTime );
    
    const proHours = UserTime( user, dateTime, 'week', weekHours );
      
    maxHoursSet(proHours);
  }, [dateTime]);
  /*
  useLayoutEffect( ()=>{ // fetch data handling
    const tideTime = weekData || [];
    const ttDay = selectDayState && 
      alldays.findIndex( x => x === selectDayState);
    const dayFiltered = !ttDay ? tideTime :
      tideTime.filter( x => moment(x.startTime).day() === ttDay );
    
    const unqUsers = new Set( Array.from(dayFiltered, x => x.who ) );
    setUserList([...unqUsers]);
    
    const unqBatches = new Set( Array.from(dayFiltered, x => x.batch ) );
    setBatchList([...unqBatches].sort());
    
    const unqTasks = new Set( Array.from(dayFiltered, x => x.task ) );
    const unqTasksClean = [...unqTasks].filter( x => x !== null );
    setTaskList(unqTasksClean.sort());
    
  }, [weekData, selectDayState]);
  */
  
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
    
    const qTasks = _.reduce(tideTimes, (allTask, task, index, array)=> { 
      const objkey = !task ? false : task.task;
      objkey &&
        objkey in allTask ? allTask[objkey]++ : allTask[objkey] = 1;
      return allTask;
    }, {});
    const qTasksClean = _.omit(qTasks, (value, key, object)=> {
      return key == false;
    });
    const tITR = Object.entries(qTasksClean);
    const tXY = Array.from(tITR, (arr)=> { return {x: arr[0], y: arr[1]} } );
    taskSet(tXY);
    
    console.log(qTasksClean);
    
    
    
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
        total={taskTotal.length}
        nums={taskTotal}
        name={taskTotal.length == 1 ? 'task' : 'tasks'}
        title='how many different tasks'
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

export default TideWorkSplit;