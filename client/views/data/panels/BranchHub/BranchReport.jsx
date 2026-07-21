import React, { useEffect, useState, Fragment } from 'react';
import Pref from '/public/pref.js';

import ExploreLinkBlock from '/client/components/tinyUi/ExploreLinkBlock';
import KpiStat from '/client/components/smallUi/StatusBlocks/KpiStat';
import { MonthSelect } from '/client/components/smallUi/DateRangeSelect';

import ReportBasicTable from '/client/components/tables/ReportBasicTable';

const BranchReport = ({ 
  branch, qs, subs, steps, app, 
  reportCol, colIndex
})=>{
  
  const [ working, workingSet ] = useState(false);
  const [ spanData, spanDataSet ] = useState(false);
  
  const [ month, monthSet ] = useState(false);
  
  useEffect( ()=> {
    if(month) {
      workingSet(true);
      
      Meteor.call('getBrItemsSpan', branch, month, qs, subs, steps, 
      (err, rtn)=> {
        Meteor.setTimeout( ()=> {
          err && console.error(err);
          if(rtn) {
            spanDataSet(rtn);
            workingSet(false);
          }
        },500);
      });
    }
    
  },[month]);
  
  console.log({spanData});
    
  return(
    <div style={{border: '1px solid var(--silver)'}} className='spacehalf overscroll'>
      
      <div className='vmargin min200'>
        <h4 className='centreText'>Get Report {!working ?
          <n-fa0><i className='fa-solid fa-spinner gapL'></i></n-fa0> :
          <n-fa1><i className='fa-solid fa-spinner fa-pulse gapL'></i></n-fa1>
        }</h4>
        <div className='centre'>
          <MonthSelect
            setDate={monthSet}
            moreclass='centreText'
          />
        </div>
      </div>
              
      <div className='vmargin centre min200'>
      {!spanData ? null :
        <Fragment>
          
          <TotalSet
            srsCount={spanData.series.length}
            dataset={spanData.dpmt}
          />
          
          <SrsSet 
            dataset={spanData.series} 
            filter={1}
            title={`${branch}_${month}_processed_noncons`}
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
          
        </Fragment>}
        </div>
    </div>
  );
};

export default BranchReport;

const TotalSet = ({ srsCount, dataset })=> {
  
  return(
    <div className='centre centreText vmargin vgapdivs spaceinnerdivs'>
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