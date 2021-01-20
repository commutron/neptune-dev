import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelMedium from '../smallUi/ModelMedium.jsx';

const BlockAdd = ({ id, edit, xBatch, lock, noText, smIcon })=> {
  
  const bttn = edit ? 'edit' : 'Add ' + Pref.block;
  const title = edit ? 'edit ' + Pref.block : 'add ' + Pref.block;

  return(
    <ModelMedium
      button={bttn}
      title={title}
      color='yellowT'
      icon='fa-exclamation-triangle'
      smIcon={smIcon}
      lock={!Roles.userIsInRole(Meteor.userId(), 'nightly'/*'run'*/) || lock}
      noText={noText}
    >
      <BlockAddForm
        id={id}
        edit={edit}
        xBatch={xBatch}
        lock={lock}
     />
    </ModelMedium>
  );
};


const BlockAddForm = ({ id, edit, xBatch, lock, selfclose })=> {

  function addBlock(e) {
    e.preventDefault();
    this.addBlockGo.disabled = true;
    const batchId = id;
    
    const blKey = edit ? edit.key : false;
    const text = this.blTxt.value.trim();
    
    if(xBatch) {
      if(blKey) {
        Meteor.call('editBlockX', batchId, blKey, text, (error, reply)=>{
          error && console.log(error);
          !reply && toast.error('Server Error');
        });
      }else{
        Meteor.call('addBlockX', batchId, text, (error, reply)=>{
          error && console.log(error);
          reply ? selfclose() : toast.error('Server Error');
        });
      }
    }else{
      if(blKey) {
        Meteor.call('editBlock', batchId, blKey, text, (error, reply)=>{
          if(error)
            console.log(error);
          if(reply) {
          }else{
            toast.error('Server Error');
          }
        });
      }else{
        Meteor.call('addBlock', batchId, text, (error, reply)=>{
          if(error)
            console.log(error);
          if(reply) {
            selfclose();
          }else{
            toast.error('Server Error');
          }
        });
      }
    }
  }

  const eTx = edit ? edit.block : '';

  return(
    <div>
      <form className='centre' onSubmit={(e)=>addBlock(e)}>
        <p>
          <textarea
            type='text'
            id='blTxt'
            cols='30'
            rows='6'
            placeholder='110072 short 25pcs'
            defaultValue={eTx}
            autoFocus={true}
            required>
          </textarea>
          <label htmlFor='blTxt'>Describe the Impediment</label>
        </p>
        <br />
        <p><button
          type='submit'
          id='addBlockGo'
          disabled={lock}
          className='action clearGreen'>{Pref.post}</button>
        </p>
      </form>
      <br />
    </div>
  );
};

export default BlockAdd;


export const SolveBlock = ({ id, blKey, xBatch, lock, noText })=> {
  
  function addSolve(e) {
    const act = prompt('Solution', '');
    !act ? null : act.trim();
    if(!act || act === '') {
      null;
    }else{
      if(xBatch) {
        Meteor.call('solveBlockX', id, blKey, act, (error, reply)=> {
          error && console.log(error);
          reply ? toast.success('Saved') : toast.error('Server Error'); 
  			});
      }else{
        Meteor.call('solveBlock', id, blKey, act, (error, reply)=> {
          if(error)
            console.log(error);
          reply ? toast.success('Saved') : toast.error('Server Error');
  			});
      }
    }
  }
  
  return(
    <button
      type='button'
      id='slvBlkGo'
      title={'Solve this ' + Pref.block}
      className='transparent'
      onClick={(e)=>addSolve(e)}
      disabled={lock}>
      <label className='navIcon actionIconWrap'>
        <i className='fas fa-check-circle greenT'></i>
        {!noText && <span className='actionIconText greenT'>Solve</span>}
      </label>
    </button>
  );
};

export const RemoveBlock = ({ id, blKey, xBatch, lock, noText })=> {
  
  function remove() {
		if(xBatch) {
      Meteor.call('removeBlockX', id, blKey, (error, reply)=> {
        error && console.log(error);
        reply ? toast.success('Saved') : toast.error('Server Error');
			});
    }else{
			Meteor.call('removeBlock', id, blKey, (error, reply)=> {
        if(error)
          console.log(error);
        reply ? toast.success('Saved') : toast.error('Server Error');
			});
    }
  }
  
  return(
    <button
      type='button'
      title={'Remove this ' + Pref.block}
      className='transparent'
      onClick={(e)=>remove(e)}
      disabled={lock}>
      <label className='navIcon actionIconWrap'>
        <i className='fas fa-trash redT'></i>
        {!noText && <span className='actionIconText redT'>Remove</span>}
      </label>
    </button>
  );
};