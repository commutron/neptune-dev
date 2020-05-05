import React, { useRef, useState, useEffect } from 'react';
import Pref from '/client/global/pref.js';
import UserNice from '/client/components/smallUi/UserNice.jsx';
import { toast } from 'react-toastify';

const TideFollow = ({ proRoute, user, invertColor })=> {
  
  const thingMounted = useRef(true);
  const [engaged, doEngage] = useState(false);
  
  useEffect(() => {
    Meteor.call('engagedState', (err, rtn)=>{
	    err && console.log(err);
	    rtn !== undefined && thingMounted.current && doEngage(rtn);
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
    
  }, [proRoute, user]);
  	    
  useEffect(() => {
    return () => { 
      thingMounted.current = false;
      Meteor.clearInterval(loopClock);
    };
  }, []);
  
	const go = ()=> {
	  Session.set('now', engaged[0]);
    FlowRouter.go('/production');
	};
	
  const taskT = !engaged || !engaged[1] ? '' : `, ${engaged[1]}`;
  const tootip = !engaged ? `No Active ${Pref.batch}` : 
	         `${Pref.batch} ${engaged[0]}${taskT}`;
	         
  return(
    <div className={`proRight ${invertColor ? 'invert' : ''}`}>
      <button 
        aria-label={tootip}
        onClick={()=>go()}
        className='taskLink tideFollowTip'
        disabled={!engaged}
      ><i className='fas fa-street-view'></i>
      </button>
    </div>
  );
};

export default TideFollow;