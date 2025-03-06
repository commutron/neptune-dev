// import React from 'react';
// import { Meteor } from 'meteor/meteor';
// import { withTracker } from 'meteor/react-meteor-data';
// import Pref from '/client/global/pref.js';

// import { localeUpdate } from '/client/utility/WorkTimeCalc';
// import { branchesOpenSort } from '/client/utility/Arrays.js';

// import StreamLayout from '/client/layouts/StreamLayout';
// import UpstreamWrap from './UpstreamWrap';

// const View = ({
//   ready, readyT, view,
//   user, app, users, isDebug,
//   batchX, traceDT,
// })=> {
  
//   if( !ready || !readyT || !app || !users ) {
//     return(
//       <StreamLayout
//         title={Pref.upstream}
//         tag='kit'
//       >
//         <div></div>
//       </StreamLayout>
//     );
//   }
  
//   localeUpdate(app);
  
//   const brancheS = branchesOpenSort(app.branches);

//   return(
//     <UpstreamWrap 
//       view={view}
//       batchX={batchX}
//       traceDT={traceDT}
//       user={user}
//       app={app}
//       users={users}
//       brancheS={brancheS}
//       isDebug={isDebug} 
//     />
//   );
// };


// export default withTracker( ({ view } ) => {
//   let login = Meteor.userId() ? true : false;
//   let user = login ? Meteor.user() : false;
//   let active = user ? Roles.userIsInRole(Meteor.userId(), 'active') : false;
//   let isDebug = user ? Roles.userIsInRole(Meteor.userId(), 'debug') : false;
//   let org = user ? user.org : false;
//   const sub = login ? Meteor.subscribe('shaddowData') : false;
//   const subT = login ? Meteor.subscribe('traceDataLive', view) : false;
  
//   if(!login || !active) {
//     return {
//       ready: false,
//       readyT: false
//     };
//   }else{
//     return {
//       login: Meteor.userId(),
//       ready: sub.ready(),
//       readyT: subT.ready(),
//       view: view,
//       user: user,
//       isDebug: isDebug,
//       app: AppDB.findOne({org: org}),
//       users: Meteor.users.find( {}, { sort: { username: 1 } } ).fetch(),
//       batchX: XBatchDB.find({live: true}).fetch(),
//       traceDT: TraceDB.find({}).fetch(),
//     };
//   }
// })(View);