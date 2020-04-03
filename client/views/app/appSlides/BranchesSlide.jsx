import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import BranchBuilder from '/client/components/bigUi/ArrayBuilder/BranchBuilder.jsx';

const BranchesSlide = ({ app, isAdmin, isDebug })=> {

  function handleBranchUpgrade() {
    Meteor.call('UPGRADEorgBranches', (error, reply)=>{
      error && console.log(error);
      if(reply) {
        toast.success(`upgraded`);
      }else{
        toast.error('not possible');
      }
    });
  }
  
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
    <div className='invert'>
      
      <h2 className='cap'><i className='fas fa-code-branch fa-fw'></i> {Pref.branches}</h2>
      <p>Options for Branch / Department / Tracking Catagory</p>
      <p>
        <i className='fas fa-exclamation-circle'></i>
        <i> Entries are case sensitive, smt =/= SMT.</i>
        <i> Capitalizing is unnecessary in most cases and only recommended for abbreviations.</i>
      </p>
      <p>
        <i className='fas fa-exclamation-circle'></i>
        <i> Text Areas allow for multiple entries by seperating by a comma ","</i>
      </p>
      
      {!app.branches &&
        <button 
          className='action blueHover'
          onClick={(e)=>handleBranchUpgrade()}
        >Upgrade DB for Batches</button>}
      
      <BranchBuilder app={app} isDebug={isDebug} />
      
      <hr />
      
      <h3>Add New Branch</h3>
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