import React, { useState, useEffect, useLayoutEffect, Fragment } from 'react';
import moment from 'moment';
//import Pref from '/client/global/pref.js';

import HeadWater from '/client/components/river/HeadWater.js';

import TideWall from '/client/components/river/TideWall.jsx';

import River from '/client/components/river/River.jsx';

import VerifyIsland from '/client/components/river/VerifyIsland.jsx';

// import TideLock from '/client/components/tide/TideLock.jsx';

import ItemCard from './ItemCard.jsx';
import BatchCard from './BatchCard.jsx';


const DoProCard = ({ 
  itemData, batchData, widgetData, versionData, groupData,
  user, users, app, 
  
  ncTypesCombo, tideLockOut, tideKey,
  
  tideFloodGate,
  expand, handleExpand,
  
  showVerifyState, 
  optionVerify,
  handleVerify
})=> {
  

  const [ brancheState, brancheSortSet ] = useState([]);

  const [ flowData, flowDataSet ] = useState(false);

  useEffect( ()=>{
    const branches = app.branches.filter( b => b.open === true );
    const branchesSort = branches.sort((b1, b2)=> {
      return b1.position < b2.position ? 1 : 
             b1.position > b2.position ? -1 : 0 });
     brancheSortSet(branchesSort);
  }, [app]);
  
  useLayoutEffect( ()=> {
    const getFlowData = HeadWater(batchData, widgetData);
    flowDataSet(getFlowData);
  }, [batchData, widgetData]);
  
  if(!flowData || !batchData) {
    return <div>nope</div>;
  }
  
  const iSerial = !itemData ? null : itemData.serial;
  
  const iFinished = !iSerial ? null : itemData.finishedAt !== false;
  const iCascade = !iSerial ? null : itemData.rma.length > 0;
  
  const scrapCheck = !iSerial ? null :
    itemData.history.find(x => x.type === 'scrap' && x.good === true);
  
  const shortfall = batchData.shortfall || [];
  const shortfallS = !iSerial ? shortfall :
          shortfall.filter( x => x.serial === iSerial )
            .sort((s1, s2)=> {
              if (s1.partNum < s2.partNum) { return -1 }
              if (s1.partNum > s2.partNum) { return 1 }
              return 0;
            });
  
  
  const bFinished = batchData.finishedAt;
  const bComplete = bFinished !== false;
  
  const bWrapUp = bComplete ? moment().diff(bFinished, 'hours') <= 24 : false;
  
  const bCascade = batchData.cascade.length > 0;
  
  const bOpen = batchData.live || bWrapUp;
  
  const flows = [...flowData.flow,...flowData.flowAlt];
  const plainBrancheS = Array.from(brancheState, b => b.branch);
  const ancOptionS = app.ancillaryOption.sort();
  
  const insertTideWall = 
          <TideWall
            bID={batchData._id}
            bComplete={bComplete}
            bOpen={bOpen}
            bCascade={bCascade}
            itemData={itemData || null}
            iCascade={iCascade}
            shortfallS={shortfallS}
            scrap={scrapCheck}
            ancOptionS={ancOptionS}
            plainBrancheS={plainBrancheS}
            tideKey={tideKey} />;
            
  const insertItemCard = 
          <ItemCard
            itemData={itemData}
            hasRiver={flowData.hasRiver}
            isReleased={flowData.floorRel}
            iFinished={iFinished}
            iCascade={iCascade}
            scrap={scrapCheck}
            bID={batchData._id}
            bComplete={bComplete}
            shortfallS={shortfallS} />;
  
  const insertRiver = 
          <River
            itemData={itemData}
            batchData={batchData}
            widgetData={widgetData}
            app={app}
            users={users}
            brancheS={brancheState}
            flow={flowData.flow}
            flowAlt={flowData.flowAlt}
            progCounts={flowData.progCounts}
            shortfallS={shortfallS}
            scrapCheck={scrapCheck}
            showVerifyState={showVerifyState}
            optionVerify={optionVerify}
            handleVerify={handleVerify} />;
            
  const insertVerifyIsland =
          <VerifyIsland
            bID={batchData._id}
            itemData={itemData}
            flowFirsts={flows.filter( x => x.type === 'first' )}
            brancheS={brancheState}
            app={app}
            users={users}
            optionVerify={optionVerify}
            handleVerify={handleVerify} />;
  
  const insertBatchCard = 
          <BatchCard
            batchData={batchData}
            itemData={itemData}
            widgetData={widgetData}
            versionData={versionData}
            user={user}
            app={app}
            brancheS={brancheState}
            floorReleased={flowData.floorRel}
            progCounts={flowData.progCounts} />;
  
  
  return(
    <Fragment>
    
    {!itemData ? 
      
      !tideFloodGate && !bComplete ? 
        
        insertTideWall :
        
        insertBatchCard 
    : 
        
      !tideFloodGate ? 
        
        insertTideWall :
        
        !flowData.hasRiver || !flowData.floorRel || (iFinished && !bCascade) ? 
          
          insertItemCard :
          
          showVerifyState ?
            
            insertVerifyIsland :
            
            insertRiver
    }
      
        
  	{( !showVerifyState && expand ) && 
  	 ( itemData || ( !tideFloodGate && !bComplete ) ) ?
  	  
  	    insertBatchCard :
  	    
  	    !itemData && expand ?
  	    
  	      insertTideWall :
  	      
  	      null
  	}
  
    </Fragment>
  );
};

export default DoProCard;