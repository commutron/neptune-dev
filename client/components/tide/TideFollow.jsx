import React, { useRef, useState, useEffect } from 'react';
import Pref from '/client/global/pref.js';
import UserNice from '/client/components/smallUi/UserNice.jsx';
import { toast } from 'react-toastify';

const TideFollow = ({ proRoute, invertColor })=> {
  
  const thingMounted = useRef(true);
  const [engaged, doEngage] = useState(false);
  
  useEffect(() => {
    Meteor.call('engagedState', (err, rtn)=>{
	    err && console.log(err);
	    rtn && thingMounted.current && doEngage(rtn);
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
    return () => { 
        thingMounted.current = false;
        Meteor.clearInterval(loopClock); };
  }, [proRoute]);
  
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
      ><i className='fas fa-street-view primeRightIcon' data-fa-transform='up-1'></i>
      </button>
    </div>
  );
};

export default TideFollow;