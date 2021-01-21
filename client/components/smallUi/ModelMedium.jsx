import React, { useState, Fragment } from 'react';
import { MenuItem } from 'react-contextmenu';

const ModelMedium = ({ 
  button, title, menuItem,
  icon, color, noText, lgIcon,
  lock, children 
})=> {
  
  const [ show, showChange ] = useState(false);
  
  const reveal = ()=> {
    showChange( !show );
  };
    
  let iSize = lgIcon ? ' fa-2x ' : ' fa-lg ';
  
  return(
    <Fragment>
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
          <label className='navIcon actionIconWrap'>
            <i className={`fas ${icon} ${iSize} fa-fw ${color}`}></i>
            {!noText && <span className={'actionIconText ' + color}>{button}</span>}
          </label>
        </button>
      }
      
      {show &&
        <span>
          <div className='overlay invert' key={1}>
            <n-md-model>
              <n-md-model-head>
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
              </n-md-model-head>
              <n-md-model-content className='centre'>
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
    </Fragment>
  );
};

export default ModelMedium;