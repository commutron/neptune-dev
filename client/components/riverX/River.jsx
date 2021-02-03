import React, { useRef, useState, useEffect } from 'react';
import Pref from '/client/global/pref.js';

import StoneSelect from './StoneSelect.jsx';
// import RiverFork from './RiverFork.jsx';
// import RMACascade from './RMACascade.jsx';
// import MiniHistory from './MiniHistory.jsx';
// import AltMarker from '/client/components/tinyUi/AltMarker.jsx';

const River = ({ 
  batchData, seriesData, itemData, widgetData, 
  app, users, brancheS,
  flow, flowCounts,
  shortfallS, scrapCheck,
  showVerifyState, optionVerify, handleVerify
})=> {
  
  const thingMounted = useRef(true);
  
  const [ undoStepOption, undoOpSet ] = useState(false);
  
  useEffect(() => {
    return () => { thingMounted.current = false;
      // Meteor.clearTimeout(timer);
    };
  }, []);
  
  function tempOpenOption() {
    undoOpSet( true );
    Meteor.setTimeout(()=> {
      if(thingMounted.current) { undoOpSet( false ); }
    }, Pref.stepUndoWindow);
  }
  function closeOption() {
    undoOpSet( false );
  }

  const b = batchData;
  const w = widgetData;

  let useFlow = !flow ? w.flows.find( x => x.flowKey === b.river).flow : flow;
  // let rma = [];
  /*
  if(i.finishedAt !== false) {
  // set flow as rma steps
    for(let doRMA of i.rma) {
      let match = b.cascade.find( x => x.key === doRMA);
      match ? rma.push(match) : false;
    }
    for(let rflw of rma) {
      for(let step of rflw.flow) {
        useFlow.push(step);
      }
    }
  }else if(b.riverAlt && i.alt === 'yes') {
  // set flow as Alt River
    useFlow = !flowAlt ? w.flows.find( x => x.flowKey === b.riverAlt).flow : flowAlt;
  }else{
  // set flow as River
    useFlow = !flow ? w.flows.find( x => x.flowKey === b.river).flow : flow;
  }
  */
  /*
	// present option between River and Alt River
	if(i.completed === false && b.riverAlt && !i.alt) {
	  return(
	    <div>
        <div>
    	    <RiverFork
            id={b._id}
            serial={i.serial}
            flows={w.flows}
            river={b.river}
            riverAlt={b.riverAlt} />
        </div>
  		  <MiniHistory history={i.history} />
    	</div>
    );
	}
*/
  return(
		<div>
		
		  {/*i.finishedAt !== false && b.cascade.length > 0 ?
		    <RMACascade 
          id={b._id}
          barcode={i.serial}
          rma={rma}
          cascadeData={b.cascade}
          rmaList={i.rma}
          allItems={b.items} />
        :null*/}
		  
		  <div>
		    {/*i.finishedAt === false && b.riverAlt && i.alt !== false ? 
		      <AltMarker id={b._id} serial={i.serial} alt={i.alt} />
		    : null*/}
        <StoneSelect
          bID={b._id}
          bComplete={b.completed}
          flow={useFlow}
          // isAlt={i.alt === 'yes'}
          // hasAlt={!b.riverAlt ? false : true}
          seriesId={seriesData._id}
          item={itemData}
          allItems={seriesData.items}
          nonCons={seriesData.nonCon}
          shortfalls={shortfallS}
          scrapCheck={scrapCheck}
          // iCascade={i.rma.length > 0}
          brancheS={brancheS}
          users={users}
          flowCounts={flowCounts}
          app={app}
          
          showVerifyState={showVerifyState}
          optionVerify={optionVerify}
          handleVerify={handleVerify}
          
          undoOption={undoStepOption}
          openUndoOption={()=>tempOpenOption()}
          closeUndoOption={()=>closeOption()} />
      </div>
      
		</div>
	);
};

export default River;