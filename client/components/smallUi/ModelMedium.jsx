import React, { useState } from 'react';
//import Pref from '/client/global/pref.js';

const ModelMedium = ({ 
  button, title, 
  icon, color, noText, lgIcon, 
  lock, children 
})=> {
  
  const [ show, showChange ] = useState(false);
  
  const reveal = ()=> {
    showChange( !show );
  };
    
  let iSize = lgIcon ? ' fa-2x ' : ' fa-lg ';
  
  return(
    <span>
      <button
        title={title}
        className='transparent'
        onClick={()=>reveal()}
        disabled={lock}>
        <label className='navIcon actionIconWrap'>
          <i className={`fas ${icon} ${iSize} fa-fw ${color}`}></i>
          {!noText && <span className={'actionIconText ' + color}>{button}</span>}
        </label>
      </button>
      
    {show &&
      <span>
        <div className='overlay invert' key={1}>
          <div className='medModel'>
            <div className='medModelHead'>
              <span>
                <i className={`fas ${icon} ${color}`}></i>
                <i className='breath'></i>
                {title}
              </span>
              <button
                className='closeAction clearRed'
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