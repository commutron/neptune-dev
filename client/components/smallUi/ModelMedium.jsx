import React, { useState } from 'react';
//import Pref from '/client/global/pref.js';

const ModelMedium = ({ 
  button, title, 
  icon, color, noText, smIcon, 
  lock, children 
})=> {
  
  const [ show, showChange ] = useState(false);
  
  const reveal = ()=> {
    showChange( !show );
  };
    
  let iSize = smIcon ? ' fa-1x ' : ' fa-lg ';
  
  return (
    <span>
      <button
        title={title}
        className='transparent'
        onClick={()=>reveal()}
        disabled={lock}>
        <label className='navIcon actionIconWrap'>
          <i className={'fas ' + icon + iSize + color}></i>
          {!noText && <span className={'actionIconText ' + color}>{button}</span>}
        </label>
      </button>
      
    {show &&
      <span>
        <div className='overlay invert' key={1}>
          <div className='medModel'>
            <div className='medModelHead'>
              <span>
                <i className={'fas ' + icon + ' fa-lg ' + color}></i>
                <i className='breath'></i>
                {title}
              </span>
              <button
                className='action clearRed rAlign'
                onClick={()=>reveal()}
                title='close'
              ><i className='fas fa-times fa-lg'></i></button>
            </div>
            <div className='medModelContent centre'>
              {React.cloneElement(children,
                { 
                  selfclose: ()=>reveal()
                }
              )}
            </div>
          </div>
        </div>
      </span>
      }
    </span>
  );
};

export default ModelMedium;