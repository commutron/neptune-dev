// import React from 'react';
// import moment from 'moment';
// import 'moment-business-time';
// import Pref from '/client/global/pref.js';

// import TabsVert from '/client/components/smallUi/Tabs/TabsVert';

// import MainHistory from './MainHistory';

// const ServiceSlides = ({ 
//   equipData, maintainData, nowD, weekday, monthday, month,
//   isDebug
// })=> {
  
//   const eq = equipData;
  
//   const svNames = eq.service.map((sv)=>sv.name);
  
//   return(
//     <TabsVert 
//       tabs={svNames} 
//       extraClass='popSm vmargin overscroll'
//       contentClass='spacehalf'>
//       {eq.service.map( (sv)=>{
//           const maint = maintainData.filter( m => m.serveKey === sv.serveKey )
//                                     .sort((x1, x2)=> x1.close < x2.close ? 1 : 
//                                                     x1.close > x2.close ? -1 : 0
//                         );
//           const sving = maint.find( m => nowD > m.open && nowD < m.expire );
         
//           return(
//           <div key={sv.serveKey} className='w100'>
//             <div className='comfort'>
          
//               <div className='big cap gap beside'>{sv.name}</div>
          
//             </div>
            
            
//               <div className='comfort'>
//                 <div className='margin5 rowWrap gapsC'>
//                   <span className='startSelf'>
//                     <p>Last Modified: <n-num>{moment(sv.updatedAt).format('MMMM Do, YYYY. h:mm a')}</n-num></p>
//                     <p className='cap'>Frequency: <n-num>{sv.recur} {sv.timeSpan}{sv.recur > 1 ? 's' : ''}</n-num></p>
//                     <p className='cap'>Due/Cycle Day: <n-num>{
//                       sv.timeSpan === 'year' ? month[sv.whenOf] : 
//                       sv.timeSpan === 'month' ? monthday[sv.whenOf] : 
//                       weekday[sv.whenOf]
//                     } of {sv.timeSpan}</n-num></p>
//                     <p>Workdays To Complete: <n-num>{sv.period}</n-num></p>
//                     <p>Workdays Late Grace: <n-num>{sv.grace}</n-num></p>
//                   </span>
                  
//                   <dl className='startSelf overscroll max400'>
//                     <dt className='vmarginquarter'>Checklist:</dt>
//                     {sv.tasks.map( (entry, index)=>( 
//                       <dd key={index} className='line15x cap'>☑ {entry}</dd>
//                     ))}
//                   </dl>
//                 </div>
                
                
//               </div>
            
//               <MainHistory maintData={maint} sving={sving} isDebug={isDebug} />
//           </div>
//         )})}
        
//     </TabsVert>
//   );
// };

// export default ServiceSlides;