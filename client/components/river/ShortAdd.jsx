import React from 'react';
import Pref from '/client/global/pref.js';


const ShortAdd = ({ id, serial, app, doneClose })=> {

  function handleShort(e) {
    e.preventDefault();
    this.goSh.disabled = true;
    const partNum = this.partNum.value.trim();
    const refs = this.shRefs.value.trim().toLowerCase()
                  .replace(",", " ").split(/\s* \s*/);
    const comm = this.comm.value.trim();
    const step = Session.get('nowStep') || 'unavailable';
    
    //console.log({ id, partNum, refs, serial, step, comm });
    Meteor.call('addShort', id, partNum, refs, serial, step, comm, (error, reply)=>{
      error && console.log(error);
      doneClose();
    });
  }

	let lock = Session.get('nowStep') === 'done';
	
  return (
    <form
      className='actionForm'
      onSubmit={(e)=>handleShort(e)}>
      <span>
        <input
          type='text'
          id='partNum'
          className='orangeIn up'
          placeholder='13-bC_047'
          disabled={lock}
          required />
        <label htmlFor='shRefs'>Part Number</label>
      </span>
      <span>
        <input
          type='text'
          id='shRefs'
          list='prevRefs'
          className='orangeIn up'
          placeholder='R1 R2 R3'
          disabled={lock}
          required />
        <label htmlFor='shRefs'>{Pref.nonConRef}</label>
      </span>
      <span>
        <input
          type='text'
          id='comm'
          className='orangeIn'
          placeholder='...'
          disabled={lock} />
        <label htmlFor='shRefs'>Comments</label>
      </span>
      
      <button
        type='submit'
        id='goSh'
        disabled={lock}
        className='smallAction clearOrange'
      >{Pref.post}</button>
    </form>
  );
};

export default ShortAdd;