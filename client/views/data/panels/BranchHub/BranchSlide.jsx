import React, { Fragment, useMemo, useEffect, useState } from 'react';
import Pref from '/public/pref.js';
// import TagsModule from '/client/components/bigUi/TagsModule';
// import { PopoverButton, PopoverMenu, PopoverAction } from '/client/layouts/Models/Popover';

// import DumbFilter from '/client/components/tinyUi/DumbFilter';
import NumStatBox from '/client/components/charts/Dash/NumStatBox';
import { MonthSelect } from '/client/components/smallUi/DateRangeSelect';


const BranchSlide = ({ 
  brData, equipData, app, 
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
          <p className='w100'>
          <span className='mockTag nBg'>
            <i className="fa-solid fa-paper-plane fa-lg gapR"></i>Pro
          </span>
          </p>
        }
      </div>
      
      <div className='rowWrap'>
        {equipData.map( (e, i)=> (
          <span key={i} className={`mockTag gapR cap ${!e.online ? "darkgray" : "midnightblue"}`}>
            {e.alias}
          </span>
        ))}
      </div>
      
      <MonthSelect
        setDate={monthSet}
      />
              
      
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
          
          <SmpleDataSet 
            title='Work Orders'
            array={spanData.series} 
            line={0}
          />
          
          <div className='autoFlex'>
            <TotalWrapper 
              name="Total serials quantity"
              array={spanData.series} 
              line={1}
              color="var(--neptuneColor)"
            />
            <TotalWrapper 
              name="total serials scrapped"
              array={spanData.series} 
              line={2}
              color="var(--pomegranate)"
            />
            <TotalWrapper 
              name="total serials with noncons"
              array={spanData.series} 
              line={3}
            />
            <AvgWrapper 
              name="average of serials with noncons"
              append="%"
              array={spanData.series} 
              line={4}
            />
          </div>
          
          <div className='rowWrap'>
            <SmpleDataSet 
              title='Total serials quantity'
              array={spanData.series} 
              line={1}
            />
            <SmpleDataSet 
              title='total serials scrapped'
              array={spanData.series} 
              line={2}
            />
            <SmpleDataSet 
              title='total serials with noncons'
              array={spanData.series} 
              line={3}
            />
            <SmpleDataSet 
              title='percent of serials with noncons'
              array={spanData.series} 
              line={4}
            />
          </div>
          
          <div className='autoFlex'>
            <TotalWrapper 
              name="processed serials quantity"
              array={spanData.series} 
              line={5}
              color="var(--neptuneColor)"
            />
            <TotalWrapper 
              name="processed serials scrapped"
              array={spanData.series} 
              line={6}
              color="var(--pomegranate)"
            />
            <TotalWrapper 
              name="processed serials with noncons"
              array={spanData.series} 
              line={7}
            />
            <AvgWrapper 
              name="average of processed serials with noncons"
              append="%"
              array={spanData.series} 
              line={8}
            />
          </div>
          
          <div className='rowWrap'>
            <SmpleDataSet 
              title='processed serials quantity'
              array={spanData.series} 
              line={5}
            />
            <SmpleDataSet 
              title='processed serials scrapped'
              array={spanData.series} 
              line={6}
            />
            <SmpleDataSet 
              title='processed serials with noncons'
              array={spanData.series} 
              line={7}
            />
            <SmpleDataSet 
              title='percent of processed serials with noncons'
              array={spanData.series} 
              line={8}
            />
          </div>
          
        </div>}
    </div>
  );
};

export default BranchSlide;

const SmpleDataSet = ({ title, array, line })=> (
  <dl className='maxWide popSm spacehalf noindent'>
    <dt className='bottomLine bold'>{title}</dt>
    {array.map( (dt, index)=> {
      return(
        <dd key={index}>{dt[line][1]}</dd>
      );
    })}
  </dl>
);

const TotalWrapper = ({ name, title, array, line, color })=> {
  
  const total = array.reduce( (x,y)=> x + y[line][1], 0);
        
  return(
    <NumStatBox
      number={total}
      name={name}
      title={title || ""}
      borderColour={color || "var(--alizarin)"}
    />
  );
};

const AvgWrapper = ({ name, append, title, array, line, color })=> {
  
  const add = array.reduce( (x,y)=> x + Number(y[line][1]), 0);
  const avg = ( add / array.length );
  
  return(
    <NumStatBox
      number={avg + append || ""}
      name={name}
      title={title || ""}
      borderColour={color || "var(--alizarin)"}
    />
  );
};