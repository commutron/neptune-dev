import React, { useEffect, useState } from 'react';
import Pref from '/public/pref.js';
// import TagsModule from '/client/components/bigUi/TagsModule';
// import { PopoverButton, PopoverMenu, PopoverAction } from '/client/layouts/Models/Popover';

import ExploreLinkBlock from '/client/components/tinyUi/ExploreLinkBlock';
import NumStatBox from '/client/components/charts/Dash/NumStatBox';
import { MonthSelect } from '/client/components/smallUi/DateRangeSelect';


const BranchSlide = ({ 
  brData, equipData, app, 
  canRun, canEdt, canCrt, canRmv 
})=>{
  
  const [ spanData, spanDataSet ] = useState(false);
  
  const [ month, monthSet ] = useState(false);
  
  const [ subs, subsSet ] = useState([]);
  const [ steps, stepsSet ] = useState([]);
  
  useEffect( ()=> {
    const branch = brData.branch;
    
    console.log({brData, month});
    
    const qtasks = app.qtTasks.filter( q => q.brKey === brData.brKey);
    const qkeys = qtasks.map( qt => qt.qtKey, []);
    const subtasks = qtasks.map( qs => qs.subTasks, []).flat();
    subsSet(subtasks);
    
    const trackops = app.trackOption.filter( t => t.branchKey === brData.brKey);
    const tsteps = [...new Set(trackops.map( to => to.step, []))];
    stepsSet(tsteps);
    
    console.log({qkeys});
    
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
      
      <div className='rowWrap vmarginquarter'>
        {equipData.map( (e, i)=> (
          <span key={i} className={`mockTag gapR cap ${!e.online ? "darkgray" : "midnightblue"}`}>
            {e.alias}
          </span>
        ))}
      </div>
      
      <div className='rowWrap vmarginquarter'>
        {subs.map( (e, i)=> (
          <span key={i} className="mockTag gapR cap">{e}</span>
        ))}
      </div>
      
      <div className='rowWrap vmarginquarter'>
        {steps.map( (e, i)=> (
          <span key={i} className="mockTag gapR cap blue">{e}</span>
        ))}
      </div>
      
      <div className='vmargin'>
        <label>Get Report</label>
        <MonthSelect
          setDate={monthSet}
        />
      </div>
              
      
      {!spanData ? null :
        <div className='vmargin'>
          
          <SrsSet 
            dataset={spanData.series} 
            filter={1} 
            lines={[1, 2, 3, 4]} 
            title='All items from live work orders (Entire Building)' 
            short='live'
          />
          
          <SrsSet 
            dataset={spanData.series} 
            filter={5} 
            lines={[5, 6, 7, 8]} 
            title='Items (serails) processed durring month' 
            short='processed'
          />
          
          <details>
            <summary>Raw batch data</summary>
            <div>
              <SmpleDataSet 
                title='Widget IDs'
                array={spanData.batch} 
                line={1}
                unq={true}
              />
              <h3>Batch Data</h3>
              {spanData.batch.map( (dt, ix)=> {
                return(
                  <ul key={ix}>
                    {dt.map( (b,bx)=> {
                      return(
                        <li key={bx}>{b[0]}: {Array.isArray(b[1]) ? b[1].join("-") : b[1]}</li>
                    )})}
                  </ul>
                );
              })}
            </div>
          </details>
          
        </div>}
    </div>
  );
};

export default BranchSlide;

const SrsSet = ({ dataset, filter, lines, title, short })=> {
  
  const isProc = dataset.filter( d => d[filter][1] > 0 );
  
  return(
    <div className='vmargin'>
      <h2 className='cap'>{title}</h2>
      
      <NumStatBox
        number={isProc.length}
        name={`${short} Work Orders`}
        borderColour="var(--neptuneColor)"
      />
          
      <SmpleDataSet 
        title='Work Orders'
        exlink='batch'
        array={isProc} 
        line={0}
      />
          
      <div className='autoFlex'>
        <TotalWrapper 
          name="serials quantity"
          array={isProc} 
          line={lines[0]}
          color="var(--neptuneColor)"
        />
        <TotalWrapper 
          name="serials scrapped"
          array={isProc} 
          line={lines[1]}
          color="var(--pomegranate)"
        />
        <TotalWrapper 
          name="serials with noncons (in department)"
          array={isProc} 
          line={lines[2]}
        />
        <AvgWrapper 
          name={`average of work order's percent of serials with noncons (in department)`}
          append="%"
          array={isProc} 
          line={lines[3]}
        />
      </div>
      <details>
        <summary>test/proof</summary>
        <div className='autoFlex'>
          <SmpleDataSet 
            title='serials quantity'
            array={isProc} 
            line={lines[0]}
          />
          <SmpleDataSet 
            title='serials scrapped'
            array={isProc} 
            line={lines[1]}
          />
          <SmpleDataSet 
            title='serials with noncons (in department)'
            array={isProc} 
            line={lines[2]}
          />
          <SmpleDataSet 
            title="work order's percent of serials with noncons (in department)"
            array={isProc} 
            line={lines[3]}
            sufix="%"
          />
        </div>
      </details>
    </div>
  );
};

const SmpleDataSet = ({ title, array, line, exlink, unq, sufix })=> {
  
  const data = !unq ? array.map( a => a[line][1] ) : [...new Set(array.map( a => a[line][1] ))];
  
  return(
    <dl className='maxWide popSm spacehalf noindent'>
      <dt className='bottomLine bold'>{title}</dt>
      {data.map( (dt, index)=> {
        return(
          <dd key={index}>
            {exlink ?
              <ExploreLinkBlock type={exlink} keyword={dt} />
              :
              dt + (sufix || '')
            }
          </dd>
        );
      })}
    </dl>
  );
};

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
  const avg = !add ? 0 : ( add / array.length );
  const prcnt = avg < 1 ? avg.toFixed(2) : avg.toFixed(1);
  
  return(
    <NumStatBox
      number={prcnt + append || ""}
      name={name}
      title={title || ""}
      borderColour={color || "var(--alizarin)"}
    />
  );
};