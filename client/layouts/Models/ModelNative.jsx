import React from 'react';

const ModelNative = ({ dialogId, title, icon, colorT, dark, closeFunc, children })=> {
  
  const close = ()=> {
    closeFunc ? closeFunc() : null;
    document.getElementById(dialogId)?.close();
  };

  return(
    <dialog 
      id={dialogId}
      className={`forceScrollStyle ${dark ? 'darkTheme' : ''}`}
    >
      <div className='stick split bottomLine medBig bold cap'>
        <span className='beside gapR'>
          <i className={`${icon} fa-fw fa-lg gapR ${colorT}`}></i>
          {title}
        </span>
        <button
          className='action redSolid centreRow'
          onClick={()=>close()}
          title='cancel'
        ><i className='fa-solid fa-xmark fa-lg'></i></button>
      </div>
      {children}
    </dialog>
  );
};

export default ModelNative;

export const OpenModelNative = ({ dialogId, title, icon, iconObj, colorB, colorT, lock })=> {
  
  const open = ()=> {
    document.getElementById(dialogId)?.showModal();
  };
  
  return(
    <button
      title={title}
      className={`action beside ${colorB}`}
      onClick={()=>open()}
      disabled={lock}>
      {iconObj || <i className={`${icon} fa-fw fa-lg gap ${colorT}`}></i>}
      <span className={colorT}>{title}</span>
    </button>
  );
};