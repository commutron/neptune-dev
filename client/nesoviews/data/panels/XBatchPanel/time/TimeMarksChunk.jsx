// import React from 'react';
// import moment from 'moment';
// import 'moment-business-time';

// const TimeMarksChunk = ({ batchData, seriesData, floorRelease })=> {
  
//   const toDay = (t, o=0)=> moment(t).addWorkingTime(Math.round(o), 'days').format('dddd MMMM Do YYYY');
  
//   const flrRel = floorRelease ? floorRelease.time : false;
  
//   const tide = batchData.tide || [];
//   const stTide = tide.length > 0 ? tide[0].startTime : false;
  
//   const fitems = seriesData ? seriesData.items.filter( i => i.completed ) : [];
//   const itemS = fitems.sort( (i1, i2)=>
//     i1.completedAt < i2.completedAt ? -1 : i1.completedAt > i2.completedAt ? 1 : 0 );
//   const fin = itemS.length > 0 ? itemS[0].completedAt : false; 
  
//   const comp = batchData.completed ? batchData.completedAt : false;
  
//   return(
//     <div className='cardSelf dropCeiling'>
//       <p className='medBig bold'>Benchmarks</p>
        
//       <n-timeline>
//         {!batchData.completed || flrRel ?
//           <n-timeline-item>
//             <n-timeline-info>
//               {flrRel ? toDay(flrRel) : <em>pending</em>}
//             </n-timeline-info>
//             <n-timeline-marker class={flrRel ? 'done' : ''} />
//             <n-timeline-title>Release</n-timeline-title>
//           </n-timeline-item>
//         : null}
        
//         {batchData.completed && tide.length === 0 ? null :
//           <n-timeline-item>
//             <n-timeline-info>
//               {stTide ? toDay(stTide) : <em>pending</em>}
//             </n-timeline-info>
//             <n-timeline-marker class={stTide ? 'done' : ''} />
//             <n-timeline-title>Production Start</n-timeline-title>
//           </n-timeline-item>
//         }
        
//         {seriesData &&
//           <n-timeline-item>
//             <n-timeline-info>
//               {fin ? toDay(fin) : <em>pending</em>}
//             </n-timeline-info>
//             <n-timeline-marker class={fin ? 'done' : ''} />
//             <n-timeline-title>First Finished Item</n-timeline-title>
//           </n-timeline-item>
//         }
        
//         <n-timeline-item>
//           <n-timeline-info>
//             {comp ? toDay(comp) : <em>pending</em>}
//           </n-timeline-info>
//           <n-timeline-marker class={comp ? 'done' : ''} />
//           <n-timeline-title>All Completed</n-timeline-title>
//         </n-timeline-item>
//       </n-timeline>
//     </div>
//   );
// };

// export default TimeMarksChunk;