import React from 'react';

const ModelNative = ({ dialogId, title, icon, colorT, dark, children })=> {
  
  const close = ()=> {
    const dialog = document.getElementById(dialogId);
    dialog?.close();
  };

  return(
    <dialog 
      id={dialogId}
      className={`forceScrollStyle ${dark ? 'darkTheme' : ''}`}
    >
      <div className='stick split vspacehalf bottomLine medBig bold cap'>
        <span className='beside gapR'>
          <i className={`${icon} fa-fw fa-lg gapR ${colorT}`}></i>
          <i className='breath'></i>
          {title}
        </span>
        <button
          className='action redSolid centreRow'
          onClick={()=>close()}
          title='cancel'
        ><i className='fas fa-xmark fa-lg'></i></button>
      </div>
      {children}
    </dialog>
  );
};

export default ModelNative;

export const OpenModelNative = ({ dialogId, title, icon, iconObj, colorB, colorT, lock })=> {
  
  const open = ()=> {
    const dialog = document.getElementById(dialogId);
    dialog?.showModal();
  };
  
  return(
    <button
      title={title}
      className={`action middle ${colorB}`}
      onClick={()=>open()}
      disabled={lock}>
      {iconObj || <i className={`${icon} fa-fw fa-lg gap ${colorT}`}></i>}
      <span className={colorT}>{title}</span>
    </button>
  );
};