import React, { useState } from 'react';
//import moment from 'moment';
import Pref from '/client/global/pref.js';
import './style.css';

import ToggleBar from '/client/components/bigUi/ToolBar/ToggleBar';
import MiniStack from '/client/components/charts/MiniScales/MiniStack.jsx';
import NumBox from '/client/components/tinyUi/NumBox.jsx';


const StepsProgressX  = ({ 
  quantity, flowCounts, fallCounts,
  riverTitle, brancheS, truncate 
})=> {
  
  const [ countCalc, countSet ] = useState('items');

  const dt = flowCounts;
    
  const rvrDt = dt.riverProg;
  
  const wflDt = fallCounts.sort((w1, w2)=> 
                              w1.pos < w2.pos ? -1 : w1.pos > w2.pos ? 1 : 0 );
  
  const totalI = dt.liveItems;

  const totalIU = dt.liveUnits;

  const scrapCount = dt.scrapCount;
  
  const unitsExist = totalIU > totalI ? true : false;
  const calcItem = countCalc === 'items' ? true : false;
  
  return (
    <div>
      {!truncate &&
        <div className='centreRow'>
          <label>
            <NumBox
              num={quantity}
              name='Total Quantity'
              color='whiteT' />
          </label>
            
          <label>
            <NumBox
              num={totalI}
              name={Pref.itemSerial + 's'}
              color='whiteT' />
          </label>
          
          <label>
            <NumBox
              num={totalIU}
              name={`${Pref.itemSerial} ${Pref.unit}s`}
              color='whiteT' />
          </label>
          
          {scrapCount > 0 ? 
            <label>
              <NumBox
                num={scrapCount}
                name={`${Pref.scrap} ${Pref.item}s`}
                color='redT' />
            </label>
          :null}
        </div>}
      
      <div className={`${!truncate ? 'wellSpacedLine bottomLine' : ''} doJustWeen cap`}>
        {!truncate &&
          <i>{Pref.buildFlow}: <b>{riverTitle || ''}</b></i>
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
              quantity={quantity}
              calcItem={calcItem}
              totalI={totalI}
              totalIU={totalIU}
              truncate={truncate}
            />
          );
        }
      })}
      
    </div>
    
  );
};

export default StepsProgressX;


const BranchProgress = ({ 
  branch, bRvr, bWfl, quantity, calcItem, totalI, totalIU, truncate
})=> (
  <div className='cap'>
    <h4>{branch.branch}</h4>
     
    {bWfl.map( (entry)=>{
      let rndmKeyW = Math.random().toString(36).substr(2, 5);
      return(
        <MiniStack
          key={rndmKeyW}
          title={`${entry.step} ${entry.type}`}
          count={entry.count}
          countNew={0}
          total={quantity} />
    )})}
    
    {bRvr.map( (entry)=>{
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
          <MiniStack
            key={rndmKeyR}
            title={`${entry.step} ${entry.type}`}
            count={count}
            countNew={countNew}
            total={total} />
        );
    }})}
    
  </div>
);


const StepRateDisplay = ({ step, gFirst, ngFirst, truncate })=> {
  
  const name = gFirst === true ? 'Good' :
                ngFirst === true ? 'No Good' :
                'Incomplete';
  const hidden = truncate && gFirst === true ? 'hide' : '';
  
  return(
    <p className={`cap smTxt ${hidden}`}>
      {gFirst === true ?
        <i><i className="fas fa-play-circle fa-fw fa-lg greenT"></i></i>
      : ngFirst === true ?
        <b><i className="far fa-play-circle fa-fw fa-lg yellowT"></i></b>
      : <em><i className="far fa-circle fa-fw fa-lg grayT"></i></em>
      }
      {step} first {name}
    </p>
  );
};