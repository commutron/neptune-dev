import React from 'react';

const ModelNative = ({ dialogId, title, icon, colorT, children })=> {
  
  const close = ()=> {
    const dialog = document.getElementById(dialogId);
    dialog?.close();
  };

  return(
    <dialog 
      id={dialogId}
      className='forceScrollStyle'
    >
      <div className='split vmarginhalf bottomLine medBig bold'>
        <span className='beside'>
          <i className={`${icon} fa-fw fa-lg gapR ${colorT}`}></i>
          <i className='breath'></i>
          {title}
        </span>
        <button
          className='action redSolid'
          onClick={()=>close()}
          title='cancel'
        ><i className='fas fa-times fa-lg'></i></button>
      </div>
      {children}
    </dialog>
  );
};

export default ModelNative;

export const OpenModelNative = ({ dialogId, title, icon, colorB, colorT, lock })=> {
  
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
      <i className={`${icon} fa-fw fa-lg gap ${colorT}`}></i>
      <span className={colorT}>{title}</span>
    </button>
  );
};