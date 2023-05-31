import React, { useState } from 'react';
import Pref from '/client/global/pref.js';

import RiverSelect from '/client/components/forms/Batch/RiverSelectX';

import ToggleBar from '/client/components/smallUi/Tabs/ToggleBar';
import StepRateDisplay from './StepRateDisplay';
import MiniStack from '/client/components/charts/MiniScales/MiniStack';
import NumBox from '/client/components/tinyUi/NumBox.jsx';
import { round2Decimal } from '/client/utility/Convert';

const StepsProgressX  = ({ 
  b, widgetData, hasSeries, flowCounts, fallCounts, rapidsData,
  riverTitle, brancheS, truncate, canRun
})=> {
  
  const [ countCalc, countSet ] = useState('items');

  const dt = flowCounts;
    
  const rvrDt = dt?.riverProg || [];
  const wflDt = fallCounts?.fallProg || [];
  
  const totalI = dt?.liveItems || 0;

  const totalIU = dt?.liveUnits || 0;

  const scrapCount = dt?.scrapCount || 0;
  
  const unitsExist = totalIU > totalI ? true : false;
  const calcItem = countCalc === 'items' ? true : false;
  
  return(
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
          
          {( dt?.altItems || 0 ) > 0 ?  
            <label>
              <NumBox
                num={dt?.altItems || 0}
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
            lock={b.completed ? Pref.isDone :
                 !hasSeries ? `No ${Pref.series}` : false}
            access={canRun} />
        }
        {unitsExist &&
          <ToggleBar
            toggleOptions={['units','items']}
            toggleVal={countCalc}
            toggleSet={countSet}
          />
        }
      </div>
      
      {wflDt.length > 0 ? 
        <details className='cap noCopy vmarginquarter bottomLine'
          open={!truncate || rvrDt.length === 0}>
        <summary className='nospace line2x autoHeight'><b>{Pref.fall}</b></summary>
    
        {wflDt.map( (entry)=>{
          const brch = brancheS.find( br => br.brKey === entry.bKey );
          const topNum = entry.action === 'slider' ? 'percent' : b.quantity;
          return(
            <MiniStack
              key={entry.wfKey}
              title={`${entry.step} ${entry.type}`}
              subtitle={brch ? brch.branch : ''}
              count={entry.count}
              countNew={entry.countNew}
              total={topNum}
              truncate={truncate} />
        )})}
        </details>
      : null}
      
      {rvrDt.length > 0 ? 
        <span className='cap noCopy vmarginquarter'>
        
        {rvrDt.map( (entry)=>{
          const brch = brancheS.find( br => br.brKey === entry.bKey );
          if(entry.obj === 'ping') {
            return(
              <StepRateDisplay
                key={entry.key}
                step={entry.step}
                subtitle={brch ? brch.branch : ''}
                gFirst={entry.goodFirst}
                ngFirst={entry.ngFirst}
                truncate={truncate} />
            );
          }else{
            let count = calcItem ? entry.items : entry.units;
            let countNew = calcItem ? entry.itemsNew : entry.unitsNew;
            let countPass = calcItem ? entry.itemPassd : entry.unitPassd;
            let total = calcItem ? totalI : totalIU;
            return(
              <MiniStack
                key={entry.key}
                title={`${entry.step} ${entry.type}`}
                subtitle={brch ? brch.branch : ''}
                count={count}
                countNew={countNew}
                countPass={countPass}
                total={total}
                truncate={truncate} />
            );
        }})}
        </span>
      : null}
      
      {( dt?.altItems || 0 ) > 0 &&
        <MiniStack
          key='altCombo'
          title={`Alternative ${Pref.items}`}
          count={calcItem ? dt.altDone : dt.altDone * ( dt.altUnits / dt.altItems )}
          countNew={dt.altDoneNew}
          total={calcItem ? dt.altItems : dt.altUnits} />
      }
    
      {rapidsData && rapidsData.map( (r, ix)=>{
        return(
          <MiniStack
            key={'rapid'+ix}
            title={`${r.rapid} ${r.issueOrder}`}
            subtitle={r.type}
            count={round2Decimal(r.quantity * (isNaN(r.rDone) ? 1 : r.rDone))}
            countNew={round2Decimal(r.quantity * (isNaN(r.rNew) ? 1 : r.rNew))}
            total={r.quantity}
            tips={[
              r.rFin ? r.rFin[0] + ' Completed ' + Pref.items : null,
              r.rFin ? r.rFin[1] + ' New Completed ' + Pref.items : null
            ]}
            truncate={truncate} />
      )})}
      
    </div>
    
  );
};

function areEqual(prevProps, nextProps) {
	if( prevProps !== nextProps	) {
  	return false;
	}else{
		return true;
	}
}
export default React.memo(StepsProgressX, areEqual);