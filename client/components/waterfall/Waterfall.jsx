import React from 'react';
//import moment from 'moment';
import Pref from '/client/global/pref.js';

const Waterfall = ({ id, fall, total, quantity, lock, app })=> {

  function plusOne() {
    const batchID = id;
    if(total < quantity) {
      Meteor.call('positiveCounter', batchID, fall.wfKey, (error)=>{
        error && console.log(error);
      });
    }
  }
  function minusOne() {
    const batchID = id;
    if(total > 0) {
      Meteor.call('negativeCounter', batchID, fall.wfKey, (error)=>{
        error && console.log(error);
      });
    }
  }
  
  return (
    <div className='waterfallGrid'>
      <button
        className='countMinus smallAction clearRed'
        onClick={()=>minusOne()}
        disabled={lock || total === 0}
      >-1</button>
      
      <button
        className='countN smallAction'
        disabled={lock || true}
      >+n</button>
      
      <button
        className='countRec smallAction'
        disabled={lock || true}
      >rec</button>
      
      <button
        className='countPlus action big clearBlue'
        onClick={()=>plusOne()}
        disabled={lock || total >= quantity}
      >{total}/{quantity}</button>
  	</div>
  );
};
  
export default Waterfall;