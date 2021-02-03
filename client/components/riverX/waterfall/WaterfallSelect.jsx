import React from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
// import { toast } from 'react-toastify';
import './style';

import WaterFall from './WaterFall';
import BatchXComplete from '/client/components/forms/Batch/BatchXComplete';

const WaterfallSelect = ({ batchData, allFlow, fallProg, allFall, nowater, app })=> {
  
  Session.set('nowStep', '');
  Session.set('nowWanchor', '');
  
  const canRun = Roles.userIsInRole(Meteor.userId(), 'run');
  const dfopen = fallProg.length === 1;
   
  return(
    <div className='waterfallSelector'>
      {nowater ?
        <div className='wide space orangeBorder'>
          <p>No {Pref.counter}s are assigned</p>
        </div>
      :
      fallProg.map( (entry)=>{
        let total = entry.count; //entry.counts.length > 0 ?
        
        const type = entry.type || app.countOption.find( x => x.key === entry.key ).type;
        //let bannerColor = 'blue';
        let borderColor = 'borderBlue';
        let fadeColor = 'Blue';
        //// Style the Stone Accordingly \\\\
      	if(type === 'inspect'){
      	  //bannerColor = 'green';
      		borderColor = 'borderGreen';
      		fadeColor = 'Green';
        }else if(type === 'checkpoint'){
          //bannerColor = 'white';
      		borderColor = 'borderWhite';
      		fadeColor = 'White';
        }else if(type === 'test'){
          //bannerColor = 'teal';
      		borderColor = 'borderTeal';
      		fadeColor = 'Teal';
        }else if(type === 'finish'){
          //bannerColor = 'purple';
      		borderColor = 'borderPurple';
      		fadeColor = 'Purple';
        }else{
          null }
        const bannerColor = fadeColor.toLowerCase();
        return(
          <details 
            key={entry.key} 
            className='waterfallWrap'
            open={dfopen}>
            <summary className={`waterfallTitle ${bannerColor}`}>{entry.gate} {type}</summary>
            <WaterFall
              batchId={batchData._id}
              fall={entry}
              total={total}
              quantity={batchData.quantity}
              lock={batchData.completed === true}
              app={app}
              borderColor={borderColor}
              fadeColor={fadeColor} />
          </details>
      )})}
      {nowater || (allFlow && allFall) ?
        <BatchXComplete 
          batchData={batchData} 
          allFlow={allFlow}
          allFall={allFall}
          nowater={nowater}
          canRun={canRun} /> 
        : null
      }
    </div>
  );
};
  
export default WaterfallSelect;