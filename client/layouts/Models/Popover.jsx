import React from 'react';

export const PopoverButton = ({ targetid, attach, text, icon })=> (
	<button className={`popbutton ${attach}`} data-menu='--pop-button' popovertarget={targetid}
	>{icon && <i className={icon}></i>}{text}</button>
);

export const PopoverMenu = ({ targetid, attach, extraClass, children })=> (
	<div popover='auto' className={`popmenu ${attach} ${extraClass || ''}`} id={targetid}>
		{children}
	</div>
);

export const PopoverAction = ({ text, icon, doFunc, lock })=> (
  <button 
    onClick={()=>doFunc()}
    disabled={lock}
  >{icon ? <i className={`${icon} fa-fw gap`}></i> : null}{text}</button>
);

export const MatchButton = ({ title, text, icon, doFunc, lock })=> (
  <button
    title={title}
    className='popbutton'
    onClick={()=>doFunc()}
    disabled={lock}
  >{icon ? <i className={`${icon} fa-fw gap`}></i> : null}{text}</button>
);