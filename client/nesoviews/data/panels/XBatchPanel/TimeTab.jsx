// import React, { useState } from 'react';

// import TimeBudgetsChunk from './time/TimeBudgetsChunk';
// import TimeExtendChunk from './time/TimeExtendChunk';
// import TimeMarksChunk from './time/TimeMarksChunk';


// const TimeTab = ({
//   batchData, seriesData, rapidsData,
//   floorRelease,
//   isDebug, app, brancheS
// })=> {
  
//   const [ conversion, conversionSet] = useState('hours');
//   const [ plus, plusSet ] = useState(true);
  
//   const addedTimes = Array.from(rapidsData, r => r.timeBudget);
//   const addTime = addedTimes.length > 0 ? addedTimes.reduce((x,y)=> x + y) : 0;
  
//   return(
//     <div className='space3v'>
    
//       <TimeBudgetsChunk
//         tideWall={app.tideWall}
//         b={batchData}
//         addTime={addTime}
//         conversion={conversion}
//         conversionSet={conversionSet}
//         plus={plus}
//         plusSet={plusSet}
//         isDebug={isDebug}
//         brancheS={brancheS}
//       />
      
//       {conversion !== 'raw records' && rapidsData.length > 0 ?
//         <div className='autoFlex'>
//           {rapidsData.map( (rapid, rindex)=>(
//           <TimeExtendChunk
//             key={rindex}
//             b={batchData}
//             rapid={rapid}
//             conversion={conversion}
//             conversionSet={conversionSet}
//             isDebug={isDebug} 
//           />
//           ))}
//         </div>
//       : null}
      
//       <TimeMarksChunk
//         batchData={batchData}
//         seriesData={seriesData}
//         floorRelease={floorRelease}
//       />
      
//     </div>
//   );
// };

// export default TimeTab;