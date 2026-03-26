import React from 'react';
// import Pref from '/public/pref.js';

// import KpiStat from '/client/components/smallUi/StatusBlocks/KpiStat';

// import { timeRanges } from '/client/utility/CycleCalc';

const BranchLanding = ({ uri, menuList })=> {
  
  const doSelect = (name)=> {
    if(uri) {
      !name ? FlowRouter.go(uri) : FlowRouter.go(uri + "&specify=" + name);
    }
  };
 
  return(
    <div className='overscroll'>
      
      <div className='autoColGrid space36v'>
        {menuList.map( (entry, index)=>{
          return(
            <button
              key={index}
              onClick={()=>doSelect(entry[0])}
              className='dptGridButton'
            ><b className='cap'>{entry[0]}</b>
            {entry[2] && <div className='small cap'>{entry[2]}</div>}
            </button>
          );
        })}
      </div>
            
    </div>
  );
};

export default BranchLanding;