// import React, { useState, useLayoutEffect, Fragment } from 'react';
// import moment from 'moment';
// import Pref from '/client/global/pref.js';

// import HeadWater, { HighWater, WhiteWater } from '/client/components/riverX/HeadWater';

// import TideWall from '/client/components/riverX/TideWall';

// import ReleaseAction from '/client/components/bigUi/ReleasesModule';

// import WaterfallSelect from '/client/components/riverX/waterfall/WaterfallSelect';

// import XBatchCard from './XBatchCard';

// const XDoProCard = ({ 
//   itemData, seriesData, batchData, rapidsData,
//   widgetData,
//   user,
//   brancheS, app, 
  
//   tideKey, timeOpen,
//   engagedPro, engagedMlti,
//   //ncTypesCombo,
  
//   expand,
//   //handleExpand,
  
//   showVerifyState
// })=> {

//   const [ flowData, flowDataSet ] = useState(false);
//   const [ fallData, fallDataSet ] = useState(false);
//   const [ rapidData, rapidDataSet ] = useState(false);
  
//   useLayoutEffect( ()=> {
//     const getFlowData = HeadWater(batchData, seriesData, widgetData, itemData);
//     flowDataSet(getFlowData);
//   }, [batchData.river, seriesData, widgetData]);
  
//   useLayoutEffect( ()=> {
//     const getFallData = HighWater(batchData, app);
//     fallDataSet(getFallData);
//   }, [batchData]);
  
//   useLayoutEffect( ()=> {
//     const getRapidData = WhiteWater( itemData, seriesData, rapidsData );
//     rapidDataSet(getRapidData);
//   }, [rapidsData]);
  
  
//   if(!batchData || !fallData) {
//     return <div>nope</div>;
//   }
  
//   const iSerial = !itemData ? null : itemData.serial;
  
//   const iComplete = !iSerial ? null : itemData.completed;
  
//   const scrapCheck = !iSerial ? null : itemData.scrapped &&
//           itemData.history.find(x => x.type === 'scrap' && x.good === true);
  
//   const shortfall = !seriesData ? [] : seriesData.shortfall;
//   const shortfallS = !iSerial || !seriesData ? shortfall :
//           shortfall.filter( x => x.serial === iSerial )
//             .sort((s1, s2)=>
//               s1.partNum < s2.partNum ? -1 : s1.partNum > s2.partNum ? 1 : 0 );
  
//   const bCompletedAt = batchData.completedAt;
//   const bComplete = batchData.completed;
  
//   const bWrapUp = !bComplete ? false :
//                     moment().diff(bCompletedAt, 'hours') <= Pref.timeAfterGrace;
  
//   const bOpen = batchData.live || bWrapUp;
//   const bClosed = !batchData.live && !bComplete;
  
//   const altIs = !itemData ? false : itemData.altPath.find( x => x.river !== false );
//   const altFlow = altIs && widgetData.flows.find( f => f.flowKey === altIs.river );
//   const altitle = altFlow && altFlow.title;
	
//   const rapid = !rapidData.rapIs ? rapidData.rapDo :
//                   rapidData.rapDo._id === rapidData.rapIs.rapId ? rapidData.rapDo : false;
  
//   timeOpen && rapid && rapid.instruct && Session.set('nowInstruct', rapid.instruct);
  
//   const ancOptionS = app.ancillaryOption.sort();
  
//   const flowAction = ( flowData.hasRiver || rapidData.rapIs ) && fallData.floorRel;
  
//   const allFall = fallData.fallCounts.allFall;
//   const fallAction = ( batchData.waterfall.length > 0 &&
//                         batchData.completed === false ) ||
//                     ( rapid && rapid.cascade.length > 0 );
  
//   const insertTideWall = 
//           <TideWall
//             bID={batchData._id}
//             bComplete={bComplete}
//             bOpen={bOpen}
//             rapidData={rapidData}
//             seriesData={seriesData}
//             itemData={itemData || null}
//             altitle={altitle}
//             shortfallS={shortfallS}
//             scrap={scrapCheck}
//             ancOptionS={ancOptionS}
//             brancheS={brancheS}
//             tideKey={tideKey}
//             timeOpen={timeOpen}
//             engagedPro={engagedPro}
//             engagedMlti={engagedMlti}
//           />;
  
//   const insertAxion =
//           <div className='proPrimeSingle'>
//             <ReleaseAction 
//               id={batchData._id} 
//               rType='floorRelease'
//               actionText={Pref.release}
//               qReady={batchData.quoteTimeBudget?.[0].timeAsMinutes > 0} />
//           </div>;

//   const insertWaterfall = 
//           <WaterfallSelect 
//             batchData={batchData}
//             allFlow={flowData.flowCounts.allFlow}
//             fallProg={fallData.fallCounts.fallProg}
//             allFall={allFall}
//             nowater={!fallAction && !seriesData && !rapid}
//             rapid={rapid}
//             rapIs={rapidData.rapIs}
//             app={app} />;
            
//   const insertBatchCard = 
//           <XBatchCard
//             batchData={batchData}
//             bOpen={bOpen}
//             bClosed={bClosed}
//             user={user}
//             app={app}
//             brancheS={brancheS}
//             ancOptionS={ancOptionS}
//             floorReleased={fallData.floorRel}
//             srange={flowData.srange}
//             flowCounts={flowData.flowCounts}
//             fallCounts={fallData.fallCounts}
//             rapidData={rapidData}
//             tideKey={tideKey}
//             timeOpen={timeOpen}
//             engagedPro={engagedPro}
//             expand={expand}
//             flowwater={itemData}
//             fallwater={fallAction && !itemData} />;
  
//   const openTideGate = timeOpen && ( engagedPro || engagedMlti );
  
//   return(
//     <Fragment>
    
//     {bClosed ? null :
    
//       !itemData ? // @ Batch
        
//         !openTideGate ? insertTideWall : // @ Locked
          
//           !fallData.floorRel ? insertAxion : // @ Release
          
//             fallAction ? insertWaterfall // @ Waterfall
//           : 
//             !expand ? insertBatchCard // Batch Tab Info
//             : 
//               null
//     : // @ Item
      
//       !openTideGate ? insertTideWall : // @ Locked
        
//         !flowAction || ( iComplete && !rapidData.rapIs ) ? <div>no Item</div> : // @ Rest
          
//           showVerifyState ? <div>no Redo</div> : // @ First Form
            
//             <div>no river</div> // @ River
//     }
      
//   	{!showVerifyState &&  // Toggled and No First Form
//   	  ( ( !bOpen && !openTideGate ) || ( bClosed && openTideGate ) || expand ) ?

//         insertBatchCard /* Batch Tab Info */ 
        
//         : null
//   	}
  
//     </Fragment>
//   );
// };

// export default XDoProCard;