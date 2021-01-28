import React, { useRef, useEffect, Fragment } from 'react';
import Pref from '/client/global/pref.js';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import UserNice from '/client/components/smallUi/UserNice.jsx';
import { toast } from 'react-toastify';

const TideFollow = ({ proRoute, invertColor })=> {
  
  const thingMounted = useRef(true);
  
  useEffect(() => {
    if(!proRoute) {
      loopClock = Meteor.setInterval( ()=>{
        if(Meteor.user().engaged) {
          toast.dismiss();
          toast(<i>⏰ Remember <UserNice id={Meteor.userId()} />,
            you are still {Pref.engaged} with a {Pref.batch}. 
            <a onClick={()=>go(Meteor.user().engaged.tName)}
              >Go back there now</a></i>, { 
            autoClose: false
          });
        }
      },1000*60*15);
  	}
    return () => { 
      thingMounted.current = false;
      if(!proRoute) { Meteor.clearInterval(loopClock); }
    };
  }, [proRoute]);
  
	const go = (goto)=> {
	  Session.set('now', goto);
    FlowRouter.go('/production');
	};
	
	const user = Meteor.user();
	const engaged = user ? user.engaged : false;
	const tpool = user ? user.tidepools : [];
  const recent = [...new Set( tpool ) ];
	
  const taskT = !engaged || !engaged.tTask ? '' : `, ${engaged.tTask}`;
  const tootip = !engaged ? `No Active ${Pref.batch}` : 
	         `${Pref.batch} ${engaged.tName}${taskT}`;
	
  return(
    <Fragment>
      <ContextMenuTrigger
  			id='tideF0ll0w1'
  			attributes={ {className: `proRight ${invertColor ? 'invert' : ''}`} }>
        <button 
          aria-label={tootip}
          onClick={()=>go(engaged && engaged.tName)}
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

function areEqual(prevProps, nextProps) {
	if( prevProps !== nextProps	) {
  	return false;
	}else{
		return true;
	}
}

export default React.memo(TideFollow, areEqual);