import React, { useEffect, useState } from 'react';
import Pref from '/public/pref.js';
// import { PopoverButton, PopoverMenu, PopoverAction } from '/client/layouts/Models/Popover';

import ExploreLinkBlock from '/client/components/tinyUi/ExploreLinkBlock';
import KpiStat from '/client/components/smallUi/StatusBlocks/KpiStat';
import NumStatBox from '/client/components/charts/Dash/NumStatBox';
import { MonthSelect } from '/client/components/smallUi/DateRangeSelect';
import { flexSort } from '/client/utility/Arrays.js';

const BranchSlide = ({ 
  brData, equipData, app, 
  canRun, canEdt, canCrt, canRmv 
})=>{
  
  const [ spanData, spanDataSet ] = useState(false);
  
  const [ month, monthSet ] = useState(false);
  
  const [ eqs, eqsSet ] = useState([]);
  const [ subs, subsSet ] = useState([]);
  const [ steps, stepsSet ] = useState([]);
  
  useEffect( ()=> {
    const branch = brData.branch;
    
    // console.log({brData, month});
    const equipS = flexSort(equipData, 'alias');
    eqsSet(equipS);
    
    const qtasks = app.qtTasks.filter( q => q.brKey === brData.brKey);
    const qtaskS = flexSort(qtasks, 'position', true);
    const qkeys = qtaskS.map( qt => qt.qtKey, []);
    const subtasks = qtaskS.map( qs => qs.subTasks, []).flat();
    subsSet(subtasks);
    
    const trackops = app.trackOption.filter( t => t.branchKey === brData.brKey);
    const tsteps = flexSort([...new Set(trackops.map( to => to.step, []))]);
    stepsSet(tsteps);
    
    // console.log({qkeys});
    
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
      
      <Taglist 
        title={Pref.equip}
        list={eqs}
        status='online'
        name='alias'
        oncolor="midnightblue"
        offcolor="darkgray" 
      />
      
      <Taglist 
        title="Sub-Tasks"
        list={subs}
        oncolor=""
      />
      
      <Taglist 
        title={Pref.flow + ' steps'}
        list={steps}
        oncolor="blue"
      />
      
      <div className='vmargin'>
        <label>Get Report</label>
        <MonthSelect
          setDate={monthSet}
        />
      </div>
              
      
      {!spanData ? null :
        <div className='vmargin'>
          
          <TotalSet
            srsCount={spanData.series.length}
            dataset={spanData.dpmt}
          />
          
          <SrsSet 
            dataset={spanData.series} 
            filter={1}
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
              <h4>Batch Data</h4>
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

const TotalSet = ({ srsCount, dataset })=> {
  
  return(
    <div className='vmargin vgapdivs spaceinnerdivs'>
      
      <NumWrapper
        num={srsCount}
        name={`Live Work Orders`}
        color='var(--neptuneColor)'
      />
      <NumWrapper
        num={dataset[1][1]}
        name={`Total Items of live wo`}
        color='var(--peterriver)'
      />
      
      <h4>Processed in Month</h4>
      
      <NumWrapper
        num={dataset[1][1]}
        name='Processed in timespan items'
        color='var(--peterriver)'
      />
      <NumWrapper
        num={dataset[6][1]}
        name={`First-off Items`}
        color='var(--belizeHole)'
      />
      <NumWrapper
        num={dataset[2][1]}
        name='Processed in timespan items with noncons'
        color='var(--alizarin)'
      />
      <NumWrapper
        num={dataset[3][1] + '%'}
        name='of Processed in timespan items with noncons'
        color='var(--alizarin)'
      /> 
      
      <h4>Scrapped Items</h4>
      
      <NumWrapper 
        name="Processed serials scrapped"
        num={dataset[4][1]}
        color="var(--pomegranate)"
      />
      <NumWrapper 
        num={dataset[5][1] + '%'}
        name="Of processed serials scrapped"
        color="var(--pomegranate)"
      />

      <hr />
          
    </div>
  );
};

const SrsSet = ({ dataset, filter })=> {
  
  const isProc = dataset.filter( d => d[filter][1] > 0 );
  
  return(
    <div className='vmargin vgapdivs spaceinnerdivs'>
      <details>
        <summary>test/proof</summary>
        <div>
          <div className='autoFlex'>
            <SmpleDataSet 
              title='Work Orders'
              exlink='batch'
              array={isProc} 
              line={0}
            />
            <SmpleDataSet 
              title='serials quantity'
              array={isProc} 
              line={1}
            />
          </div>
          <div className='autoFlex'>
            <SmpleDataSet 
              title='serials processed'
              array={isProc} 
              line={2}
            />
            <SmpleDataSet 
              title='serials processed as first-offs'
              array={isProc} 
              line={7}
            />
            <SmpleDataSet 
              title='serials processed with noncons'
              array={isProc} 
              line={3}
            />
            <SmpleDataSet 
              title='serials processed with noncons'
              array={isProc} 
              line={4}
              sufix="%"
            />
          </div>
          <div className='autoFlex'>
            <SmpleDataSet 
              title='serials processed then scrapped'
              array={isProc} 
              line={5}
            />
            <SmpleDataSet 
              title='serials processed then scrapped'
              array={isProc} 
              line={6}
            />
          </div>
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

const NumWrapper = ({ name, title, num, color })=> (
  <KpiStat
    num={num}
    name={name}
    title={title || ""}
    color={color || "var(--alizarin)"}
  /> 
);

// const TotalWrapper = ({ name, title, array, line, color })=> {
  
//   const total = array.reduce( (x,y)=> x + y[line][1], 0);
        
//   return(
//     <NumWrapper
//       num={total}
//       name={name}
//       title={title || ""}
//       color={color || "var(--alizarin)"}
//     /> 
//   );
// };

// const AvgWrapper = ({ name, append, title, array, line, color })=> {
  
//   const add = array.reduce( (x,y)=> x + Number(y[line][1]), 0);
//   const avg = !add ? 0 : ( add / array.length );
//   const prcnt = avg < 1 ? avg.toFixed(2) : avg.toFixed(1);
  
//   return(
//     <NumWrapper
//       num={prcnt + append || ""}
//       name={name}
//       title={title || ""}
//       color={color || "var(--alizarin)"}
//     />
//   );
// };


const Taglist = ({ title, list, status, name, oncolor, offcolor })=> (
  <div className='vmarginquarter readPs'>
    <p className='cap smTxt'>{title}</p>
    <p className='rowWrap'>
      {list.map( (e, i)=> (
        <span key={i} className={`mockTag gapR cap ${status && !e[status] ? offcolor : oncolor}`}>
          {name ? e[name] : e}
        </span>
      ))}
    </p>
  </div>
);