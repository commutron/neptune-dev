// import React from 'react';
// import Pref from '/client/global/pref.js';

// import SlidesNested from '/client/layouts/TaskBars/SlidesNested';
// import GroupLanding from './GroupLanding';
// import GroupSlide from './GroupSlide';

// const AllGroups = ({ 
//   groupData, widgetData, variantData, batchDataX, app, specify 
// }) => {

  
//   const inter = groupData.filter( g => g.internal );
  
//   const groupS = groupData.sort((g1, g2)=>
//                   g1.alias < g2.alias ? -1 : g1.alias > g2.alias ? 1 : 0 );
                  
//   const menuList = groupS.map( (entry)=> {
//                     const strk = entry.hibernate;
//                     let clss = entry.internal ? ' intrBlue' : '';
//                     let sub = entry.internal ? 'Internal' : '';
//                     return [entry.alias, strk, sub, clss];
//                   });
  
//   const defaultSlide = specify ? 
//     groupS.findIndex( x => x.alias === specify ) : false;
  
//   const canRun = Roles.userIsInRole(Meteor.userId(), 'run');
//   const canEdt = Roles.userIsInRole(Meteor.userId(), 'edit');
//   const canCrt = Roles.userIsInRole(Meteor.userId(), 'create');
//   const canRmv = Roles.userIsInRole(Meteor.userId(), 'remove');
  
//   return(
//     <SlidesNested
//       menuTitle={Pref.Group + 's'}
//       menu={menuList}
//       topPage={
//         <GroupLanding
//           groupData={groupData}
//           widgetData={widgetData}
//           variantData={variantData}
//           openActions={openActions}
//           canEdt={canEdt}
//         />
//       }
//       defaultSlide={defaultSlide}
//       collapse={Pref.hibernatated}
//       textStyle='up'>
    
//       {groupS.map( (entry, index)=> {
//         let widgetsList = widgetData.filter(x => x.groupId === entry._id);
//         return(
//           <GroupSlide
//             key={index+entry._id}
//             groupData={entry}
//             widgetsList={widgetsList}
//             batchDataX={batchDataX}
//             app={app}
//             inter={!inter || inter.length < Pref.interMax || inter.find( x=> x._id === entry._id )}
//             openActions={openActions}
            
//             canRun={canRun}
//             canEdt={canEdt}
//             canCrt={canCrt}
//             canRmv={canRmv}
//           />
//         )})}
//     </SlidesNested>
//   );
// };

// export default AllGroups;