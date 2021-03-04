import React from 'react';

import StepRateDisplay from './StepRateDisplay';
import MiniStack from '/client/components/charts/MiniScales/MiniStack.jsx';

const BranchProgress = ({ 
  branch, bRvr, bWfl, quantity, calcItem, totalI, totalIU, truncate
})=> (
  <div className='cap noCopy'>
    {!truncate && <h4>{branch.branch}</h4>}
     
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

export default BranchProgress;