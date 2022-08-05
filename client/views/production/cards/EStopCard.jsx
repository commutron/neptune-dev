import React from 'react';
import Pref from '/client/global/pref.js';

const EStopCard = ({  })=> {
  
  const openFixTime = ()=> {
    // const dialog = document.getElementById('multiprojdialog');
    // dialog?.showModal();
  };
  
  return(
    <div className='centre pop vmargin space min200 max250 darkredGlow centreText'>
      <p className='med wide bottomLine cap centreText'>{Pref.equip} {Pref.estop}</p>
      <div className='rowWrap vmarginhalf'>
      <span>
  	    <button
  	      title='Multiple Projects'
  	      className='tideStop spacehalf blackblack'
  	      onClick={()=>openFixTime()}
  	      disabled={true}
  	    >
  	    <b>
  	      <span className='fa-stack tideIcon biggester'>
  	        <i className="fas fa-circle-notch fa-stack-2x tideIndicate"></i>
  	        <i className="fa-solid fa-fire fa-stack-1x" data-fa-transform="shrink-1"></i>
  	      </span>
  	    </b>
	    </button>
    </span>
    </div>
    <p><em>Repair Time is Coming Soon</em></p>
   </div>
  );
};

export default EStopCard;