import React from 'react';
import Pref from '/public/pref.js';
// import { toast } from 'react-toastify';

import BranchBuilder, { BranchListEditor } from '/client/components/bigUi/ArrayBuilder/BranchBuilder';

const BranchesSlide = ({ app, isDebug })=> {
  
  function handleBranchAdd(e) {
    e.preventDefault();
    this.nwBgo.disabled = true;
    const nameVal = this.newBrchNm.value;
    const commonVal = this.newBrchCmn.value;
    if( typeof nameVal === 'string' && typeof commonVal === 'string' ) {
      Meteor.call('addBranchOption', nameVal, commonVal, (error, reply)=>{
        error && console.log(error);
        if(reply) {
          this.nwBgo.disabled = false;
          this.newBrchNm.value = '';
          this.newBrchCmn.value = '';
        }
      });
    }
  }

  
  return (
    <div className='invert space3v'>
      
      <h2 className='cap'><i className='fas fa-code-branch fa-fw'></i> {Pref.branches}</h2>
      <p>Options for Branch / Department / Tracking Catagory</p>
      <p>
        <i className='fas fa-exclamation-circle'></i>
        <i> Entries are case sensitive, smt =/= SMT.</i>
        <i> Capitalizing is unnecessary in most cases and only recommended for abbreviations.</i>
      </p>
      
      <h2 className='dropCeiling'>Branch Behavior</h2>
      <BranchBuilder app={app} isDebug={isDebug} />
      
      <hr />
      
      <h2 className='dropCeiling'>Branch Associated Lists</h2>
      <p>
        <i className='fas fa-exclamation-circle'></i>
        <i> Text Areas allow for multiple entries by seperating by comma (,) or semicolon (;) </i>
      </p>
      <BranchListEditor app={app} isDebug={isDebug} />
      
      <hr />
      
      <h2 className='dropCeiling'>Add New Branch</h2>
      <form onSubmit={(e)=>handleBranchAdd(e)}>
        <p>
          <label htmlFor='newBrchNm'>Branch Name</label><br />
          <input
            type='text'
            id='newBrchNm'
            required />
        </p>
        <p>
          <label htmlFor='newBrchCmn'>Branch Common</label><br />
          <input
            type='text'
            id='newBrchCmn'
            required />
        </p>
        <p>
          <button
            type='submit'
            id='nwBgo'
            className='action clearGreen'
            disabled={false}
          >Add</button>
        </p>
      </form>
      
    </div>
  );
};

export default BranchesSlide;