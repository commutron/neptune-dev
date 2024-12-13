import React, { useState } from 'react';

const ModelMedium = ({ 
  button, title,
  icon, color, noText, lgIcon, smIcon, inline,
  lock, children 
})=> {
  
  const [ show, showChange ] = useState(false);
  
  const reveal = ()=> {
    showChange( !show );
  };
    
  let iSize = smIcon ? '' : lgIcon ? 'fa-2x' : 'fa-lg';
  let iAlgn = inline ? 'middle' : '';
  
  return(
    <span>
      <button
        title={title}
        className='transparent'
        onClick={()=>reveal()}
        disabled={lock}>
        <n-model-button className={`navIcon actionIconWrap ${iAlgn}`}>
          <i className={`fas ${icon} ${iSize} fa-fw ${color}`}></i>
          {!noText && <span className={'actionIconText ' + color}>{button}</span>}
        </n-model-button>
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
                  className='action redSolid centreRow'
                  onClick={()=>reveal()}
                  title='close'
                ><i className='fas fa-times fa-lg'></i></button>
              </n-model-head>
              <n-md-model-content class='centre forceScrollStyle'>
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