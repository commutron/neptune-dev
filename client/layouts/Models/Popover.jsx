import React from 'react';

export const PopoverButton = ({ targetid, attach, text, icon })=> (
	<button 
		type='button'
		className={`popbutton ${attach}`} 
		data-menu='--pop-button' 
		popovertarget={targetid}
	>{icon && <i className={`${icon} fa-fw gapR`}></i>}{text}</button>
);

export const PopoverMenu = ({ targetid, attach, extraClass, children })=> (
	<div popover='auto' className={`popmenu ${attach} ${extraClass || ''}`} id={targetid}>
		{children}
	</div>
);

export const PopoverAction = ({ text, icon, doFunc, lock })=> (
  <button 
  	type='button'
    onClick={()=>doFunc()}
    disabled={lock}
  >{icon ? <i className={`${icon} fa-fw gapR`}></i> : null}{text}</button>
);

export const MatchButton = ({ title, text, icon, doFunc, lock })=> (
  <button
  	type='button'
    title={title}
    className='popbutton'
    onClick={()=>doFunc()}
    disabled={lock}
  >{icon ? <i className={`${icon} fa-fw gapR`}></i> : null}{text}</button>
);

export const PopContextButton = ({ targetid, extraClass, text, title, icon })=> (
	<button 
		type='button'
		title={title || null}
	  popovertarget={targetid}
	  className={`popbutton ${extraClass || ''}`} 
	  style={{anchorName: `--${targetid}`}} 
	>{icon && <i className={`${icon} fa-fw ${text ? 'gapR':''}`}></i>}{text || null}</button>
);

export const PopContextMenu = ({ targetid, extraClass, children })=> (
	<div 
	  id={targetid}
	  popover='auto' 
	  className={`popmenu ${extraClass || ''}`} 
	  style={{positionAnchor: `--${targetid}`}}
	 >{children}
	</div>
);