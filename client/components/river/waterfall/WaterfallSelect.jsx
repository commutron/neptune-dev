import React from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
// import { toast } from 'react-toastify';

import Waterfall from './Waterfall.jsx';
import BatchXComplete from '/client/components/forms/Batch/BatchXComplete';

const WaterfallSelect = ({ batchData, app })=> {

  let allTotal = [];
  
  const waterfall = batchData.waterfall;
  const waterfallS = waterfall.sort((w1, w2)=> !w1.position ? -1 : 
          w1.position > w2.position ? 1 : w1.position < w2.position ? -1 : 0 );
    
  Session.set('nowStep', '');
  Session.set('nowWanchor', '');
  return (
    <div className='waterfallSelector'>
      {waterfall.length === 0 ?
        <div className='wide space orangeBorder'>
          <p>No {Pref.counter}s are assigned</p>
        </div>
      :
      waterfallS.map( (entry)=>{
        let total = entry.counts.length > 0 ?
          Array.from(entry.counts, x => x.tick).reduce((x,y)=> x + y) :
        0;
        const clear = total >= batchData.quantity;
        allTotal.push(clear);
        const type = entry.type || app.countOption.find( x => x.key === entry.wfKey ).type;
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
          <details key={entry.wfKey} className='waterfallWrap'>
            <summary className={'waterfallTitle ' + bannerColor}>{entry.gate} {type}</summary>
            <Waterfall
              id={batchData._id}
              fall={entry}
              total={total}
              quantity={batchData.quantity}
              lock={batchData.completed === true}
              app={app}
              borderColor={borderColor}
              fadeColor={fadeColor} />
          </details>
      )})}
      {allTotal.every( x => x === true ) &&
        <BatchXComplete batchData={batchData} /> 
      }
    </div>
  );
};
  
export default WaterfallSelect;