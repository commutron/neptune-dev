// import React, { Fragment } from 'react';
// import Pref from '/client/global/pref.js';
// import CreateTag from '/client/components/tinyUi/CreateTag';
// import Tabs from '/client/components/smallUi/Tabs/Tabs';

// import XBatchTimeline from '/client/components/bigUi/BatchFeed/XBatchTimeline';

// import InfoTab from './InfoTab';
// import TimeTab from './TimeTab';
// import ProblemTab from './ProblemTab';

// import EventCustom from '/client/components/forms/Batch/Child/EventCustom';

// import { PopoverButton, PopoverMenu, PopoverAction } from '/client/layouts/Models/Popover';


// const BatchPanelX = ({ 
//   batchData, seriesData, rapidsData, widgetData, variantData, groupData, 
//   flowData, fallData,
//   user, app, brancheS, isDebug
// })=> {
  
//   const b = batchData;

//   const floorRelease = b.releases.find( x => x.type === 'floorRelease');
//   const released = floorRelease ? true : false;
//   const hasFall = b.waterfall.length > 0;
//   const done = b.completed === true && b.live === false;
  
//   let tabbar = [
//     'Info',
//     'Time',
//     'Counters',
//     `Problems`,
//     'Events',
//     rapidsData.length > 0 ? 'Extended' : 'Extend'
//   ];
  
//   const openAction = (dialogId)=> {
//     document.getElementById(dialogId)?.showModal();
//   };
  
//   function toggleHold() {
//     if(!b.hold) {
//       Meteor.call('setHold', b._id, (err)=>{
//         err && console.log(err);
//       });
//     }else{
//       Meteor.call('unsetHold', b._id, (err)=>{
//         err && console.log(err);
//       });
//     }
//   }
  
//   const accessR = Roles.userIsInRole(Meteor.userId(), 'run');
//   const accessE = Roles.userIsInRole(Meteor.userId(), 'edit');

//   const canEvt = accessE || accessR;
                
//   return(
//     <div className='section' key={b.batch}>
//         <EventCustom 
//           batchId={b._id}
//         />
        
//       <div className='floattaskbar stick'>
         
//         <PopoverButton 
//           targetid='poweractions'
//           attach='actions'
//           text='Actions'
//           icon='fa-solid fa-star gapR'
//         />
//         <PopoverMenu targetid='poweractions' attach='actions'>
//           <PopoverAction 
//             doFunc={()=>toggleHold()}
//             text={b.hold ? 'Remove Hold' : 'Apply Hold'}
//             icon='fa-solid fa-pause'
//             lock={!accessR}
//           />
//           <PopoverAction 
//             doFunc={()=>openAction(b._id+'_event_form')}
//             text='Add Custom Event'
//             icon='fa-solid fa-location-pin'
//             lock={!canEvt}
//           />
          
          
//         </PopoverMenu>
        
        
//       </div>
      
//       <Tabs
//         tabs={ tabbar }
//         wide={true}
//         stick={false}
//         hold={true}
//         sessionTab='batchExPanelTabs'>
        
//         <InfoTab
//           user={user}
//           b={batchData}
//           hasSeries={!seriesData ? false : true}
//           widgetData={widgetData}
//           radioactive={variantData.radioactive}
//           riverTitle={flowData.riverTitle}
//           srange={flowData.srange}
//           flowCounts={flowData.flowCounts}
//           fallCounts={fallData}
//           rapidsData={rapidsData}
//           released={released}
//           done={done}
//           allFlow={flowData.flowCounts.allFlow}
//           allFall={fallData.allFall}
//           nowater={!hasFall && !seriesData}
//           app={app}
//           brancheS={brancheS}
//           isDebug={isDebug}
//         />
        
//         <TimeTab 
//           batchData={batchData}
//           seriesData={seriesData}
//           rapidsData={rapidsData}
//           widgetData={widgetData}
//           user={user}
//           isDebug={isDebug}
//           totalUnits={b.quantity}
//           floorRelease={floorRelease}
//           done={done}
//           allDone={flowData.allFlow}
//           riverFlow={flowData.riverFlow}
//           app={app}
//           brancheS={brancheS} 
//         />
        
//         <ProblemTab
//           batch={batchData.batch}
//           seriesData={seriesData}
//           ncTypesCombo={flowData.ncTypesComboFlat}
//           brancheS={brancheS}
//           app={app}
//           isDebug={isDebug} />
          
//         <div className='space3v'>
//           <XBatchTimeline
//             batchData={b}
//             seriesId={seriesData._id}
//             releaseList={b.releases || []}
//             verifyList={flowData.flowCounts.firstsFlat}
//             eventList={b.events || []}
//             alterList={b.altered || []}
//             quoteList={b.quoteTimeBudget || []}
//             doneBatch={done}
//             brancheS={brancheS} />
//         </div>
        
//         <RapidExtendTab
//           batchData={batchData}
//           seriesData={seriesData}
//           rapidsData={rapidsData}
//           widgetData={widgetData}
//           vassembly={variantData.assembly}
//           urlString={
//             '?group=' + groupData.alias +
//             '&widget=' + widgetData.widget + 
//             '&ver=' + variantData.variant +
//             ( variantData.radioactive ? '☢' : ''  ) +
//             '&desc=' + widgetData.describe
//           }
//           released={released}
//           done={done}
//           nowater={!hasFall && !seriesData}
//           app={app}
//           user={user}
//           brancheS={brancheS}
//           ncTypesCombo={flowData.ncTypesComboFlat}
//           isDebug={isDebug}
//         />
        
//       </Tabs>
      
//       <CreateTag
//         when={b.createdAt}
//         who={b.createdWho}
//         whenNew={b.updatedAt}
//         whoNew={b.updatedWho}
//         dbKey={b._id}
//       />
//     </div>
//   );
// };
  
// export default BatchPanelX;