// import React from 'react';
// import Pref from '/client/global/pref.js';

// import { 
//   TotalNonCon,
//   HasNonCon, 
//   NonConPer, 
//   IsResNonCon, 
//   IsSkipNonCon, 
//   LeftFxNonCon, 
//   ReadyInNonCon, 
//   LeftInNonCon
// } from '/client/components/bigUi/NonConMiniTops';
// import { 
//   TotalShortfall,
//   HasShortfall,
//   RefCount,
//   PartsShort,
//   ShortDec, ShortPass, ShortWait, ShortRes
// } from '/client/components/bigUi/ShortfallMiniTops';

// const ProblemTab = ({
//   seriesData
// })=>	{
  
//   const srsItems = seriesData.items || [];
//   const srsNonCon = seriesData.nonCon || [];
//   const srsShorts = seriesData.shortfall || [];
	
//   const nonConArray = srsNonCon || [];
//   const nonConArrayClean = nonConArray.filter( x => !x.trash );
  
//   return(
//     <div className='space'>
//       <div className='balance gapsC'>
//         <div className='vmarginhalf centreSelf centreText'>
//           <p className='small cap'>{Pref.nonCons}</p>
//           {seriesData ?
//             <div className='gapsC balance'>
//               <span>
//                 <TotalNonCon noncons={nonConArrayClean} />
//                 <HasNonCon noncons={nonConArrayClean} items={srsItems} />
//                 <NonConPer noncons={nonConArrayClean} items={srsItems} />
//               </span>  
//               <span>  
//                 <IsSkipNonCon noncons={nonConArrayClean} />
//                 <LeftFxNonCon noncons={nonConArrayClean} />
//                 <ReadyInNonCon noncons={nonConArrayClean} />
//                 <LeftInNonCon noncons={nonConArrayClean} />
//                 <IsResNonCon noncons={nonConArrayClean} />
//               </span>
              
//             </div>
//           : <h4>Not Tracking {Pref.nonCons}</h4>}
//         </div>
        
//         <div className='vmarginhalf centreText'>
//           <p className='small cap'>{Pref.shortfalls}</p>
//           {seriesData ?
//             <div className='gapsC balance'>  
//               <span>
//                 <TotalShortfall shortfalls={srsShorts} />
//                 <HasShortfall shortfalls={srsShorts} items={srsItems} />
//                 <PartsShort shortfalls={srsShorts} />
//                 <RefCount shortfalls={srsShorts} />
//               </span>
//               <span>
//                 <ShortDec shortfalls={srsShorts} />
//                 <ShortPass shortfalls={srsShorts} />
//                 <ShortWait shortfalls={srsShorts} />
//                 <ShortRes shortfalls={srsShorts} />
//               </span>
//             </div>
//           : <h4>Not Tracking {Pref.shortfalls}</h4>}
//         </div>
//       </div>
      
//     </div>
//   );
// };

// export default ProblemTab;