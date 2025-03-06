// import React, { useState, useEffect } from 'react';
// import { Meteor } from 'meteor/meteor';
// import { withTracker } from 'meteor/react-meteor-data';
// import moment from 'moment';

// import Pref from '/client/global/pref.js';
// import { CalcSpin } from '/client/components/tinyUi/Spin';

// import { branchesSort } from '/client/utility/Arrays.js';

// import { PlainFrame } from '/client/layouts/MainLayouts';
// import Spin from '/client/components/tinyUi/Spin';

// const UserDataWrap = ({
//   readybNames,
//   user, app,
//   traceDT, users
// })=> {
  
//   const [equipData, setEquipData] = useState(false);
  
//   useEffect( ()=>{ 
//     Meteor.call('getEquipAssigned', (err, rtn)=>{
// 	    err && console.log(err);
// 	    if(rtn) {
// 	    const alpha = rtn.sort((x1, x2)=>
//                       x1.equip > x2.equip ? 1 : 
//                       x1.equip < x2.equip ? -1 : 0 );
//       setEquipData(alpha);
// 	    }
// 	  });
//   }, []);
  
//   const [weekData, setWeekData] = useState(false);
  
//   function getData() {
//       const yearNum = moment().weekYear();
//       const weekNum = moment().week();
//       const userID = user._id;
//       Meteor.call('fetchWeekTideActivity', yearNum, weekNum, false, userID,
//       (err, rtn)=>{
//   	    err && console.log(err);
//   	    const cronoTimes = rtn.sort((x1, x2)=>
//                               x1.startTime < x2.startTime ? 1 : 
//                               x1.startTime > x2.startTime ? -1 : 0 );
//         setWeekData(cronoTimes);
//   	  });
//   }
  
//   useEffect( ()=>{
//     getData();
//   }, []);
  
//   if( !readybNames || !app || !app.branches || !user || !user.roles ) {
//     return( 
//       <PlainFrame title=''>
//         <div className='centre wide'>
//           <Spin />
//         </div>
//       </PlainFrame>
//     );
//   }
    
//   const branches = app.branches.filter( b => b.open === true );
//   const brancheS = branchesSort(branches);
  
//   return(
//     <PlainFrame title={user.username || 'user error'}>
//       <div className='simpleContent'>
      
        
//           <ActivityPanel
//             key={1}
//             app={app}
//             brancheS={brancheS}
//             user={user}
//             users={users}
//             traceDT={traceDT} />
          
//           <div className='space5x5'>
//       {!equipData ?
//         <div className='centreText'>
//           <CalcSpin />
//           <p className='medBig line2x'>Fetching No {Pref.equip} responsibilities</p>
//         </div>
//       :
//       equipData.length === 0 ?
//         <div className='darkgrayT'>
//           <p className='centreText'><i className="fas fa-ghost fa-3x"></i></p>
//           <p className='medBig centreText line2x'>No {Pref.equip} responsibilities</p>
//         </div>
//       :
//       equipData.map( (eq, index)=>(
//         <div key={index} className={`bottomLine ${index > 0 ? 'vmargin' : ''}`}>
//           <h3 className='cap'>{eq.alias} {eq.equip}</h3>
//           <dl>
//             <dt>Next Service</dt>
//             {eq.serve.sort((x1, x2)=>
//                         x1.close < x2.close ? -1 : 
//                         x1.close > x2.close ? 1 : 0 )
//                       .map( (sv, ix)=>(
//               <dd key={ix} className='cap'
//               >{sv.name} - {moment(sv.close).format('dddd MMMM Do')}
//               </dd>
//             ))}
//           </dl>
//         </div>
//       ))}
//     </div>
				
//       </div>
//     </PlainFrame>
//   );
// };

// export default withTracker( ({}) => {
//   let login = Meteor.userId() ? true : false;
//   let user = login ? Meteor.user() : false;
//   let org = user ? user.org : false;
//   const isAdmin = login ? Roles.userIsInRole(Meteor.userId(), 'admin') : false;
//   const isDebug = login ? Roles.userIsInRole(Meteor.userId(), 'debug') : false;
//   const bNameSub = login ? Meteor.subscribe('bNameData') : false;
//   if(!login) {
//     return {
//       readybNames: false
//     };
//   }else{
//     return {
//       readybNames: bNameSub.ready(),
//       user: user,
//       isAdmin: isAdmin,
//       isDebug: isDebug,
//       app: AppDB.findOne({org: org}),
//       traceDT: TraceDB.find({}).fetch(),
//       users: Meteor.users.find({}, {sort: {username:1}}).fetch()
//     };
//   }
// })(UserDataWrap);