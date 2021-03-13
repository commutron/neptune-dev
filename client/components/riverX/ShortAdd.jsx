import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';


const ShortAdd = ({ seriesId, serial, pastPN, pastRF, app, doneClose })=> {

  function handleShort(e) {
    e.preventDefault();
    this.goSh.disabled = true;
    const partNum = this.partNum.value.trim();
    const refs = this.shRefs.value.trim().toLowerCase()
                  .replace(",", " ").split(/\s* \s*/);
    const comm = this.comm.value.trim();
    const where = Session.get('ncWhere') || 'unavailable';
    
    Meteor.call('addShortX', seriesId, partNum, refs, serial, where, comm, (error, reply)=>{
      error && console.log(error);
      if(reply) {
        doneClose();
      }else{
        toast.warn("Part Number is already recorded.", {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 5000,
          closeOnClick: false
        });
        this.goSh.disabled = false;
      }
    });
  }

	let now = Session.get('ncWhere');
	let lock = now === 'isC0mpl3t3d';
	
  return(
    <form
      className='actionForm'
      onSubmit={(e)=>handleShort(e)}>
      <span>
        <datalist id='pastPNlist'>
          {pastPN.map( (entry)=>{
            return( <option key={entry} value={entry}>{entry}</option> );
          })}
        </datalist>
        <input
          type='text'
          id='partNum'
          list='pastPNlist'
          className='orangeIn up'
          placeholder='13-bC_047'
          disabled={lock}
          required />
        <label htmlFor='partNum' className='whiteT'>Part Number</label>
      </span>
      <span>
        <datalist id='pastRFlist'>
          {pastRF.map( (entry)=>{
            return( <option key={entry} value={entry}>{entry}</option> );
          })}
        </datalist>
        <input
          type='text'
          id='shRefs'
          list='pastRFlist'
          className='orangeIn up'
          placeholder='R1 R2 R3'
          disabled={lock}
          required />
        <label htmlFor='shRefs' className='whiteT'>{Pref.nonConRef}</label>
      </span>
      <span>
        <input
          type='text'
          id='comm'
          className='orangeIn'
          placeholder='...'
          disabled={lock} />
        <label htmlFor='shRefs' className='whiteT'>Comments</label>
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