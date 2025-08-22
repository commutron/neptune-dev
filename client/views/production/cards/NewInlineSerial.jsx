import React, { Fragment, useState } from 'react';
// import Pref from '/client/global/pref.js';

const InlineNewSerial = ({ canSerial, gem, user })=> {
	
	const [ konfirm, konfirmSet ] = useState(undefined);
  
  const doNewSerialInline = ()=> {
    konfirmSet(0);
    const newGem = gem;
    const bScope = user.engaged.tName;
    Meteor.apply('kallNewSerial',
      [ gem, bScope ],
      {wait: true},
      (error, re)=> {
        error && console.error(error);
        konfirmSet(!re || !re[0] ? false : true);
    		re && re[0] ? Meteor.setTimeout(()=>Session.set('now', ''), 750) : null;
    		re && re[0] ? Meteor.setTimeout(()=>Session.set('now', newGem), 800) : null;
        !re || !re[0] ? console.log(re) : null;
      }
    );
  };
  
  if(gem && user.engaged && user.engaged.task === "PROX") {
  	if(konfirm === undefined) {
	    return(
	      <div className='centre centreText pop wmargin vmargin spacehalf min200 max400 darkCard nGlow'>
	        <strong>Create serial "{gem}"</strong>
	        {canSerial ?
		        <button
		          className='action nSolid vmarginhalf medBig line15x'
		          onClick={()=>doNewSerialInline()}
		        >Initiate Serial</button>
		        :
		        <p>This action requires Admin or Kitting access.</p>
	        }
	      </div>
	     );
  	}else{
  		return(
      	<div className={`kioskFlash proFlash ${konfirm === 0 ? 'wait' : konfirm ? 'good' : 'bad'}`}>
		      {konfirm === 0 ?
		        <n-faW><i className='fas fa-stroopwafel fa-fw fa-spin'></i></n-faW>
		        :
		        konfirm ?
		          <n-faA><i className='fas fa-check-circle fa-fw'></i></n-faA>
		        :
		          <n-faX><i className='fas fa-times-circle fa-fw'></i></n-faX>
		      }
		      </div>
    	);
  	}
  }
  
  return null;
};

export default InlineNewSerial;