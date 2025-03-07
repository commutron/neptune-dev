// import React from 'react';
// import { withTracker } from 'meteor/react-meteor-data';
// // import moment from 'moment';
// // import 'moment-business-time';
// import Pref from '/client/global/pref.js';

// import Spin from '/client/components/tinyUi/Spin';
// import Tabs from '/client/components/smallUi/Tabs/Tabs';

// import EquipOnline from '/client/components/forms/Equip/EquipOnline';
// import EquipHibernate from '/client/components/forms/Equip/EquipHibernate';

// import Nameplate from './Nameplate';
// import ServiceSlides from './ServiceSlides';
// import IssueHistory from './IssueHistory';

// const EquipSlide = ({ 
//   equipData, maintainData, 
//   app, users, isDebug, isEqSup, isEdit, brancheS
// })=> {
  
//   const eq = equipData;
  
//   const liveUsers = users.filter( x => Roles.userIsInRole(x._id, 'active') && 
//                                       !Roles.userIsInRole(x._id, 'readOnly') );
                                        
//   const shrtI = eq.instruct && eq.instruct.indexOf('http') === -1;
  
//   const nowD = new Date();
  
//   const weekday = {
//     0: 'sunday',
//     1: 'monday',
//     2: 'tuesday',
//     3: 'wednesday',
//     4: 'thursday',
//     5: 'friday',
//     6: 'saturday',
//     startOf: 'start',
//     endOf: 'end'
//   };
  
//   const monthday = {
//     1:"1st", 2:"2nd", 3:"3rd", 4:"4th", 5:"5th",
//     6:"6th", 7:"7th", 8:"8th", 9:"9th", 10:"10th",
//     11:"11th", 12:"12th", 13:"13th", 14:"14th", 15:"15th",
//     16:"16th", 17:"17th", 18:"18th", 19:"19th", 20:"20th",
//     21:"21st", 22:"22nd", 23:"23rd", 24:"24th", 25:"25th",
//     26:"26th", 27:"27th", 28:"28th", 29:"29th", 30:"30th", 31:"31st",
//     startOf: 'start', endOf: 'end'
//   };
  
//   const month = {
//     0: "January", 1: "Febuary", 2: "March",
//     3: "April", 4: "May", 5: "June",
//     6: "July", 7: "August", 8: "September",
//     9: "October", 10: "November", 11: "December",
//     startOf: 'start', endOf: 'end'
//   };
  
//   return(
//     <div className='section overscroll' key={eq.alias}>
      
//       <div className='wide centreText'>
//         <h1 className='cap bigger'>{eq.equip}</h1>
        
//         <hr className='vmargin' />
//       </div>
      
//       <div className='wide rowWrapR'>
      
//         <div className='centreRow'>
//           {!eq.hibernate &&
//             <EquipOnline
//               id={eq._id}
//               equip={eq.alias}
//               online={eq.online}
//             />
//           }
          
//           <EquipHibernate
//             id={eq._id}
//             equip={eq.alias}
//             connect={!eq.hibernate}
//           />
          
//           <h3 className='spacehalf gapL cap'
//           >{!eq.branchKey || eq.branchKey === 'false' ? 'Facility' : 
//             brancheS.find( b => b.brKey === eq.branchKey).branch}
//           </h3>
//         </div>
        
//         <span className='flexSpace' />
        
//       </div>
      
//       {eq.hibernate ?
//         <p className='bold vspacehalf max875'>Disconnected equipment is unavailable, in storage, undergoing repairs, or similar, so maintenance will not be scheduled.</p>
//       : !eq.online && !eq.hibernate ?
//         <p className='bold vspacehalf max875'>Offline equipment is temporarily not in use, so frequent daily and weekly maintenance will default to 'not required'.<br/>Less frequent monthly and yearly maintenance will still be required by default.</p>
//       : null}
      
//       <p className='w100 vmarginhalf capFL wordBr'>
//         {Pref.premaintain} {Pref.instruct}: {shrtI ? app.instruct : null}
//         <a 
//           className='clean wordBr' 
//           href={shrtI ? app.instruct + eq.instruct : eq.instruct} 
//           target='_blank'
//         >{eq.instruct}</a>
//       </p>
      
//       <p className='w100 vmarginhalf capFL wordBr'>
//         Repair documents: {shrtI ? app.instruct : null}
//         <a 
//           className='clean wordBr' 
//           href={shrtI ? app.instruct + eq.library : eq.library} 
//           target='_blank'
//         >{eq.library}</a>
//       </p>
      
//       <Tabs
//         tabs={['Nameplate', Pref.premaintain, Pref.eqissue]}
//         wide={true}
//         stick={false}
//         hold={true}
//         sessionTab='equipExPanelTabs'>
      
//         <div className='autoFlex overscroll'>
//           <Nameplate 
//             equipData={equipData}
//             users={users}
//             isEqSup={isEqSup}
//             isEdit={isEdit}
//           />
//         </div>
        
//         <ServiceSlides 
//           equipData={equipData}
//           maintainData={maintainData}
//           nowD={nowD}
//           weekday={weekday}
//           monthday={monthday}
//           month={month}
//           isDebug={isDebug}
//         />
        
//         <div className='cardify autoFlex overscroll'>
//           <IssueHistory 
//             eqId={eq._id}
//             issData={eq.issues || []} 
//             isDebug={isDebug}
//             isEqSup={isEqSup}
//             liveUsers={liveUsers}
//           />
//         </div>
      
//       </Tabs>
      
      
//     </div>
//   );
// };

// const EquipHotData = ({
//   hotReady, // sub
//   equipData, maintainData,
//   app, users, isDebug, isEqSup, brancheS 
// })=> {

//   if( !hotReady ) {
//     return(
//       <div className='centre wide'>
//         <Spin />
//       </div>
//     );
//   }
  
//   return(
//     <EquipSlide
//       equipData={equipData}
//       maintainData={maintainData}
//       app={app}
//       users={users}
//       isDebug={isDebug}
//       isEqSup={isEqSup}
//       brancheS={brancheS}
//     />
//   );
// };

// export default withTracker( ({ equipLite, app, users, isDebug, brancheS }) => {
//   const hotSub = Meteor.subscribe('hotEquip', equipLite._id);
//   const isEqSup = Roles.userIsInRole(Meteor.userId(), ['admin','equipSuper']);
//   const isEdit = Roles.userIsInRole(Meteor.userId(), 'edit');
  
//   return {
//     hotReady: hotSub.ready(),
//     app: app,
//     users: users,
//     isDebug: isDebug,
//     isEqSup: isEqSup,
//     isEdit: isEdit,
//     brancheS: brancheS,
//     equipData: EquipDB.findOne({_id: equipLite._id}, { sort: { alias: -1 } } ),
//     maintainData: MaintainDB.find({equipId: equipLite._id}, { sort: { name: -1 } } ).fetch(),
//   };
// })(EquipHotData);