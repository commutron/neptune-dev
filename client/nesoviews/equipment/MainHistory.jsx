// import React, { useState, useMemo } from 'react';
// import moment from 'moment';
// import 'moment-business-time';

// import PagingSelect from '/client/components/tinyUi/PagingSelect';
// import { chunkArray } from '/client/utility/Convert';

// const MainHistory = ({ maintData, sving, isDebug })=>{
  
//   const [ pageState, pageSet ] = useState(0);
  
//   const inpieces = useMemo( ()=> chunkArray(maintData, 5), [maintData]);
  
//   isDebug && console.log(maintData);
  
//   return(
//     <div className='vmargin scrollWrap forceScrollStyle cap'>
   
//       <table className='w100'>
//         <thead>
//           <tr className='leftText'>
//             <th>Status</th>
//             <th>Open/Begin</th>
//             <th>Close/Deadline</th>
//             <th>Expire/Grace</th>
//             <th>Done</th>
        
//           </tr>
//         </thead>
//         <tbody>
//           {(inpieces[pageState] || []).map( (m, ix)=> {
//             const frmt = pageState == 0 && ix == 0 ? 'dddd MMMM Do' : 'MMMM D YYYY';
//             return(
//               <tr key={ix}>
//                 <td>{m.status || <em>{sving ? 'current' : 'next'}</em>}</td>
//                 <td>{moment(m.open).format(frmt)}</td>
//                 <td>{moment(m.close).format(frmt)}</td>
//                 <td>{moment(m.expire).format(frmt)}</td>
//                 <td>{m.doneAt && moment(m.doneAt).format(frmt)}</td>
                
//               </tr>
//           )})}
//         </tbody>
//       </table>
      
//       <PagingSelect 
//         multiArray={inpieces}
//         isSet={pageState}
//         doChange={(e)=>pageSet(e)} 
//       />
      
//     </div>
//   );
// };

// export default MainHistory;