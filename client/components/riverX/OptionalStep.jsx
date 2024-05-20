import React, { useState } from 'react';
import Pref from '/client/global/pref.js';

import ButtonRedo from '/client/components/tinyUi/ButtonRedo';

const OptionalStep = ({ batchId, seriesId, itemData, close })=> {
  
  const isXray = Roles.userIsInRole(Meteor.userId(), 'xray');
  
  const [ intend, intendSet ] = useState(false);
  const [ commTxt, commSet ] = useState("");
  const [ lock, lockSet ] = useState(false);
  
  function passO(step, pass) {
    lockSet(true);
    const com = commTxt.trim();
    
		Meteor.call('addOpX', batchId, seriesId, itemData.serial, step, pass, com, 
		(error, reply)=>{
	    error && console.log(error);
			reply === true ? close() :
		    toast.warning('Insufficient Permissions');
		});
  }
  
  return(
    <div className='dBotGap stoneForm'>
      <button
        className='blue action blueSolid whiteT space1v centreText medBig clean lnht cap'
        onClick={()=>intendSet(!intend)}
      >Optional {Pref.opInspect}</button>
      
      {!intend ? null :
        <div className='fakeFielset'>
          <div className='reStep'>
            <span className='optStep'>
      				<ButtonRedo
                act='fail'
                ky='XRAYadhoc'
                step='x-ray'
                func={()=>passO('x-ray', false)}
                lockout={lock || !isXray}
              />
              <ButtonRedo
                act='pass'
                ky='XRAYadhoc'
                step='x-ray'
                func={()=>passO('x-ray', true)}
                lockout={lock || !isXray}
              />
    				</span>
    			</div>
  				<label htmlFor='opcom' className='wideStone'>
            <textarea
    			    type='text'
    			    id='opcom'
    			    rows={1}
    			    onChange={(e)=>commSet(e)}>
    			</textarea>Comments</label>
        </div>
      }
    </div>
  );
};

export default OptionalStep;