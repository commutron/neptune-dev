import React, { useState } from 'react';

const ModelInline = ({ title, color, border, icon, lock, children })=> {
  
  const [ sect, setSect ] = useState( false );

  return(
    <div className={'vmarginhalf inlineModel centre ' + (sect ? 'open' : '')}>
      <button
        onClick={()=>setSect(!sect)}
        className={'action wide '+ (color || 'black') + 'Solid'}
        disabled={lock}
      ><i className={icon + ' fa-fw gapR'}></i>{title}</button>
      {sect ?
        <div className={'clean spacehalf ' + border}>
          {children}
        </div>
      : null}
    </div>
  );
};

export default ModelInline;