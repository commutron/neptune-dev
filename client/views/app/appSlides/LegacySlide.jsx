import React from 'react';
import { toast } from 'react-toastify';

const LegacySlide = ()=> {

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