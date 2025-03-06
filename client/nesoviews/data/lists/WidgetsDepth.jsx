// import React, { useState, useEffect } from 'react';
// import Pref from '/client/global/pref.js';
// import LeapLine from '/client/components/tinyUi/LeapLine';
// import NumStat from '/client/components/tinyUi/NumStat';

// const WidgetsDepth = ({ filterString, widgetData, active })=> {
  
//   const w = widgetData.sort((w1, w2)=>
//               w1.widget < w2.widget ? -1  : w1.widget > w2.widget ? 1 : 0 );
  
//   let showList = w.filter( 
//     tx => tx.widget.toLowerCase().includes(filterString) === true ||
//           tx.describe.toLowerCase().includes(filterString) === true);

//   return(
//     <div className='wide vspacehalf max1000'>
//       {w.length < 1 ? 
//         <p className='centreText'>no {Pref.widget}s created</p>
//       :
//         showList.length < 1 ? 
//           <p className='centreText'>no match found</p>
//       :
//         showList.map( (entry)=> {
//         let ac = active.includes(entry._id) ? 'activeMark' : '';
//           return(
//             <WidgetIndexCard 
//               key={entry._id} 
//               data={entry} 
//               barStyle={ac}
//             />
//         )})}
//     </div>
//   ); 
// };

// export default WidgetsDepth;

// const WidgetIndexCard = ({ data, barStyle })=>{
  
//   const [ moreData, moreSet ] = useState(false);
  
//   useEffect( ()=> {
//     Meteor.call('widgetTops', data._id, (err, reply)=>{
//       err && console.log(err);
//       !reply ? null : moreSet( reply );
//     });
//   }, []);
  
//   if(!moreData) {
//     return null;
//   }
    
//   let totalBatches = moreData[1].length;
//   let totalItems = moreData[1].reduce((x,y)=>x+y, 0); 
    
//   return(
//     <LeapLine
//       title={data.widget.toUpperCase()}
//       cTwo={data.describe}
//       cThree={
//         <span className='balancer'>
//           <NumStat
//             num={moreData[0]}
//             name={Pref.variants}
//             title={`Total ${Pref.variants}`}
//             color='blueT'
//             size='medBig'
//             moreClass='gapR' />
//           <NumStat
//             num={totalBatches}
//             name={Pref.xBatchs}
//             title={`Total ${Pref.xBatchs}`}
//             color='blueT'
//             size='medBig'
//             moreClass='gapR' />
//           <NumStat
//             num={totalItems}
//             name='Total Quantity'
//             title={`Total quantities of all ${Pref.xBatchs}`}
//             color='blueT'
//             size='medBig'
//             moreClass='gapR' />
//           <NumStat
//             num={moreData[2]}
//             name='NC Rate'
//             title={`Average ${Pref.nonCon} rate`}
//             color='redT'
//             size='medBig'
//             moreClass='gapR' />
//         </span>
//       }
//       sty={barStyle}
//       address={'/data/widget?request=' + data._id}
//     />
//   );
// };