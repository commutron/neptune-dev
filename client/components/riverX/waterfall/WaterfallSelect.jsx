import React from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
// import { toast } from 'react-toastify';
import './style';

import WaterFall from './WaterFall';
import BatchXComplete from '/client/components/forms/Batch/BatchXComplete';

const WaterfallSelect = ({ 
  batchData, allFlow, fallProg, allFall, nowater, rapid,
  app
})=> {
  
  Session.set('nowStep', '');
  Session.set('nowWanchor', '');
  
  const canRun = Roles.userIsInRole(Meteor.userId(), 'run');
  const speed = !Meteor.user().unlockSpeed ? 2000 : Meteor.user().unlockSpeed;
  
  const dfopen = !batchData.completed ? true :
                  rapid ? rapid.live : false;
  
  return(
    <div className={`waterfallSelector ${rapid ? 'rapIsHighlight' : ''}`}>
      {rapid &&
        <div className='rapDidBanner'
          >Extended <n-num>{moment(rapid.createdAt).calendar()}</n-num>
        </div>
      }
      
      {nowater ?
        <div className='wide space orangeBorder'>
          <p>No {Pref.counter}s are assigned</p>
        </div>
      :
      !batchData.completed ? 
        fallProg.map( (entry)=>(
          <Clif 
            key={entry.wfKey} 
            entry={entry}
            dfopen={dfopen}
            batchId={batchData._id}
            total={entry.count}
            quantity={batchData.quantity}
            speed={speed}
            lockOut={batchData.completed === true}
            app={app} />
        ))
      :
        rapid ? rapid.cascade.map( (entry, index)=>(
          <Clif 
            key={entry.wfKey} 
            entry={entry}
            dfopen={dfopen}
            batchId={false}
            rapidId={rapid._id}
            total={rapid.rCounts[index]}
            quantity={rapid.quantity}
            speed={speed}
            lockOut={rapid.live === false}
            app={app} />
        ))
      :
        null
      }
      {!rapid && ( nowater || (allFlow && allFall) ) ?
        <BatchXComplete 
          batchData={batchData} 
          allFlow={allFlow}
          allFall={allFall}
          nowater={nowater}
          canRun={canRun && !rapid} /> 
        : null
      }
    </div>
  );
};
  
export default WaterfallSelect;

const Clif = ({ 
  entry, dfopen, batchId, rapidId,
  total, quantity, speed, lockOut, app
})=> {
  
  const type = entry.type;
  let borderColor = 'borderBlue';
  let fadeColor = 'Blue';
  //// Style the Stone Accordingly \\\\
	if(type === 'inspect'){
		borderColor = 'borderGreen';
		fadeColor = 'Green';
  }else if(type === 'checkpoint'){
		borderColor = 'borderWhite';
		fadeColor = 'White';
  }else if(type === 'test'){
		borderColor = 'borderTeal';
		fadeColor = 'Teal';
  }else if(type === 'finish'){
		borderColor = 'borderPurple';
		fadeColor = 'Purple';
  }else{
    null }
  const bannerColor = fadeColor.toLowerCase();
  
  return(
    <details
      className='waterfallWrap'
      open={dfopen}>
      <summary className={`waterfallTitle ${bannerColor}`}>{entry.gate} {type}</summary>
      <WaterFall
        batchId={batchId}
        rapidId={rapidId}
        fall={entry}
        total={total}
        quantity={quantity}
        speed={speed}
        lock={lockOut}
        app={app}
        borderColor={borderColor}
        fadeColor={fadeColor} />
    </details>
  );
};