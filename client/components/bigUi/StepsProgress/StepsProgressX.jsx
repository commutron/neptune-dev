import React, { useState } from 'react';
//import moment from 'moment';
import Pref from '/client/global/pref.js';
import './style.css';

import MiniStack from '/client/components/charts/MiniScales/MiniStack.jsx';
import NumBox from '/client/components/tinyUi/NumBox.jsx';


const StepsProgressX  = ({ quantity, progCounts, riverTitle, truncate })=> {
  
  const [ countCalc, countSet ] = useState('item');

  const dt = progCounts;
    
  const rvrDt = dt.riverProg;
  const wflDt = dt.wtrflProg;
  
  const totalI = dt.liveItems;

  const totalIU = dt.liveUnits;

  const scrapCount = dt.scrapCount;
  
  const unitsExist = totalIU > totalI ? true : false;
  const calcItem = countCalc === 'item' ? true : false;
  
  return (
    <div>
      <div className='numBoxRadio centreRow'>
        <input
          type='radio'
          id='calcI'
          name='calc'
          onChange={()=>countSet( 'item' )}
          defaultChecked={unitsExist}
          disabled={!unitsExist} />
        <label htmlFor='calcI'>
          <NumBox
            num={totalI}
            name={Pref.item + 's'}
            color='whiteT' />
        </label>
        <input
          type='radio'
          id='calcU'
          name='calc'
          onChange={()=>countSet( 'unit' )} />
          {unitsExist ?
            <label htmlFor='calcU'>
              <NumBox
                num={totalIU}
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
          {rvrDt.map( (entry)=>{
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
              let total = calcItem ? totalI : totalIU;
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
        
      </div>
    </div>
  );
};

export default StepsProgressX;

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
