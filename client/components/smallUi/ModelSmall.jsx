import React, { useState } from 'react';
import { MenuItem } from 'react-contextmenu';


const ModelSmall = ({ 
  button, title, menuItem,
  icon, color, noText, inLine, lgIcon, 
  lock, children 
})=> {
  
  const [ show, showChange ] = useState(false);
  
  const reveal = ()=> {
    showChange( !show );
  };
    
  let iSize = lgIcon ? ' fa-2x ' : ' fa-lg ';
  
  return(
    <span>
      {menuItem ?
        <MenuItem 
          title={title}
          // className='transparent'
          onClick={()=>reveal()} 
          disabled={lock}
          preventClose={true}>
          <label className='navIcon actionIconWrap'>
            <i className={`fas ${icon} ${iSize} fa-fw ${color}`}></i>
            <i className={`medBig ${color}`}>{button}</i>
          </label>
        </MenuItem>
      :
        <button
          title={title}
          className='transparent'
          onClick={()=>reveal()}
          disabled={lock}>
          <label className={`navIcon actionIconWrap ${inLine ? 'middle' : ''}`}>
            <i className={`fas ${icon} ${iSize} fa-fw ${color}`}></i>
            {!noText && <span className={'actionIconText ' + color}>{button}</span>}
          </label>
        </button>
      }
      
      {show &&
        <span>
          <div className='overlay invert' key={1}>
            <n-sm-model>
              <n-sm-model-head>
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
              </n-sm-model-head>
              <n-sm-model-content className='centre'>
                {React.cloneElement(children,
                  { 
                    selfclose: ()=>reveal()
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