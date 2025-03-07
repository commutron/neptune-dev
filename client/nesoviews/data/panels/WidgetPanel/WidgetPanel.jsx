// import React from 'react';
// import Pref from '/client/global/pref.js';
// import CreateTag from '/client/components/tinyUi/CreateTag';
// import Tabs from '/client/components/smallUi/Tabs/Tabs';

// import VariantCards from './VariantCards';


// const WidgetPanel = ({ widgetData, variantData,
//   batchRelated,
//   app, user,
// })=> {
  
//   const w = widgetData;
//   const v = variantData;
//   const b = batchRelated;
//   const a = app;
  
                           
//   const bS = b.sort((b1, b2)=> b1.batch < b2.batch ? -1 : b1.batch > b2.batch ? 1 : 0 );
//   const batchIDs = Array.from( bS, x => x._id );

  
//   const canEdt = Roles.userIsInRole(Meteor.userId(), 'edit');
//   const canRun = Roles.userIsInRole(Meteor.userId(), 'run');
//   const canRmv = Roles.userIsInRole(Meteor.userId(), 'remove');
  
 
//   return(
//     <div className='space' key={w.widget}>
      
//       <div className='floattaskbar stick light'>
        
//         <span className='cap wordBr'><strong>{w.describe}</strong></span>
        
//       </div>
      
//       <div>
          
//       <Tabs
//         tabs={[Pref.variants, Pref.flow + 's', 'Times', 'Problems']}
//         wide={true}
//         stick={false}
//         hold={true}
//         sessionTab='widgetExPanelTabs'>
        
//         <div className='space'>
//           {variantData.length < 1 ? <p>no {Pref.variants} created</p> : 
//             <VariantCards
//               variantData={variantData}
//               widgetData={widgetData} 
//               batchRelated={batchRelated}
//               app={app}
//               user={user}
//               canEdt={canEdt}
//               canRun={canRun}
//               canRmv={canRmv}
//             />
//           }
//         </div>
        
//         <WTimeTab
//           widgetData={widgetData}
//           batchIDs={batchIDs}
//           app={a} />
          
        
//       </Tabs>

//       </div>

//       <CreateTag
//         when={w.createdAt}
//         who={w.createdWho}
//         whenNew={w.updatedAt}
//         whoNew={w.updatedWho}
//         dbKey={w._id} />
//     </div>
//   );
// };

// export default WidgetPanel;