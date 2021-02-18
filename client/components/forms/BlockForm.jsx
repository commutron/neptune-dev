import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelSmall from '/client/components/smallUi/ModelSmall';

const BlockAdd = ({ id, edit, noText, smIcon, lgIcon, doneLock })=> {
  
  const bttn = edit ? 'edit' : 'Add ' + Pref.block;
  const title = edit ? 'edit ' + Pref.block : 'add ' + Pref.block;
  
  const isOpen = Roles.userIsInRole(Meteor.userId(), 'run');
  
  if(!isOpen) { 
    return null;
  }
  return(
    <ModelSmall
      button={bttn}
      title={title}
      color='blueT'
      icon={edit ? 'fa-edit' : 'fa-comment-medical'}
      lgIcon={lgIcon}
      smIcon={smIcon}
      lock={!isOpen}
      noText={noText}
    >
      <BlockAddForm
        id={id}
        edit={edit}
        doneLock={doneLock}
     />
    </ModelSmall>
  );
};


const BlockAddForm = ({ id, edit, doneLock, selfclose })=> {

  function addBlock(e) {
    e.preventDefault();
    this.addBlockGo.disabled = true;
    const batchId = id;
    
    const blKey = edit ? edit.key : false;
    const text = this.blTxt.value.trim();
    
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
  }

  const eTx = edit ? edit.block : '';

  return(
    <div>
      {edit &&
        <p>
          <RemoveBlock
            id={id} 
            blKey={edit.key}
            doneLock={doneLock}
            inLine={true} />
        </p>
      }
      <form className='centre' onSubmit={(e)=>addBlock(e)}>
        <p>
          <textarea
            type='text'
            id='blTxt'
            cols='40'
            rows='6'
            placeholder='110072 short 25pcs'
            defaultValue={eTx}
            autoFocus={true}
            required>
          </textarea>
        </p>
        <p><button
          type='submit'
          id='addBlockGo'
          className='action clearGreen'>Save</button>
        </p>
      </form>
    </div>
  );
};

export default BlockAdd;


export const SolveBlock = ({ id, blKey, noText })=> {
  
  function addSolve(e) {
    const act = prompt('Solution', '');
    !act ? null : act.trim();
    if(!act || act === '') {
      null;
    }else{
      Meteor.call('solveBlockX', id, blKey, act, (error, reply)=> {
        error && console.log(error);
        reply ? toast.success('Saved') : toast.error('Server Error'); 
			});
    }
  }
  
  return(
    <button
      type='button'
      id='slvBlkGo'
      title={'Solve this ' + Pref.block}
      className='transparent'
      onClick={(e)=>addSolve(e)}>
      <label className='navIcon actionIconWrap'>
        <i className='fas fa-reply greenT'></i>
        {!noText && <span className='actionIconText greenT'>Solve</span>}
      </label>
    </button>
  );
};

const RemoveBlock = ({ id, blKey, doneLock, noText })=> {
  
  function remove() {
    Meteor.call('removeBlockX', id, blKey, (error, reply)=> {
      error && console.log(error);
      reply ? toast.success('Saved') : toast.error('Server Error');
		});
  }
  
  return(
    <button
      type='button'
      title={'Remove this ' + Pref.block}
      className='action middle'
      onClick={(e)=>remove(e)}
      disabled={doneLock}>
      <i className='fas fa-trash fa-lg redT'></i> Delete
    </button>
  );
};