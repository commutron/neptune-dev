import React, { useRef, useState, useEffect } from 'react';


const ModelSmall = ({ 
  button, title, cleanIcon, wrapIcon,
  icon, color, textcolor, 
  noText, inLine, lgIcon, overrideStyle,
  lock, children 
})=> {
  
  const mounted = useRef(true);
  
  const [ show, showChange ] = useState(false);
  
  useEffect(() => {
    return () => { mounted.current = false; };
  }, []);
  
  const reveal = ()=> {
    showChange( !show );
  };
    
  let iSize = lgIcon ? ' fa-2x ' : ' fa-lg ';
  
  return(
    <span style={overrideStyle}>
      {cleanIcon ?
        <button
          title={title}
          onClick={()=>reveal()}
          disabled={lock}>
          <label>
            <n-fa1><i className={`${icon} fa-fw ${color}`}></i></n-fa1>
            {!noText && <span className={textcolor || 'blackT'}>{button}</span>}
          </label>
        </button>
      :
        <button
          title={title}
          className='transparent'
          onClick={()=>reveal()}
          disabled={lock}>
          <label className={`navIcon actionIconWrap ${inLine ? 'middle' : ''}`}>
            {wrapIcon ?
              <n-fa1><i className={`fas ${icon} ${iSize} fa-fw ${color}`}></i></n-fa1>
            : <n-fa0><i className={`fas ${icon} ${iSize} fa-fw ${color}`}></i></n-fa0>}
            {!noText && <span className={`actionIconText ${textcolor || color}`}>{button}</span>}
          </label>
        </button>
      }
      
      {show &&
        <span>
          <div className='overlay invert' key={1}>
            <n-sm-model>
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
              <n-sm-model-content class='centre forceScrollStyle'>
                {React.cloneElement(children,
                  { 
                    selfclose: ()=>mounted.current ? reveal() : null
                  }
                )}
              </n-sm-model-content>
            </n-sm-model>
          </div>
        </span>
      }
    </span>
  );
};

export default ModelSmall;