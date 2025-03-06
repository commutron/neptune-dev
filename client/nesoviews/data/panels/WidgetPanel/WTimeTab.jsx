// import React, { useRef, useState, useEffect } from 'react';
// import Pref from '/client/global/pref.js';

// import { round1Decimal } from '/client/utility/Convert';

// const WTimeTab = ({ widgetData })=> {
  
//   const mounted = useRef(true);
  
//   useEffect(() => {
//     return () => { mounted.current = false; };
//   }, []);
  
//   const [ result, resultSet ] = useState(false);
  
//   useEffect( ()=>{
//     Meteor.call('oneWidgetTurnAround', widgetData._id, (err, reply)=>{
//       err && console.log(err);
//       reply && mounted.current ? 
//         resultSet(reply) : null;
//     });
//   }, []);
  
//   return(
//     <div className='space' key={widgetData._id+'times'}>
//       <div className='cardSelf vmargin'> 
//         <table className='wide'><thead>
//           <tr className='cap'>
//             <th>Sales Start → {Pref.kitting} Release</th>
//             <th>Sales Start → Production Start</th>
//             <th>Sales Start → First Finished Item*</th>
//             <th>Sales Start → Complete</th>
//           </tr>
//         </thead><tbody>
//           <tr className='centreText'>
//             <td>{ result['relAvg'] ? round1Decimal(result['relAvg']) : '-'} days</td>
//             <td>{ result['stAvg'] ? round1Decimal(result['stAvg']) : '-'} days</td>
//             <td>{ result['ffinAvg'] ? round1Decimal(result['ffinAvg']) : '-'} days</td>
//             <td>{ result['compAvg'] ? round1Decimal(result['compAvg']) : '-'} days</td>
//           </tr>
//         </tbody></table>
        
//       </div>
      
//     </div>
//   );
// };

// export default WTimeTab;