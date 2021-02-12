import React, { useState } from 'react';
import { MenuItem } from 'react-contextmenu';

const ModelLarge = ({ 
  title, button, menuItem,
  icon, color, noText, lgIcon,
  lock, children
})=>	{
  
  const [ show, showChange ] = useState(false);
  
  const reveal = ()=> {
    showChange( !show );
  };
  
  let iSize = lgIcon ? ' fa-2x ' : ' fa-lg ';
  
  return (
    <span>
      {menuItem ?
        <MenuItem 
          title={title}
          // className='transparent'
          onClick={()=>reveal()} 
          disabled={lock}
          preventClose={true}>
          <label className='navIcon actionIconWrap'>
            <i className={`fas ' ${icon} ${iSize} fa-fw ${color}`}></i>
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
            <i className={`fas ' ${icon} ${iSize} fa-fw ${color}`}></i>
            {!noText && <span className={'actionIconText ' + color}>{button}</span>}
          </label>
        </button>
      }
    
    {show &&
      <span>
        <div className='overlay invert' key={1}>
          <div className='popup'>
            <div className='popupHead'>
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
            <div className='popupContent'>
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

export default ModelLarge;