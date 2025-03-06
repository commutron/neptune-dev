// import React from 'react';
// import Pref from '/client/global/pref.js';

// import { ProWrap, ProWindow } from '/client/layouts/ProLayout';


// import XDoProCard from './cards/XDoProCard';
// import PartialCard from './cards/PartialCard';
// import EquipCard from './cards/EquipCard';
// import ServiceCard, { RepairCard } from './cards/ServiceCard';


// const ProductionFindOps = ({ 
//   hotxBatch, hotxSeries, hotxRapids,
//   allWidget, allVariant,
//   user, time, app, canMulti,
//   activeUsers, plainBatchS, brancheS, 
//   allEquip, allMaint,
//   orb, eqS
// })=> {
  
//   function linkedWidget(wId) {
//     return allWidget.find(x => x._id === wId);
//   }
  
 
  
//   function variantDataByKey(vKey) {
//     return allVariant.find(x => x.versionKey === vKey);
//   }

//   function equipDataById() {
//     return allEquip.find(x => x._id === eqS);
//   }
  
//   function maintDataById() {
//     return allMaint.find(x => x._id === eqS);
//   }
  
//   function linkedEquip(equipId) {
//     return allEquip.find(x => x._id === equipId);
//   }
  
//   if(!orb) {
//     Session.set('nowBatch', false);
//     return (
//       <ProWindow 
//         brancheS={brancheS} 
//         plainBatchS={plainBatchS}
//         user={user}
//         canMulti={canMulti}
//         allEquip={allEquip}
//       >
//         <QuickCards
//           orbslice={orb}
//           canMulti={canMulti}
//           user={user}
//           allEquip={allEquip}
//           allMaint={allMaint}
//         />
//       </ProWindow>
//     );
//   }
  
  
 
 

// // Batch
//   if( Pref.regex5.test(orb) ) {
//     if(hotxBatch) {
//       let widget = linkedWidget(hotxBatch.widgetId);
//       let variant = variantDataByKey(hotxBatch.versionKey);
//       Session.set('nowInstruct', variant.instruct);
//       return (
// 		    <ProWrap
// 		      batchData={hotxBatch}
// 		      seriesData={hotxSeries}
// 		      widgetData={widget}
// 		      radioactive={variant.radioactive}
//           user={user}
//           time={time}
//           app={app}
//           brancheS={brancheS}
//           plainBatchS={plainBatchS} 
//           canMulti={canMulti}
//           action='xBatchBuild'
//         >
//           <XDoProCard
//             batchData={hotxBatch}
//             seriesData={hotxSeries}
//             rapidsData={hotxRapids}
//             widgetData={widget}
//             user={user}
//             brancheS={brancheS}
//             app={app} />
          
//         </ProWrap>
//       );
//     }
//   }
  


// // Equipment
//   if(orb?.startsWith('EqFx')) {
//     const eqData = equipDataById();
//     if(eqData) {
//       Session.set('nowBatch', false);
//       Session.set('nowInstruct', eqData?.library);
//       return (
//         <ProWrap
//           batchData={false}
//           itemData={false}
//           user={user}
//           time={time}
//           users={activeUsers}
//           app={app}
//           brancheS={brancheS}
//           plainBatchS={plainBatchS} 
//           canMulti={canMulti}
//           defaultWide={true}
//           eqAlias={eqData.alias}
//           equipId={eqData._id}
//         >
//           <RepairCard
//             eqData={eqData}
//             brancheS={brancheS}
//           />
          
//         </ProWrap>
//       );
//     }
//   }
// // Maintain
//   if(orb?.startsWith('Eq')) {
//     const maintData = maintDataById();
//     if(maintData) {
//       const eqData = linkedEquip(maintData.equipId);
//       Session.set('nowBatch', false);
//       Session.set('nowInstruct', eqData?.instruct);
//       return (
//         <ProWrap
//           batchData={false}
//           itemData={false}
//           user={user}
//           time={time}
//           users={activeUsers}
//           app={app}
//           brancheS={brancheS}
//           plainBatchS={plainBatchS} 
//           canMulti={canMulti}
//           defaultWide={true}
//           eqAlias={eqData.alias}
//           maintId={maintData._id}
//         >
//           <ServiceCard
//             eqData={eqData}
//             maintData={maintData}
//             brancheS={brancheS}
//           />
          
//         </ProWrap>
//       );
//     }
//   }

  
//   if(!isNaN(orb) && orb.length >= 5) {
//     Session.set('nowBatch', orb);
//     return(
//       <ProWindow 
//         brancheS={brancheS} 
//         plainBatchS={plainBatchS} 
//         user={user}
//         canMulti={canMulti}
//         allEquip={allEquip}
//       >
//         <QuickCards
//           orbslice={orb}
//           canMulti={canMulti}
//           user={user}
//           allEquip={allEquip}
//           allMaint={allMaint}
//         />
//       </ProWindow>
//     );
//   }
  
//   Session.set('nowBatch', false);
// 	return(
// 	  <ProWindow 
// 	    brancheS={brancheS} 
// 	    plainBatchS={plainBatchS}
// 	    allEquip={allEquip}
// 	    user={user}
// 	    canMulti={canMulti}
// 	   >
// 	    <div className='centreText wide'>
//         <i className='biggest'>¯\_(ツ)_/¯</i><br />
//         <n-sm>No Match</n-sm>
//       </div>
//       <QuickCards
//         orbslice={orb}
//         canMulti={canMulti}
//         user={user}
//         allEquip={allEquip}
//         allMaint={allMaint}
//       />
//     </ProWindow>
//   );
// };

// export default ProductionFindOps;

// const QuickCards = ({ orbslice, user, allEquip, allMaint })=> {
  
//   const tpl = user.tidepools || [];
//   const rec = [...new Set(tpl)].filter( r => Pref.regex5.test(r));
  
//   return(
//   <div className='scrollWrap forceScrollStyle' style={{height: '100%', minHeight: '100%'}}>
//     {orbslice && <PartialCard orb={orbslice} /> }
//     <div className='balancer gapsR gapsC wide space'>
      
      
//     <div className='centre pop vmargin space min200 max250 blueGlow'>
//       <p className='med wide bottomLine cap'>Recent {Pref.xBatchs}</p>
//       <div className='rowWrap vmarginhalf'>
//       {rec.length > 0 ?
//         rec.map( (val, ix)=>(
//           <button 
//             key={ix}
//             className='action whiteSolid margin5 letterSpaced spacehalf'
//             onClick={()=>Session.set('now', val)}
//           >{val}</button>
//         ))
//       : <p className='centreText'>No Recent Found</p>
//       }
//     </div>
//   </div>
   
//       <EquipCard equipData={allEquip} maintainData={allMaint} />
//     </div>
//   </div>
// );
// };