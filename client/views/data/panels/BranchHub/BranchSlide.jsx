import React, { useEffect, useLayoutEffect, useState } from 'react';
import Pref from '/public/pref.js';
// import { PopoverButton, PopoverMenu, PopoverAction } from '/client/layouts/Models/Popover';

import ExploreLinkBlock from '/client/components/tinyUi/ExploreLinkBlock';
import KpiStat from '/client/components/smallUi/StatusBlocks/KpiStat';
import NumStatBox from '/client/components/charts/Dash/NumStatBox';
import { MonthSelect } from '/client/components/smallUi/DateRangeSelect';
import { flexSort } from '/client/utility/Arrays.js';
import ReportBasicTable from '/client/components/tables/ReportBasicTable';

const BranchSlide = ({ 
  brData, equipData, app, 
  canRun, canEdt, canCrt, canRmv 
})=>{
  
  const [ spanData, spanDataSet ] = useState(false);
  
  const [ month, monthSet ] = useState(false);
  
  const [ eqs, eqsSet ] = useState([]);
  const [ qs, qsSet ] = useState([]);
  const [ subs, subsSet ] = useState([]);
  const [ steps, stepsSet ] = useState([]);
  
  useLayoutEffect( ()=> {
    const equipS = flexSort(equipData, 'alias');
    eqsSet(equipS);
    
    const qtasks = app.qtTasks.filter( q => q.brKey === brData.brKey);
    const qtaskS = flexSort(qtasks, 'position', true);
    const qkeys = qtaskS.map( qt => qt.qtKey, []);
    qsSet(qkeys);
    
    const subtasks = qtaskS.map( qs => qs.subTasks, []).flat();
    subsSet(subtasks);
    
    const trackops = app.trackOption.filter( t => t.branchKey === brData.brKey);
    const tsteps = flexSort([...new Set(trackops.map( to => to.step, []))]);
    stepsSet(tsteps);
    
  },[]);
  
  useEffect( ()=> {
    if(month) {
      spanDataSet(false);
      
      const branch = brData.branch;
      
      Meteor.call('getBrItemsSpan', branch, month, qs, subs, steps, 
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
        bcolor=''
        oncolor="midnightblue"
        offcolor="darkgray" 
      />
      
      <Taglist 
        title="Sub-Tasks"
        list={subs}
        oncolor=""
        bcolor='borderGreen'
      />
      
      <Taglist 
        title={Pref.flow + ' steps'}
        list={steps}
        oncolor="blue"
        bcolor='borderBlue'
      />
      
      <div className='vmargin'>
        <h4 className='centreText'>Get Report</h4>
        <div className='centre'>
          <label>Select Month</label>
          <MonthSelect
            setDate={monthSet}
            moreclass='centreText'
          />
        </div>
      </div>
              
      
      {!spanData ? null :
        <div className='vmargin centre'>
          
          <TotalSet
            srsCount={spanData.series.length}
            dataset={spanData.dpmt}
          />
          
          <SrsSet 
            dataset={spanData.series} 
            filter={1}
            title={`${brData.branch}_${month}_processed_noncons`}
          />
          
          <details>
            <summary>Product & Time Data</summary>
            <p className='centreText bold'><em>UI Work in Progress. Numbers are Technically Acurate.</em></p>
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
    <div className='centre vmargin vgapdivs spaceinnerdivs'>
      {/*
      <NumWrapper
        num={dataset[1][1]}
        name={`Total Items of live wo`}
        color='var(--peterriver)'
      />
      */}      
      <h4>Processed</h4>
      <NumWrapper
        num={srsCount}
        name={`Active Work Orders`}
        color='var(--neptuneColor)'
      />
      <NumWrapper
        num={dataset[1][1]}
        name='Items Processed'
        color='var(--peterriver)'
      />
      <NumWrapper
        num={dataset[6][1]}
        name={`Items with First-off `}
        color='var(--belizeHole)'
      />
      <h4>Items with Nonconformances</h4>
      <NumWrapper
        num={dataset[2][1]}
        name='Items with Noncons'
        color='var(--alizarin)'
      />
      <NumWrapper
        num={dataset[3][1] + '%'}
        name='Of Processed Items have Noncons'
        color='var(--alizarin)'
      /> 
      
      <h4>Items Scrapped</h4>
      
      <NumWrapper 
        name="Items Scrapped"
        num={dataset[4][1]}
        color="var(--pomegranate)"
      />
      <NumWrapper 
        num={dataset[5][1] + '%'}
        name="Of Processed Items have been Scrapped"
        color="var(--pomegranate)"
      />
          
    </div>
  );
};

const SrsSet = ({ dataset, title })=> {
  
  let vals = dataset.map( d => Array.from(d, e => e[1]), []);
  vals.unshift(['WO',
               'serials processed',
               'with noncon',
               'scrapped',
               'with first-off'
              ]);
  
  return(
    <div className='centre vmargin vgapdivs spaceinnerdivs'>
      <details className='centre'>
        <summary>Work Order Detail</summary>
        <ReportBasicTable
          title={title}
          dateString=''
          rows={vals}
        />
        <p className='small max500'>
          <em>Report is concerning items processed, in this month, in this department. Can be read as: serials processed in 'department' in 'month' with one or more noncon recorded in 'department'.</em>
        </p>
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

const Taglist = ({ title, list, status, name, bcolor, oncolor, offcolor })=> (
  <details className='vmarginhalf'>
    <summary className={`cap smTxt spaceLine borderLeft ${bcolor}`}>{title}</summary>
    <p className='rowWrap'>
      {list.map( (e, i)=> (
        <span key={i} className={`mockTag gapR cap ${status && !e[status] ? offcolor : oncolor}`}>
          {name ? e[name] : e}
        </span>
      ))}
    </p>
  </details>
);