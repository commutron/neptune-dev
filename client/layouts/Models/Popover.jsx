import React from 'react';

// const PopoverComplex = ({ dialogId, title, icon, colorT, dark, children })=> {
  
//   const close = ()=> {
//     const dialog = document.getElementById(dialogId);
//     dialog?.close();
//   };

//   return(
//     <dialog 
//       id={dialogId}
//       className={`forceScrollStyle ${dark ? 'darkTheme' : ''}`}
//     >
//       <div className='stick split vspacehalf bottomLine medBig bold cap'>
//         <span className='beside gapR'>
//           <i className={`${icon} fa-fw fa-lg gapR ${colorT}`}></i>
//           <i className='breath'></i>
//           {title}
//         </span>
//         <button
//           className='action redSolid centreRow'
//           onClick={()=>close()}
//           title='cancel'
//         ><i className='fas fa-xmark fa-lg'></i></button>
//       </div>
//       {children}
//     </dialog>
//   );
// };

// export default PopoverComplex;

export const PopoverButton = ({ targetid, attach, text, icon })=> {
	
	return(
		<button className={`popbutton ${attach}`} data-menu='--pop-button' popovertarget={targetid}
		>{icon && <i className={icon}></i>}{text}</button>
	);
};

export const PopoverMenu = ({ targetid, attach, extraClass, children })=> {
	
	return(
		<div popover='auto' className={`popmenu ${attach} ${extraClass || ''}`} id={targetid}>
			{children}
		</div>
	);
};

export const PopoverAction = ({ text, icon, doFunc, lock })=> (
  <button 
    onClick={()=>doFunc()}
    disabled={lock}
  >{icon ? <i className={`${icon} gapR`}></i> : null}{text}</button>
);

export const MatchButton = ({ title, text, icon, doFunc, lock })=> (
	<button
    title={title}
    className='popbutton'
    onClick={()=>doFunc()}
    disabled={lock}
  >{icon ? <i className={`${icon} gapR`}></i> : null}{text}</button>
);