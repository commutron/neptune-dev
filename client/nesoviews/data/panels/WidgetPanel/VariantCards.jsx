// import React from 'react';
// import moment from 'moment';
// import Pref from '/client/global/pref.js';

// import TagsModule from '/client/components/bigUi/TagsModule';
// import NotesModule from '/client/components/bigUi/NotesModule';

// const VariantCards = ({ 
//   variantData,
//   app, canRun 
// })=> {
  
  
//   const varS = variantData.sort((v1, v2)=> v1.createdAt > v2.createdAt ? -1 : v1.createdAt < v2.createdAt ? 1 : 0 );
  
//   return(
//     <div className='rowWrap cardify'>
//       {varS.map( (ventry, index)=> {
//         return(  
//           <VentryCard
//             key={ventry._id+index}
//             ventry={ventry}
//             app={app}
//             canRun={canRun}
//           />
//       )})}
//     </div>
//   );
// };
      
// export default VariantCards;  
        
// const VentryCard = ({ 
//   ventry, app, canRun
// })=> {
  
//   const v = ventry;
  
//   const calString = "ddd, MMM D /YY, h:mm A";
//   const calFunc = (d)=> moment(d).calendar(null, {sameElse: calString});
  
//   const shrtI = variantData.instruct && !variantData.instruct.includes('http');
//   const rootURL = app.instruct;
  
//   return(
//     <div className='startSelf space' style={{width: 'clamp(250px, 25vw, 350px)'}}>
//       <div className='split gapsC'>
//         <h2 className='cap wordBr'><strong>{v.variant}</strong></h2>
        
//         <div className='centreText rowWrapR gapsC'>
//           {v.radioactive ? 
//             <n-faX><i className='fa-solid fa-burst fa-fw darkOrangeT'></i>{Pref.radio.toUpperCase()}: {v.radioactive}</n-faX>
//             : null
//           }
        
//           {v.live ? 
//             <n-fa0><i className='fas fa-folder-open blueT fa-fw'></i>Open</n-fa0>
//             :
//             <n-fa1><i className='fas fa-folder grayT fa-fw'></i>Closed</n-fa1>
//           }
//         </div>
//       </div>
          
      
      
//       <div className='vmarginhalf'>
        
//         <span className='min200'>   
          
//           <TagsModule
//             key={v.id+v.versionKey}
//             action='variant'
//             id={v._id}
//             tags={v.tags}
//             vKey={v.versionKey}
//             tagOps={app.tagOption}
//             rad={v.radioactive}
//             canRun={canRun}
//           />
          
//           <div className='readlines'>
//             <p className='numFont'>default units: {variantData.runUnits}</p>
//             <p className='max750 wordBr'>
//               {shrtI ? rootURL : null}
//               <a 
//                 className='clean wordBr' 
//                 href={shrtI ? rootURL + variantData.instruct : variantData.instruct} 
//                 target='_blank'
//               >{variantData.instruct}</a>
//             </p>
//           </div>
        
//           <NotesModule
//             sourceId={v._id}
//             noteObj={v.notes}
//             editMethod='setVariantNote'
//             cal={calFunc}
//             lines={10}
//           />
        
//         </span>
//       </div>
//     </div>
//   );
// };