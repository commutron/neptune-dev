import React from 'react';
//import moment from 'moment';
import Pref from '/client/global/pref.js';

const Waterfall = ({ id, fall, quantity, app })=> {
  
  let total = fall.counts.length > 0 ?
  Array.from(fall.counts, x => x.tick).reduce((x,y)=> x + y) :
  0;
  
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
        className='smallAction clearRed'
        onClick={()=>minusOne()}
        disabled={total === 0}
      >-1</button>
      <br />
      <button
        className='smallAction'
        disabled={true}
      >+n</button>
      <br />
      <button
        className='smallAction'
        disabled={true}
      >rec</button>
      
      <br />
      
      <button
        className='action big clearBlue'
        onClick={()=>plusOne()}
        disabled={total >= quantity}
      >{total}/{quantity}</button>
  	</div>
  );
};
  
export default Waterfall;