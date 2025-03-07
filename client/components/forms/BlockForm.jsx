import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelSmall from '/client/layouts/Models/ModelSmall';

const BlockAdd = ({ id, edit, noText, smIcon, lgIcon, doneLock, canRun })=> {
  
  const bttn = edit ? 'edit' : 'Add ' + Pref.block;
  const title = edit ? 'edit ' + Pref.block : 'add ' + Pref.block;
  
  return(
    <ModelSmall
      button={bttn}
      title={title}
      color='blueT'
      icon={edit ? 'fa-edit' : 'fa-comment-medical'}
      lgIcon={lgIcon}
      smIcon={smIcon}
      noText={noText}
      lock={edit ? !canRun : false}
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
          className='action nSolid'>Save</button>
        </p>
      </form>
      {edit &&
        <p className='dropCeiling centre topLine'>
          <RemoveBlock
            id={id} 
            blKey={edit.key}
            doneLock={doneLock}
            inLine={true} />
        </p>
      }
    </div>
  );
};

export default BlockAdd;

export const SolveBlock = ({ id, blKey, noText, canRun })=> (
  <ModelSmall
    button='Solve'
    title={canRun ? 'Solve this ' + Pref.block : Pref.norole}
    color='greenT'
    icon='fas fa-reply'
    lock={!canRun}
    noText={noText}
  >
    <SolveBlockForm
      id={id}
      blKey={blKey}
   />
  </ModelSmall>
);

const SolveBlockForm = ({ id, blKey, selfclose })=> {
  
  function addSolve(e) {
    e.preventDefault();
    this.slvBlockGo.disabled = true;
    
    const text = this.slvTxt.value.trim();
    
    Meteor.call('solveBlockX', id, blKey, text, (error)=> {
      error && toast.error('Server Error');
      selfclose(); 
		});
  }

  return(
    <form className='centre' onSubmit={(e)=>addSolve(e)}>
      <p>
        <textarea
          type='text'
          id='slvTxt'
          cols='40'
          rows='6'
          autoFocus={true}
          required>
        </textarea>
      </p>
      <p><button
        type='submit'
        id='slvBlockGo'
        className='action greenSolid'>Save</button>
      </p>
    </form>
  );
};

const RemoveBlock = ({ id, blKey, doneLock })=> {
  
  function remove() {
    Meteor.call('removeBlockX', id, blKey, (error, reply)=> {
      error && console.log(error);
      reply ? toast.success('Saved') : toast.error('Server Error');
		});
  }
  
  return(
    <button
      type='button'
      title={!doneLock ? 'Remove this ' + Pref.block : Pref.isDone}
      className='action redSolid'
      onClick={(e)=>remove(e)}
      disabled={doneLock}>
      <i className='fa-solid fa-trash gapR'></i>Delete
    </button>
  );
};