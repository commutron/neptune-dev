import React, { useState } from 'react';

const ModelMedium = ({ 
  button, title,
  icon, color, noText, lgIcon, smIcon,
  lock, children 
})=> {
  
  const [ show, showChange ] = useState(false);
  
  const reveal = ()=> {
    showChange( !show );
  };
    
  let iSize = smIcon ? '' : lgIcon ? 'fa-2x' : 'fa-lg';
  
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
            <n-md-model>
              <n-model-head>
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
              </n-model-head>
              <n-md-model-content className='centre forceScrollStyle'>
                {React.cloneElement(children,
                  { 
                    selfclose: ()=>reveal()
                  }
                )}
              </n-md-model-content>
            </n-md-model>
          </div>
        </span>
      }
    </span>
  );
};

export default ModelMedium;