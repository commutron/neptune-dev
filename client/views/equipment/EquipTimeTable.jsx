import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Duration } from 'luxon';
import UserName from '/client/utility/Username.js';
import { addTideArrayDuration } from '/client/utility/WorkTimeCalc.js';
// import { sc2hr } from '/client/utility/Convert.js';

const EquipTimeTable = ({ id, qtTime, timefetch, issKey })=> {
  // Maint_id + 'getMaintTime'
  // Equip._id + 'getEqIssueTime' + issKey
  
  const [ arrayTime, arrayTimeSet ] = useState([]);
  const [ totalTime, totalTimeSet ] = useState(0);
  const [ peopleTime, peopleTimeSet ] = useState([]);
  
  function handleplaintime(re) {
  	arrayTimeSet(re);
        
    let split = [];
    const ppl = new Set(Array.from(re, a => a.who));
    for(let p of ppl) {
    	const time = re.filter( t => t.who === p );
    	split.push([p, addTideArrayDuration(time) ]);
    }
    peopleTimeSet( split );
    
    totalTimeSet( split.reduce((num, x)=> num + Number(x[1]), 0) );
  }
  
  useEffect( ()=> {
    Meteor.call(timefetch, id, issKey, (err, re)=>{
      err && console.log(err);
      if(re) {
        handleplaintime(re);
      }
    });
  },[]);
  
  const niceTime = (min, sec)=> {
    return Duration.fromObject({minutes: min || 0, seconds: sec || 0})
            .shiftTo('minutes', 'seconds')
            .toHuman({ showZeros: false });
  };
  
  return(
    <span>
      <dl className='indenText w100 bottomLine vmarginquarter readlines'>
      	{qtTime !== undefined && <dt>Quoted: <n-num>{niceTime(qtTime, 0)}</n-num></dt>}
	    	<dt>Total Recorded: <n-num>{niceTime(0,totalTime)}</n-num></dt>
      	{peopleTime.map( (p, ix)=>(
	    		<dd key={ix}>{UserName(p[0])}: <n-num>{niceTime(0,p[1])}</n-num></dd>
	    	))}
	    </dl>
    	
      <table className='min400 w100 overscroll leftText'>
        <thead>
          <tr className='leftText'>
            <th>Day</th>
            <th>Start</th>
            <th>Stop</th>
            <th>Who</th>
          </tr>
        </thead>
        <tbody>
          {arrayTime.map( (c, ix)=> (
            <tr key={ix}>
              <td>{moment(c.startTime).format('dddd MMMM D')}</td>
              <td>{moment(c.startTime).format('h:mm A')}</td>
              <td>{c.stopTime ? moment(c.stopTime).format('h:mm A') : '-'}</td>
              <td>{UserName(c.who)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </span>
  );
};

export default EquipTimeTable;