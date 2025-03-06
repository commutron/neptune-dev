// import React from 'react';
// import Pref from '/client/global/pref.js';

// import StreamLayout from '/client/layouts/StreamLayout';

// import CompSearchData from '/client/views/upstream/CompSearch/CompSearchData';
// import ReportShort from '/client/views/upstream/ReportShort';
// import DocsReadySlide from '/client/views/upstream/DocsReadySlide';

// const UpstreamWrap = ({ 
//   view, traceDT,
//   user, app,
// })=> {
  
//   const isAuth = Roles.userIsInRole(Meteor.userId(), ['run', 'kitting']);
  
//   if( view === 'parts' && app.partsGlobal) {
//     return (
//       <StreamLayout
//         user={user}
//         app={app}
//         title='Parts Search'
//         subLink={view}
//         action={false}
//         isAuth={isAuth}
//       >
//         <CompSearchData
//           name={user.username} 
//           user={user}
//           org={user.org}
//           app={app} />
//       </StreamLayout>
//     );
//   }
  
//   if(view === 'shortfalls') {
//     return (
//       <StreamLayout
//         user={user}
//         app={app}
//         title={Pref.shortfalls}
//         subLink={view}
//         action={false}
//         isAuth={isAuth}
//       >
//         <ReportShort
//           user={user}
//           app={app}
//         />
//       </StreamLayout>
//     );
//   }
  
//   if(view === 'docs') {
//     return (
//       <StreamLayout
//         user={user}
//         app={app}
//         title='Instruction Docs'
//         subLink={view}
//         action={false}
//       >
//         <DocsReadySlide
//           traceDT={traceDT}
//           app={app} 
//         />
//       </StreamLayout>
//     );
//   }
  
 
  
//   return (
//     <StreamLayout
//       user={user}
//       app={app}
//       title={Pref.upstream}
//       subLink={false}
//       tag='kit'
//       isAuth={isAuth}
//     >
//       <div></div>
//     </StreamLayout>
//   );
	
// };

// export default UpstreamWrap;