import React, { useState } from 'react';
//import moment from 'moment';
import Pref from '/client/global/pref.js';
import './style.css';

import RiverSelect from '/client/components/forms/RiverSelectX';
import BranchProgress from './BranchProgress';

import ToggleBar from '/client/components/smallUi/Tabs/ToggleBar';
import MiniStack from '/client/components/charts/MiniScales/MiniStack.jsx';
import NumBox from '/client/components/tinyUi/NumBox.jsx';
import { round2Decimal } from '/client/utility/Convert';

const StepsProgressX  = ({ 
  b, widgetData, hasSeries, flowCounts, fallCounts, rapidsData,
  riverTitle, brancheS, truncate 
})=> {
  
  const [ countCalc, countSet ] = useState('items');

  const dt = flowCounts;
    
  const rvrDt = dt.riverProg;
  const wflDt = fallCounts.fallProg;
  
  const totalI = dt.liveItems;

  const totalIU = dt.liveUnits;

  const scrapCount = dt.scrapCount;
  
  const unitsExist = totalIU > totalI ? true : false;
  const calcItem = countCalc === 'items' ? true : false;
  
  const oRvr = rvrDt.filter( r => !r.bKey );
  const oWfl = wflDt.filter( r => !r.bKey );
  let rndmKeyO = Math.random().toString(36).substr(2, 5);
  
  return (
    <div>
      {!truncate &&
        <div className='centreRow'>
          <label>
            <NumBox
              num={b.quantity}
              name='Total Quantity'
              color='blackT' />
          </label>
          
          {totalI !== b.quantity ?  
            <label>
              <NumBox
                num={totalI}
                name={Pref.items}
                color='blackT' />
            </label>
          :null}
          
          {totalIU > totalI ?
            <label>
              <NumBox
                num={totalIU}
                name={`${Pref.item} ${Pref.unit}s`}
                color='blackT' />
            </label>
          :null}
          
          {dt.altItems > 0 ?  
            <label>
              <NumBox
                num={dt.altItems}
                name={`Alt ${Pref.items}`}
                color='tealT' />
            </label>
          :null}
          
          {scrapCount > 0 ? 
            <label>
              <NumBox
                num={scrapCount}
                name={`${Pref.scrap} ${Pref.item}s`}
                color='redT' />
            </label>
          :null}
        </div>}
      
      <div className={`${!truncate ? 'bottomLine' : ''} vmarginhalf cap`}>
        {!truncate &&
          <RiverSelect
            bID={b._id}
            wFlows={widgetData.flows}
            river={b.river}
            riverTitle={riverTitle}
            lock={!hasSeries || b.completed === true} />
        }
        {unitsExist &&
          <ToggleBar
            toggleOptions={['units','items']}
            toggleVal={countCalc}
            toggleSet={countSet}
          />
        }
      </div>
      
      {brancheS.map( (branch, index)=> {
        const bRvr = rvrDt.filter( r => r.bKey === branch.brKey );
        const bWfl = wflDt.filter( r => r.bKey === branch.brKey );
        
        if( bRvr.length > 0 || bWfl.length > 0) {
          let rndmKeyB = Math.random().toString(36).substr(2, 5);
          return(
            <BranchProgress
              key={rndmKeyB}
              branch={branch}
              bRvr={bRvr}
              bWfl={bWfl}
              quantity={b.quantity}
              calcItem={calcItem}
              totalI={totalI}
              totalIU={totalIU}
              truncate={truncate}
            />
          );
        }
      })}
      
      {oRvr.length > 0 || oWfl.length > 0 ?
        <BranchProgress
          key={rndmKeyO}
          branch={{branch:"Other"}}
          bRvr={oRvr}
          bWfl={oWfl}
          quantity={b.quantity}
          calcItem={calcItem}
          totalI={totalI}
          totalIU={totalIU}
          truncate={truncate}
        />
      : null}
      
      {dt.altItems > 0 &&
        <MiniStack
          key='altCombo'
          title={`Alternative ${Pref.items}`}
          count={calcItem ? dt.altDone : dt.altDone * ( dt.altUnits / dt.altItems )}
          countNew={0}
          total={calcItem ? dt.altItems : dt.altUnits} />
      }
    
      {rapidsData && rapidsData.map( (r, ix)=>(
        <MiniStack
          key={'rapid'+ix}
          title={`${r.rapid} ${r.issueOrder}`}
          count={round2Decimal(r.quantity * (isNaN(r.rDone) ? 1 : r.rDone))}
          countNew={0}
          total={r.quantity} />
      ))}
      
    </div>
    
  );
};

export default StepsProgressX;