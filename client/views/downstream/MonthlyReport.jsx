import React, { useState, useEffect, Fragment } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import { CalcSpin } from '/client/components/tinyUi/Spin';

import PrintThis from '/client/components/tinyUi/PrintThis';
import { avgOfArray, round2Decimal } from '/client/utility/Convert';
import { FilterSelect } from '/client/components/smallUi/ToolBarTools';

import MonthsTable from '/client/components/tables/MonthsTable'; 


const MonthlyReport = ({ app, isDebug })=> {
  
  const [ yrsState, yrsSet ] = useState([]);
  
  const [ yearState, yearSet ] = useState(moment().year());
  
  const [ dataState, dataSet ] = useState(false);
  
  const [ yrOnTime, setYrOnTime ] = useState(0);
  const [ yrTimeTotal, setYrTimeTotal ] = useState(0);
  
  const [ yrOnBdgt, setYrOnBdgt ] = useState(0);
  const [ yrBdgtTotal, setYrBdgtTotal ] = useState(0);
  
  const [ yrDoneTotal, setYrDoneTotal ] = useState(0);
  
  const [ dataItemState, dataItemSet ] = useState(false);
  const [ yrPerItmOnT, setYrPerItmOnT ] = useState(0);
  const [ yrItmDue, setYrItmDue ] = useState(0);
  const [ yrItmOnT, setYrItmOnT ] = useState(0);
  
  function getData(fresh) {
    fresh && dataSet(false);
    if(yearState) {
      const yearNum = Number(yearState);

      Meteor.call('reportMonthsFromCache', yearNum, (err, rtn)=>{
  	    err && console.log(err);
  	    dataSet(rtn);
  	    isDebug && console.log(rtn);
  	  });
  	  Meteor.call('reportItemsDueMonthsCache', yearNum, (err, rtn)=>{
  	    err && console.log(err);
  	    dataItemSet(rtn);
  	    isDebug && console.log(rtn);
  	  });
    }
  }
  
  useEffect( ()=>{
    let yrArr = [];
    let nowYr = moment().year();
    for( let y = Pref.yrsSpan; y > 0; y--) {
      yrArr.push(nowYr);
      nowYr -= 1;
    }
    yrsSet(yrArr);
  }, []);
  
  useEffect( ()=>{
    getData(true);
  }, [yearState]);
  
  useEffect( ()=>{
    if(dataState) {
      // b time table
      const allPerOnTime = Array.from(dataState, x => x.totalIsDone ? x.percentOnTime : undefined);
      const avgPerOnTime = round2Decimal( avgOfArray(allPerOnTime, true) );
      setYrOnTime(avgPerOnTime);
      
      const allOnTime = Array.from(dataState, x => x.totalOnTime).reduce((x,y)=>x+y);
      setYrTimeTotal(allOnTime);
      
      // quote table
      const allPerOnBdgt = Array.from(dataState, x => x.totalIsDone ? x.percentOnBdgt : undefined);
      const avgPerOnBdgt = round2Decimal( avgOfArray(allPerOnBdgt, true) );
      setYrOnBdgt(avgPerOnBdgt);
      
      const allOnBdgt = Array.from(dataState, x => x.totalOnBdgt).reduce((x,y)=>x+y);
      setYrBdgtTotal(allOnBdgt);
      
      // both batch tables
      const allIsDone = Array.from(dataState, x => x.totalIsDone).reduce((x,y)=>x+y);
      setYrDoneTotal(allIsDone);
    }
  }, [dataState]);
  
  useEffect( ()=>{
    if(dataItemState) {
      // i time table
      const allPerItm = Array.from(dataItemState, x => x.percentOnTime ? x.percentOnTime : undefined);
      setYrPerItmOnT( round2Decimal( avgOfArray(allPerItm, true) ) );
      
      setYrItmDue( Array.from(dataItemState, x => x.totalWasDue).reduce((x,y)=>x+y) );
      
      setYrItmOnT( Array.from(dataItemState, x => x.totalOnTime).reduce((x,y)=>x+y) );
    }
  }, [dataItemState]);
console.log(dataItemState);
  return(
    <div className='w100 minWfit space2v'>
        
      <div className='comfort med line2x noPrint'>
        <FilterSelect
          unqID='fltrYEAR'
          title='Filter Year'
          selectList={yrsState}
          selectState={yearState}
          // falsey={false}
          changeFunc={(e)=>yearSet(e.target.value)} 
        />
        <PrintThis />
      </div>
      
      {dataItemState === false ?
          <div>
            <p className='centreText'>Looking for those numbers...</p>
            <CalcSpin />
          </div>
        : 
        dataItemState === null ? 
          <div>
            <p className='centreText'>No Data Yet</p>
          </div>
        : 
        <Fragment>
        
          <MonthsTable 
            title='Items On Time'
            goodtitle='On Time'
            donetitle='Due'
            date={yearState}
            data={dataItemState} 
            yeartotal={yrPerItmOnT}
            yrStatTotal={yrItmOnT}
            yrDoneTotal={yrItmDue}
            stat='onTime'
            goal='wasDue'
            statTotal='totalOnTime'
            statGoal='totalWasDue'
            statPer='percentOnTime' 
            app={app}
          />
          
          <div className='printBr' />
          
        </Fragment>
      }
      
      {dataState === false ?
          <div>
            <p className='centreText'>Looking for those numbers...</p>
            <CalcSpin />
          </div>
        : 
        dataState === null ? 
          <div>
            <p className='centreText'>No Data Yet</p>
          </div>
        : 
        <Fragment>
          
          <MonthsTable 
            title={`${Pref.XBatchs} On Time`}
            goodtitle='On Time'
            donetitle='Shipped'
            date={yearState}
            data={dataState} 
            yeartotal={yrOnTime}
            yrStatTotal={yrTimeTotal}
            yrDoneTotal={yrDoneTotal}
            stat='onTime'
            goal='isDone'
            statTotal='totalOnTime'
            statGoal='totalIsDone'
            statPer='percentOnTime' 
            app={app}
            miss={true}
          />
          
          <div className='printBr' />
          
          <MonthsTable 
            title={`${Pref.XBatchs} On Budget`}
            goodtitle='On Budget'
            donetitle='Filled'
            date={yearState}
            data={dataState} 
            yeartotal={yrOnBdgt}
            yrStatTotal={yrBdgtTotal}
            yrDoneTotal={yrDoneTotal}
            stat='onBdgt'
            goal='isDone'
            statTotal='totalOnBdgt'
            statGoal='totalIsDone'
            statPer='percentOnBdgt' 
            app={app}
          />
        
        </Fragment>
      }

    </div>
  );
};
  
export default MonthlyReport;