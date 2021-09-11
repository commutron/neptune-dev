import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { CalcSpin } from '/client/components/tinyUi/Spin';

import PrintThis from '/client/components/tinyUi/PrintThis';
import { avgOfArray, round2Decimal } from '/client/utility/Convert';
import { FilterSelect } from '/client/components/smallUi/ToolBarTools';

import MonthsTable from '/client/components/tables/MonthsTable'; 


const MonthlyReport = ({ app })=> {
  
  const [ yrsState, yrsSet ] = useState([]);
  
  const [ yearState, yearSet ] = useState(moment().year());
  
  const [ dataState, dataSet ] = useState(false);
  
  const [ yrOnTime, setYrOnTime ] = useState(0);
  const [ yrTimeTotal, setYrTimeTotal ] = useState(0);
  
  const [ yrOnBdgt, setYrOnBdgt ] = useState(0);
  const [ yrBdgtTotal, setYrBdgtTotal ] = useState(0);
  
  const [ yrDoneTotal, setYrDoneTotal ] = useState(0);
  
  function getData(fresh) {
    fresh && dataSet(false);
    if(yearState) {
      const yearNum = Number(yearState);

      Meteor.call('reportMonthsFromCache', yearNum, (err, rtn)=>{
  	    err && console.log(err);
  	    dataSet(rtn);
  	  });
    }
  }
  
  useEffect( ()=>{
    let yrArr = [];
    let nowYr = moment().year();
    const duration = moment.duration(moment().diff(moment(app.createdAt))).years();
    for( let y = duration; y > -1; y--) {
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
      const allPerOnTime = Array.from(dataState, x => x.percentOnTime);
      const avgPerOnTime = round2Decimal( avgOfArray(allPerOnTime, true) );
      setYrOnTime(avgPerOnTime);
      
      const allOnTime = Array.from(dataState, x => x.totalOnTime).reduce((x,y)=>x+y);
      setYrTimeTotal(allOnTime);
      
      const allPerOnBdgt = Array.from(dataState, x => x.percentOnBdgt);
      const avgPerOnBdgt = round2Decimal( avgOfArray(allPerOnBdgt, true) );
      setYrOnBdgt(avgPerOnBdgt);
      
      const allOnBdgt = Array.from(dataState, x => x.totalOnBdgt).reduce((x,y)=>x+y);
      setYrBdgtTotal(allOnBdgt);
      
      const allIsDone = Array.from(dataState, x => x.totalIsDone).reduce((x,y)=>x+y);
      setYrDoneTotal(allIsDone);
    }
  }, [dataState]);
    
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
        <div>
        
          <MonthsTable 
            title='On Time'
            donetitle='Shipped'
            date={yearState}
            data={dataState} 
            total={yrOnTime}
            yrStatTotal={yrTimeTotal}
            yrDoneTotal={yrDoneTotal}
            stat='onTime'
            statTotal='totalOnTime'
            statPer='percentOnTime' 
            app={app}
            miss={true}
          />
          
          <div className='printBr' />
          
          <MonthsTable 
            title='On Budget'
            donetitle='Filled'
            date={yearState}
            data={dataState} 
            total={yrOnBdgt}
            yrStatTotal={yrBdgtTotal}
            yrDoneTotal={yrDoneTotal}
            stat='onBdgt'
            statTotal='totalOnBdgt'
            statPer='percentOnBdgt' 
            app={app}
          />
        
        </div>
      }

    </div>
  );
};
  
export default MonthlyReport;