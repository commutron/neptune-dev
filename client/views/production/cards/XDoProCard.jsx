import React, { useState, useEffect, useLayoutEffect, Fragment } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import HeadWater, { HighWater } from '/client/components/riverX/HeadWater';

import TideWall from '/client/components/riverX/TideWall';

import ReleaseAction from '/client/components/bigUi/ReleasesModule.jsx';

import WaterfallSelect from '/client/components/riverX/waterfall/WaterfallSelect';

import River from '/client/components/riverX/River.jsx';

import VerifyIsland from '/client/components/riverX/VerifyIsland.jsx';

import XItemCard from './XItemCard';
import XBatchCard from './XBatchCard';


const XDoProCard = ({ 
  itemData, seriesData, batchData, widgetData, groupData,
  user, users, app, 
  
  ncTypesCombo, tideKey,
  
  tideFloodGate,
  expand, handleExpand,
  
  showVerifyState, 
  optionVerify,
  handleVerify
})=> {
  
  const [ brancheState, brancheSortSet ] = useState([]);

  const [ flowData, flowDataSet ] = useState(false);
  const [ fallData, fallDataSet ] = useState(false);

  useEffect( ()=>{
    const branches = app.branches.filter( b => b.open === true );
    const branchesSort = branches.sort((b1, b2)=>
          b1.position < b2.position ? 1 : b1.position > b2.position ? -1 : 0 );
     brancheSortSet(branchesSort);
  }, [app]);
  
  useLayoutEffect( ()=> {
    const getFlowData = HeadWater(batchData, seriesData, widgetData);
    flowDataSet(getFlowData);
  }, [batchData.river, seriesData, widgetData]);
  
  useLayoutEffect( ()=> {
    const getFallData = HighWater(batchData, app);
    fallDataSet(getFallData);
  }, [batchData]);
  
  if(!batchData || !fallData) {
    return <div>nope</div>;
  }
  
  const iSerial = !itemData ? null : itemData.serial;
  
  const iComplete = !iSerial ? null : itemData.completed;
  // const iCascade = !iSerial ? null : itemData.rma.length > 0;
  
  const scrapCheck = !iSerial ? null :
    itemData.history.find(x => x.type === 'scrap' && x.good === true);
  
  const shortfall = !seriesData ? [] : seriesData.shortfall;
  const shortfallS = !iSerial || !seriesData ? shortfall :
          shortfall.filter( x => x.serial === iSerial )
            .sort((s1, s2)=>
              s1.partNum < s2.partNum ? -1 : s1.partNum > s2.partNum ? 1 : 0 );
  
  const bCompletedAt = batchData.completedAt;
  const bComplete = batchData.completed;
  
  const bWrapUp = !bComplete ? false :
                    moment().diff(bCompletedAt, 'hours') <= Pref.timeAfterGrace;
  
  // const bCascade = batchData.cascade.length > 0;
  
  const bOpen = batchData.live || bWrapUp;
  const bClosed = !batchData.live && !bComplete;
  
  const flows = flowData ? flowData.flow : [];
  const plainBrancheS = Array.from(brancheState, b => b.branch);
  const ancOptionS = app.ancillaryOption.sort();
  
  const flowAction = flowData.hasRiver && fallData.floorRel;
  const fallAction = batchData.waterfall.length > 0;
  
  const insertTideWall = 
          <TideWall
            bID={batchData._id}
            bComplete={bComplete}
            bOpen={bOpen}
            // bCascade={bCascade}
            // iCascade={iCascade}
            seriesData={seriesData}
            itemData={itemData || null}
            shortfallS={shortfallS}
            scrap={scrapCheck}
            ancOptionS={ancOptionS}
            plainBrancheS={plainBrancheS}
            tideKey={tideKey}
            tideFloodGate={tideFloodGate} />;
  
  const insertAxion =
          <ReleaseAction 
            id={batchData._id} 
            rType='floorRelease'
            actionText='release'
            //contextText='to the floor'
            isX={true} />;

  const insertWaterfall = 
          <WaterfallSelect 
            batchData={batchData}
            allFlow={flowData.flowCounts.allFlow}
            fallProg={fallData.fallCounts.fallProg}
            allFall={fallData.fallCounts.allFall}
            nowater={!fallAction && !seriesData}
            app={app} />;
            
  const insertItemCard = 
          <XItemCard
            seriesId={seriesData && seriesData._id}
            bComplete={bComplete}
            isReleased={fallData.floorRel}
            hasRiver={flowData.hasRiver}
            itemData={itemData}
            iComplete={iComplete}
            // iCascade={iCascade}
            shortfallS={shortfallS}
            scrap={scrapCheck} />;
  
  const insertRiver = 
          <River
            itemData={itemData}
            seriesData={seriesData}
            batchData={batchData}
            widgetData={widgetData}
            app={app}
            users={users}
            brancheS={brancheState}
            flow={flowData.flow}
            flowCounts={flowData.flowCounts}
            shortfallS={shortfallS}
            scrapCheck={scrapCheck}
            showVerifyState={showVerifyState}
            optionVerify={optionVerify}
            handleVerify={handleVerify} />;
            
  const insertVerifyIsland =
          <VerifyIsland
            batchId={batchData._id}
            seriesId={seriesData && seriesData._id}
            itemData={itemData}
            flowFirsts={flows.filter( x => x.type === 'first' )}
            brancheS={brancheState}
            app={app}
            users={users}
            optionVerify={optionVerify}
            handleVerify={handleVerify} />;
  
  const insertBatchCard = 
          <XBatchCard
            batchData={batchData}
            bOpen={bOpen}
            bClosed={bClosed}
            user={user}
            app={app}
            brancheS={brancheState}
            plainBrancheS={plainBrancheS}
            ancOptionS={ancOptionS}
            floorReleased={fallData.floorRel}
            srange={flowData.srange}
            flowCounts={flowData.flowCounts}
            fallCounts={fallData.fallCounts}
            tideKey={tideKey}
            tideFloodGate={tideFloodGate}
            expand={expand}
            flowwater={flowAction && itemData}
            fallwater={fallAction && !itemData} />;
  
  return(
    <Fragment>
    
    {bClosed ? null :
    
    !itemData ? // @ Batch
      
      !tideFloodGate ? insertTideWall : // @ Locked
        
        !fallData.floorRel ? insertAxion : // @ Release
        
          fallAction ? insertWaterfall // @ Waterfall
        : 
          !expand ? insertBatchCard // Batch Tab Info
          : 
            null
    : // @ Item
      
      !tideFloodGate ? insertTideWall : // @ Locked
        
        !flowAction || iComplete ? insertItemCard : // @ Rest
          
          showVerifyState ? insertVerifyIsland : // @ First Form
            
            insertRiver // @ River
    }
      
  	{!showVerifyState &&  // Toggled and No First Form
  	  ( !bOpen || expand ) &&

      insertBatchCard /* Batch Tab Info */ 
  	}
  
    </Fragment>
  );
};

export default XDoProCard;