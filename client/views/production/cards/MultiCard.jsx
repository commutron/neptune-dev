import React from 'react';
import Pref from '/client/global/pref.js';

const MultiCard = ({  })=> {
  
  const openMutiTide = ()=> {
    const dialog = document.getElementById('multiprojdialog');
    dialog?.showModal();
  };
  
  return(
    <div className='centre pop vmargin space min200 max875 minHeight darkCard tealGlow'>
      <p className='med wide bottomLine cap centreText'>Multi {Pref.xBatch} mode</p>
      <div className='centre vmarginhalf w100' style={{flex:'auto'}}>
  	    <button
  	      title='Multiple Projects'
  	      className='tideMulti spacehalf blackblack margin5'
  	      onClick={()=>openMutiTide()}
  	    >
  	    <b>
  	      <span className='fa-stack tideIcon biggester'>
  	        <i className="fas fa-circle-notch fa-stack-2x tideIndicate"></i>
  	        <i className="fa-solid fa-layer-group fa-stack-1x" data-fa-transform="shrink-1"></i>
  	      </span>
  	    </b>
	    </button>
    </div>
   </div>
  );
};

export default MultiCard;