import React, { useState } from 'react';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';
//import Pref from '/client/global/pref.js';

// requires
//button
//title
//color // css class
//lock
//children

const Model = (props)=>	{
  
  const [ show, showChange ] = useState(false);
  
  const reveal = ()=> {
    showChange( !show );
  };
  
  const noText = props.noText;
  let iSize = props.primeTopRight ? ' fa-2x ' :
              props.smIcon ? ' fa-1x ' : ' fa-lg ';
  
  return (
    <span>
      <button
        title={props.title}
        className='transparent'
        onClick={()=>reveal()}
        disabled={props.lock}>
        <label className='navIcon actionIconWrap'>
          <i className={'fas ' + props.icon + iSize + props.color}></i>
          {!noText && <span className={'actionIconText ' + props.color}>{props.button}</span>}
        </label>
      </button>
    
    {show &&
      <AnimateWrap type='modelTrans' el='span'>
        <div className='overlay invert' key={1}>
          <div className='popup'>
            <div className='popupHead'>
              <span>
                <i className={'fas ' + props.icon + ' fa-lg ' + props.color}></i>
                <i className='breath'></i>
                {props.title}
              </span>
              <button
                className='action clearRed rAlign'
                onClick={()=>reveal()}
                title='close'
              ><i className='fas fa-times fa-lg'></i></button>
            </div>
            <div className='popupContent'>
              {props.children}
            </div>
          </div>
        </div>
      </AnimateWrap>
    }
    </span>
  );
};

export default Model;