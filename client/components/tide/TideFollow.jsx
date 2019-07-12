import React, { useState, useEffect } from 'react';
import Pref from '/client/global/pref.js';
import UserNice from '/client/components/smallUi/UserNice.jsx';
import { toast } from 'react-toastify';

const TideFollow = ({ proRoute, invertColor })=> {
  
  const [engaged, doEngage] = useState(false);
  
  useEffect(() => {
    Meteor.call('engagedState', (err, rtn)=>{
	    err && console.log(err);
	    doEngage(rtn);
	  });
	  loopClock = Meteor.setInterval( ()=>{
      if(!proRoute && engaged) {
        toast.dismiss();
        toast(<i>⏰ Remember <UserNice id={Meteor.userId()} />,
          you are still {Pref.engaged} with a {Pref.batch}. 
          <a onClick={()=>go()}>Go back there now</a></i>, { 
          autoClose: false
        });
      }
    },1000*60*15);
    return () => { Meteor.clearInterval(this.loopClock); };
  });
  
	const go = ()=> {
	  Session.set('now', engaged);
    FlowRouter.go('/production');
	};

  return(
    <div className={`proRight ${invertColor ? 'invert' : ''}`}>
      <button 
        title={!engaged ?
          `Not currently engaged in a ${Pref.batch}` : 
          `Escape Hatch \nto engaged ${Pref.batch}: ${engaged}`}
        onClick={()=>go()}
        disabled={!engaged}
      ><i className='fas fa-parachute-box primeRightIcon'></i>
      </button>
    </div>
  );
};

export default TideFollow;