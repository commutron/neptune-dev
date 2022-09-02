import React from 'react';
import Pref from '/client/global/pref.js';

const EqAllCard = ()=> {
  
  const openFixTime = ()=> {
    const fixdialog = document.getElementById('equipfixdialog');
    fixdialog?.showModal();
  };
  
  return(
    <div className='centre pop vmargin space min200 max250 midnightGlow'>
      <p className='med wide bottomLine cap'>{Pref.equip} Repair</p>
      <div className='centre vmarginhalf'>
        <span>
    	    <button
    	      title='Equipment Repair'
    	      className='tideFix spacehalf blackblack'
    	      onClick={()=>openFixTime()}
    	      disabled={false}
    	    >
    	    <b>
    	      <span className='fa-stack tideIcon biggester'>
    	        <i className="fas fa-circle-notch fa-stack-2x tideIndicate"></i>
    	        <i className="fa-solid fa-screwdriver-wrench fa-stack-1x" data-fa-transform="shrink-1"></i>
    	      </span>
    	    </b>
    	    </button>
        </span>
      </div>
    </div>
  );
};

export default EqAllCard;