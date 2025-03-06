// import React, { useMemo, useState } from 'react';
// import Pref from '/client/global/pref.js';
// import WidgetsDepth from '../../lists/WidgetsDepth';
// import TagsModule from '/client/components/bigUi/TagsModule';

// import GroupTops from '/client/components/charts/GroupTops';
// import DumbFilter from '/client/components/tinyUi/DumbFilter';

// function groupActiveWidgets(widgetsList, allXBatch) {
  
//   let activeBatch = allXBatch.filter( b => b.completed === false);

//   const hasBatch = (id)=> activeBatch.find( b => b.widgetId === id) ? true : false;
  
//   let activeWidgets = widgetsList.filter( w => hasBatch(w._id) == true );
  
//   const activeList = Array.from(activeWidgets, w => w._id);
//   return activeList;
// }

// const GroupSlide = ({ 
//   groupData, widgetsList, batchDataX, app, 
//   canRun, canEdt
// })=>{
  
//   const [ filterString, filterStringSet ] = useState( '' );
  
//   const g = groupData;
//   const active = useMemo(()=>groupActiveWidgets(widgetsList, batchDataX), [widgetsList, batchDataX]);
//   const shrtI = g.wiki && !g.wiki.includes('http');
  

//   const mockTag = {
//     padding: '3px 7px 3px 5px',
//     borderRadius: '1px 25px 25px 1px',
//     backgroundColor: 'var(--nephritis)',
//     fontSize: '0.9rem',
//     color: 'white'
//   };
  
//   return(
//     <div className='section overscroll' key={g.alias}>
          
//       <h1 className='cap bigger centreText bottomLine'>{g.group}</h1>

     
//         <div>
//           <DumbFilter
//             id='groupwidgettextfilter'
//             inputClass='miniIn24 smTxt'
//             styleOv={{minHeight:'0',height:'calc(var(--sm9)* 1.75)'}}
//             onTxtChange={(e)=>filterStringSet(e)}
//           />
//         </div>
    
        
//       <div className='wide comfort'>
      
//         {g.internal &&
//           <div className='centreText comfort middle w100 vmargin intrBlueSq cap'>
//             <i className='fas fa-home fa-fw fa-2x nT gapL'></i>
//             <span>
//               <h3>Internal {Pref.group}</h3>
//               <p>For in-house use, one-off projects, prototypes, or training.</p>
//             </span>
//             <i className='fas fa-globe-americas fa-fw fa-2x nT gapR'></i>
//           </div>}
          
//         {g.hibernate &&
//           <div className='centreText comfort middle w100 vmargin wetasphaltBorder cap'>
//             <i className='fas fa-archive fa-fw fa-2x wetasphaltT gapL'></i>
//             <h3>{Pref.hibernatated} {Pref.group}</h3>
//             <i className='fas fa-archive fa-fw fa-2x wetasphaltT gapR'></i>
//           </div>}
        
//         <div className='centreRow'>
//           <TagsModule
//             action='group'
//             id={g._id}
//             tags={g.tags}
//             tagOps={app.tagOption}
//             canRun={canRun || canEdt} 
//           />
//         </div>
        
//       </div>
      
//       {groupData.emailOptIn &&
//         <p className='w100 indenText'>
//         <span style={mockTag}>
//           <i className="fa-solid fa-envelope-circle-check fa-lg gapR"></i>Automated Emails Enabled
//         </span>
//         </p>
//       }
      
//       <p className='w100 capFL indenText wordBr'>
//         {Pref.instruct} Index: {shrtI ? app.instruct : null
//         }<a className='clean wordBr' href={shrtI ? app.instruct + g.wiki : g.wiki} target='_blank'>{g.wiki}</a>
//       </p>
      
//       <GroupTops groupId={g._id} alias={g.alias} />
        
//       <WidgetsDepth
//         filterString={filterString}
//         groupAlias={g.alias}
//         widgetData={widgetsList}
//         active={active} />
      
//     </div>
//   );
// };

// export default GroupSlide;