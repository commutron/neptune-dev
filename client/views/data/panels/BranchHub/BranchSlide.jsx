import React, { Fragment, useMemo, useEffect, useState } from 'react';
import Pref from '/public/pref.js';
// import TagsModule from '/client/components/bigUi/TagsModule';
// import { PopoverButton, PopoverMenu, PopoverAction } from '/client/layouts/Models/Popover';

// import DumbFilter from '/client/components/tinyUi/DumbFilter';

import { MonthSelect, WeekSelect } from '/client/components/smallUi/DateRangeSelect';


const BranchSlide = ({ 
  brData, app, 
  canRun, canEdt, canCrt, canRmv 
})=>{
  
  const [ spanData, spanDataSet ] = useState(false);
  
  const [ month, monthSet ] = useState(false);
  // const [ week, weekSet ] = useState(false);
  
  // const [ filterString, filterStringSet ] = useState( '' );
  useEffect( ()=> {
    const branch = brData.branch;
    
    console.log({brData, month});
    
    const qtasks = app.qtTasks.filter( q => q.brKey === brData.brKey);
    const qkeys = qtasks.map( qt => qt.qtKey, []);
    const subtasks = qtasks.map( qs => qs.subTasks, []).flat();
  
    const trackops = app.trackOption.filter( t => t.branchKey === brData.brKey);
    const tsteps = [...new Set(trackops.map( to => to.step, []))];
    
    console.log({qkeys, subtasks, tsteps});
    
    if(month) {
      Meteor.call('getBrItemsSpan', branch, month, qkeys, subtasks, tsteps, 
      (err, rtn)=> {
        err && console.error(err);
        rtn && spanDataSet(rtn);
      });
    }
    
  },[month]);
  
  console.log({spanData});
    
  return(
    <div className='section overscroll' key={brData.brKey}>
          
      <h1 className='cap bigger centreText bottomLine'>{brData.branch}</h1>
    
        
      <div className='wide comfort'>
       {brData.pro &&
          <p className='w100 indenText'>
          <span className='mockTag nBg'>
            <i className="fa-solid fa-paper-plane fa-lg gapR"></i>Pro
          </span>
          </p>
        }
      </div>
      
      
      <MonthSelect
        setDate={monthSet}
      />
      
      {/*
      <WeekSelect
        setDate={weekSet}
      />
      */}
              
      
      {!spanData ? null :
        <div>
          <div>
            <h3>Batch Data</h3>
            {spanData.batch.map( (dt, ix)=> {
              return(
                <ul key={ix}>
                  {dt.map( (b,bx)=> {
                    return(
                      <li key={bx}>{b[0]}: {b[1]}</li>
                  )})}
                </ul>
              );
            })}
          </div>
          <h3>Series Data</h3>
          <div>
            {spanData.series.map( (dt, ix)=> {
              return(
                <ul key={ix}>
                  {dt.map( (s,sx)=> {
                    return(
                    <li key={sx}>{s[0]}: {s[1]}</li>
                  )})}
                </ul>
              );
            })}
          </div>
        </div>}
    </div>
  );
};

export default BranchSlide;