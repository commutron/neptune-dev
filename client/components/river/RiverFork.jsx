import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

function activate(id, serial, choice) {
  Meteor.call('forkItem', id, serial, choice, (error, reply)=>{
    if(error)
    console.log(error);
  reply ? null : toast.error('Server Error');
  });
}
    
const RiverFork = ({ id, serial, flows, river, riverAlt })=> {
  
  let flow = flows.find(x => x.flowKey === river);
  flow ? flow = flow.title : flow = false;
  let flowAlt = flows.find(x => x.flowKey === riverAlt);
  flowAlt ? flowAlt = flowAlt.title : flowAlt = false;
  
  let sty = { minHeight: '5em', fontSize: '1.5rem' };
  
  return(
    <div className='wide'>
      <button
        title='regular flow'
        className='action clear blueT wide'
        style={sty}
        onClick={()=> activate(id, serial, 'no')}
        disabled={!flow}
      >{flow}</button>
      <button
        title={'alternative ' + Pref.buildFlow}
        className='action clear blueT wide'
        style={sty}
        onClick={()=> activate(id, serial, 'yes')}
        disabled={!flowAlt}
      >{flowAlt}</button>
    </div>
  );
};

export default RiverFork;