import React, { useState } from 'react';
//import moment from 'moment';
import Pref from '/client/global/pref.js';
import './style.css';

import MiniStack from '/client/components/charts/MiniScales/MiniStack.jsx';
import NumBox from '/client/components/uUi/NumBox.jsx';
// requires 
/// batchData
/// flow
/// altflow

const StepsProgress  = ({ progCounts, riverTitle, riverAltTitle, truncate })=> {
  
  const [ countCalc, countSet ] = useState('item');

  const dt = progCounts;
  const regDt = dt.regStepData;
  const totalR = dt.regItems;
  const altDt = dt.altStepData;
  const totalA = dt.altItems;
  const totalRU = dt.totalRegUnits;
  const totalAU = dt.totalAltUnits;
  const scrapCount = dt.scrapCount;
  
  const unitsExist = totalRU + totalAU > ( totalR + totalA ) ? true : false;
  const calcItem = countCalc === 'item' ? true : false;
  
  return (
    <div>
      <div className='numBoxRadio centreRow'>
        <input
          type='radio'
          id='calcI'
          name='calc'
          onChange={()=> countSet( 'item' )}
          defaultChecked={unitsExist}
          disabled={!unitsExist} />
        <label htmlFor='calcI'>
          <NumBox
            num={totalR + totalA}
            name={Pref.item + 's'}
            color='whiteT' />
        </label>
        <input
          type='radio'
          id='calcU'
          name='calc'
          onChange={()=> countSet( 'unit' )} />
          {unitsExist ?
            <label htmlFor='calcU'>
              <NumBox
                num={totalRU + totalAU}
                name={Pref.unit + 's'}
                color='whiteT' />
            </label>
          :null}
        {scrapCount > 0 ? 
        <label>
          <NumBox
            num={scrapCount}
            name={Pref.scrap}
            color='redT' />
          </label>
        :null}
      </div>
      <div>
        <div className='centreRow'>
        {!riverTitle ? null :
          <span className='small cap wellSpacedLine wide'>
            <i>{Pref.buildFlow}: {riverTitle || ''}</i>
          </span>}
          {regDt.map( (entry)=>{
            let rndmKeyR = Math.random().toString(36).substr(2, 5);
            if(entry.obj === 'ping') {
              return(
                <StepRateDisplay
                  key={rndmKeyR}
                  step={entry.step}
                  gFirst={entry.goodFirst}
                  ngFirst={entry.ngFirst}
                  truncate={truncate} />
              );
            }else{
              let count = calcItem ? entry.items : entry.units;
              let countNew = calcItem ? entry.itemsNew : entry.unitsNew;
              let total = calcItem ? totalR : totalRU;
              return(
                <StepTallyDisplay
                  key={rndmKeyR}
                  step={entry.step}
                  type={entry.type}
                  count={count}
                  countNew={countNew}
                  total={total} />
              );
          }})}
        </div>
        {totalA > 0 ?
          <div className='centreRow vspace'>
            <span className='small cap wellSpacedLine wide'>
              <i className='fas fa-asterisk fa-lg'></i>
              <i>{Pref.buildFlowAlt}: {riverAltTitle || ''}</i>
            </span>
            {altDt.map( (entry)=>{
              let rndmKeyA = Math.random().toString(36).substr(2, 5);
              if(entry.obj === 'ping') {
                return(
                  <StepRateDisplay
                    key={rndmKeyA}
                    step={entry.step}
                    gFirst={entry.goodFirst}
                    ngFirst={entry.ngFirst}
                    truncate={truncate} />
                );
              }else{
                let count = calcItem ? entry.items : entry.units;
                let countNew = calcItem ? entry.itemsNew : entry.unitsNew;
                let total = calcItem ? totalA : totalAU;
                return(
                  <StepTallyDisplay
                    key={rndmKeyA}
                    step={entry.step}
                    type={entry.type}
                    count={count}
                    countNew={countNew}
                    total={total} />
                );
            }})}
          </div>
        :null}
      </div>
    </div>
  );
};

export default StepsProgress;

const StepRateDisplay = ({step, gFirst, ngFirst, truncate})=> {
  
  const name = gFirst === true ? 'Good' :
                ngFirst === true ? 'No Good' :
                'Incomplete';
  const value = gFirst === true ? 10 :
                ngFirst === true ? 5 :
                0;
  const hidden = truncate && gFirst === true ? 'hide' : '';
  
  return(
    <div className={`wide meterTrinary ${hidden}`}>
      <p className='cap'>{step} first</p>
      <meter
        value={value}
        low="5"
        high='7'
        optimum="9"
        max="10"
        >
      </meter>
      <p>{name}</p>
    </div>
  );
};

const StepTallyDisplay = ({step, type, count, countNew, total })=> {
  const title = type === 'finish' ||
                type === 'test' ?
                step :
                step + ' ' + type;
  return(
    <MiniStack
      title={title}
      count={count}
      countNew={countNew}
      total={total} />
  );
};
