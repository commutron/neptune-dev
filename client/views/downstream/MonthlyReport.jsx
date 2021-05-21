import React, { useState, useEffect } from 'react';
import Pref from '/client/global/pref.js';
import moment from 'moment';
import { CalcSpin } from '/client/components/tinyUi/Spin.jsx';
import { avgOfArray, round2Decimal } from '/client/utility/Convert';
import { FilterSelect } from '/client/components/smallUi/ToolBarTools';

import MonthsTable from '/client/components/tables/MonthsTable'; 


const MonthlyReport = ({ app })=> {
  
  const [ yrsState, yrsSet ] = useState([]);
  
  const [ yearState, yearSet ] = useState(moment().year());
  
  const [ dataState, dataSet ] = useState(false);
  
  const [ yrOnTime, setYrOnTime ] = useState(0);
  
  const [ yrOnBdgt, setYrOnBdgt ] = useState(0);
  
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
      
      const allPerOnBdgt = Array.from(dataState, x => x.percentOnBdgt);
      const avgPerOnBdgt = round2Decimal( avgOfArray(allPerOnBdgt, true) );
      setYrOnBdgt(avgPerOnBdgt);
    }
  }, [dataState]);
    
  return(
    <div className='w100 minWfit space2v'>
        
      <div className='med line2x'>
        
        <FilterSelect
          unqID='fltrYEAR'
          title='Filter Year'
          selectList={yrsState}
          selectState={yearState}
          falsey={false}
          changeFunc={(e)=>yearSet(e.target.value)} 
        />
      </div>
      
      {dataState === false ?
          <div>
            <p className='centreText'>Looking for those numbers...</p>
            <CalcSpin />
          </div>
        :   
        <div>
        
          <MonthsTable 
            title='On Time'
            date={yearState}
            data={dataState} 
            total={yrOnTime}
            stat='onTime'
            statTotal='totalOnTime'
            statPer='percentOnTime' 
          />
            
          <MonthsTable 
            title='On Budget'
            date={yearState}
            data={dataState} 
            total={yrOnBdgt}
            stat='onBdgt'
            statTotal='totalOnBdgt'
            statPer='percentOnBdgt' 
          />
        
        </div>
      }

    </div>
  );
};
  
export default MonthlyReport;