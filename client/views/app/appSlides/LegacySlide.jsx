import React from 'react';
import { toast } from 'react-toastify';

const LegacySlide = ()=> {
  
  function requestAltFlowInfo() {
    Meteor.call('altFlowUse', (error, reply)=>{
      error && console.log(error);
      toast(<div>
        <h3>Alt Flow</h3>
        Total Batches: {reply.totalAltBatch} <br />
        Total Items: {reply.totalAltItems} <br />
        Live Batches: {reply.totalLiveBatch} <br />
        Live Items: {reply.totalLiveBatchItems} <br />
        Dormant Batches: {reply.totalDormantBatch} <br />
        Dormant Items: {reply.totalDormantBatchItems}
      </div>, { autoClose: false });
      console.log({ live: reply.aliveBatchInfo, dormant: reply.dormantBatchInfo});
    });
  }
  
  function requestEscapeUse() {
    Meteor.call('escapeUse', (error, reply)=>{
      error && console.log(error);
      toast(<div>
        <h3>Escaped</h3>
        Total Batches: {reply.totalBatch} <br />
        {"> 1 Batches:"} {reply.totalMulti} <br />
      </div>, { autoClose: false });
      console.log(reply.multiBatch);
    });
  }
  
  function setMinorPIN(e) {
    e.preventDefault();
    const newOne = this.newOneM.value.trim();
    const newTwo = this.newTwoM.value.trim();
    
    if(newOne === newTwo) {
      Meteor.call('setMinorPin', newOne, (err, reply)=>{
        if(err)
          console.log(err);
        if(reply) {
          toast.success('Saved');
          this.newOne.value = '';
          this.newTwo.value = '';
        }else{
          toast.error('Server Error');
        }
      });
    }else{
      toast.error('Server Error');
    }
  }
  
  return(
    <div className='space3v'>
      <p>determine support needs</p>
      <p>
        <button
          className='action clearBlue invert'
          onClick={()=>requestAltFlowInfo()}
        >Info on Alt Flow Use</button>
      </p>
      
      <p>
        <button
          className='action clearBlue invert'
          onClick={()=>requestEscapeUse()}
        >Info on Escaped Use</button>
      </p>
      
      <br />
      
      <form onSubmit={(e)=>setMinorPIN(e)} autoComplete='off'>
        <p>A minor pin for operations that are risky, or outside of regular permissions</p>
        <p>
          <input
            type='password'
            id='newOneM'
            pattern='[000-999]*'
            maxLength='3'
            minLength='3'
            placeholder='000-999'
            inputMode='numeric'
            autoComplete='000'
            required
          />
          <label htmlFor='newOne'>New PIN</label>
          <br />
          <input
            type='password'
            id='newTwoM'
            pattern='[000-999]*'
            maxLength='3'
            minLength='3'
            placeholder='000-999'
            inputMode='numeric'
            autoComplete='000'
            required
          />
          <label htmlFor='newTwo'>New PIN again</label>
        </p>
        <p>
          <button
            type='submit'
            className='smallAction clearGreen'
            disabled={false}
          >Save</button>
        </p>
      </form>
    </div>
  );
};

export default LegacySlide;