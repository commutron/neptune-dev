// import React from 'react';
// import { Meteor } from 'meteor/meteor';
// import { withTracker } from 'meteor/react-meteor-data';
// import { localeUpdate } from '/client/utility/WorkTimeCalc';
// import { branchesSort } from '/client/utility/Arrays.js';
// import { PlainFrame } from '/client/layouts/MainLayouts';
// // import Pref from '/public/pref.js';
// import Spin from '../../components/tinyUi/Spin';

// import DashSlide from './DashSlide/DashSlide';

// const PeopleDataWrap = ({
//   readybName, readyPeople,
//   users, loggedIn, app,
//   traceDT
// })=> {
    
//   if( !readybName || !readyPeople || !app ) {
//     return( 
//       <PlainFrame title='People'>
//         <div className='centre wide'>
//           <Spin />
//         </div>
//       </PlainFrame>
//     );
//   }
  
//   localeUpdate(app);
  
//   const userS = users.sort((u1, u2)=>
//           u1.username.toLowerCase() > u2.username.toLowerCase() ? 1 : 
//           u1.username.toLowerCase() < u2.username.toLowerCase() ? -1 : 0 );
//   const brancheS = branchesSort(app.branches);
     
//   return(
//     <PlainFrame title='People'>
//       <div className='simpleContent'>
//           <DashSlide
//             key={0}
//             users={userS}
//             loggedIn={loggedIn}
//             traceDT={traceDT}
//             brancheS={brancheS}
            
//           />
				
//       </div>
//     </PlainFrame>
//   );
// };

// export default withTracker( () => {
//   let login = Meteor.userId() ? true : false;
//   let user = login ? Meteor.user() : false;
//   let org = user ? user.org : false;
//   let active = login ? Roles.userIsInRole(Meteor.userId(), 'active') : false;
//   const bNameSub = login ? Meteor.subscribe('bNameData') : false;
//   const peopleSub = login ? Meteor.subscribe('peopleData') : false;
//   if(!login) {
//     return {
//       readybName: false,
//       readyPeople: false
//     };
//   }else if(!active) {
//     return {
//       readybName: false,
//       readyPeople: false
//     };
//   }else{
//     return {
//       readybName: bNameSub.ready(),
//       readyPeople: peopleSub.ready(),
//       user: user,
//       active: active,
//       org: org,
//       app: AppDB.findOne({org: org}),
//       traceDT: TraceDB.find({}).fetch(),
//       users: Meteor.users.find({}).fetch(),
//       loggedIn: CacheDB.findOne({dataName: 'userLogin_status'})?.dataArray
//     };
//   }
// })(PeopleDataWrap);