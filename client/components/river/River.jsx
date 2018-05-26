import React from 'react';
//import Pref from '/client/global/pref.js';

import StoneSelect from './StoneSelect.jsx';
import RiverFork from './RiverFork.jsx';
import RMACascade from './RMACascade.jsx';
import MiniHistory from './MiniHistory.jsx';
import AltMarker from '/client/components/uUi/AltMarker.jsx';

const River = ({ itemData, batchData, widgetData, app, users, flow, flowAlt, progCounts, expand })=> {

  const b = batchData;
  const i = itemData;
  const w = widgetData;
  
  let useFlow = [];
  let rma = [];
  
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

	// present option between River and Alt River
	if(i.finishedAt === false && b.riverAlt && !i.alt) {
	  return(
	    <div className={expand && 'stonePlus'}>
        <div className={expand && 'stonePlusLeft'}>
    	    <RiverFork
            id={b._id}
            serial={i.serial}
            flows={w.flows}
            river={b.river}
            riverAlt={b.riverAlt} />
        </div>
        {expand &&
    		  <div className='stonePlusRight space'>
    			  <MiniHistory history={i.history} />
    			</div>}
    	</div>
    );
	}

  return(
		<div>
		
		  {i.finishedAt !== false && b.cascade.length > 0 ?
		    <RMACascade 
          id={b._id}
          barcode={i.serial}
          rma={rma}
          cascadeData={b.cascade}
          rmaList={i.rma}
          allItems={b.items}
          expand={expand} />
        :null}
		  
		  <div>
		    {i.finishedAt === false && b.riverAlt && i.alt !== false ? 
		      <AltMarker id={b._id} serial={i.serial} alt={i.alt} />
		    : null}
        <StoneSelect
          id={b._id}
          flow={useFlow}
          isAlt={!b.riverAlt ? false : true}
          rmas={rma}
          allItems={b.items}
          nonCons={b.nonCon}
          shortfalls={b.shortfall || []}
          serial={i.serial}
          history={i.history}
          finishedAt={i.finishedAt}
          regRun={i.finishedAt === false}
          users={users}
          methods={app.toolOption}
          progCounts={progCounts}
          expand={expand} />
      </div>
      
		</div>
	);
};

export default River;