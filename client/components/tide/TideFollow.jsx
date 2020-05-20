import React, { useRef, useState, useEffect, Fragment } from 'react';
import Pref from '/client/global/pref.js';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import UserNice from '/client/components/smallUi/UserNice.jsx';
import { toast } from 'react-toastify';

const TideFollow = ({ proRoute, user, invertColor })=> {
  
  const thingMounted = useRef(true);
  const [engaged, doEngage] = useState(false);
  const [recent, recentSet] = useState([]);
  
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
    Meteor.call('fetch24TideActivity', (err, rtn)=>{
	    err && console.log(err);
	    rtn !== undefined && thingMounted.current && recentSet(rtn);
	  });
  }, []);
  
  useEffect(() => {
    return () => { 
      thingMounted.current = false;
      Meteor.clearInterval(loopClock);
    };
  }, []);
  
	const go = (goto)=> {
	  Session.set('now', goto);
    FlowRouter.go('/production');
	};
	
  const taskT = !engaged || !engaged[1] ? '' : `, ${engaged[1]}`;
  const tootip = !engaged ? `No Active ${Pref.batch}` : 
	         `${Pref.batch} ${engaged[0]}${taskT}`;
	
  return(
    <Fragment>
      <ContextMenuTrigger
  			id='tideF0ll0w1'
  			attributes={ {className: `proRight ${invertColor ? 'invert' : ''}`} }>
        <button 
          aria-label={tootip}
          onClick={()=>go(engaged[0])}
          className='taskLink tideFollowTip'
          disabled={!engaged}
        ><i className='fas fa-street-view'></i>
        </button>
      </ContextMenuTrigger>
      
      <ContextMenu id='tideF0ll0w1' className='noCopy cap medBig'>
        <MenuItem disabled={true}>
          <i>Recent</i>
        </MenuItem>
        {recent.map( (val, ix)=>(  
          <MenuItem key={ix} onClick={()=>go(val)}>
            <i>{val}</i>
          </MenuItem>
        ))}
      </ContextMenu>
    </Fragment>
  );
};

export default TideFollow;

			
      
      
        