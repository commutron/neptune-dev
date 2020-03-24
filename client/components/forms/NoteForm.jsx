import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelMedium from '../smallUi/ModelMedium.jsx';

// required data
//// Order Data or Customer Data as props.data
//// widget key as props.widgetKey
//// type as props.type === batch || widget

const NotePopup = ({ id, versionKey, xBatch, content, small })=> {
  
  const choose = versionKey ? Pref.widget : Pref.batch;
  const unlock = !versionKey ? 
                 !Roles.userIsInRole(Meteor.userId(), 'run') : 
                 !Roles.userIsInRole(Meteor.userId(), 'edit');
  
  return(               
    <ModelMedium
      button=''
      title={choose + ' notes'}
      color='blueT'
      icon='fa-edit'
      smIcon={small}
      lock={unlock}>
      <NoteForm 
        id={id}
        versionKey={versionKey}
        xBatch={xBatch}
        content={content} />
    </ModelMedium>
  );
};
        
const NoteForm = ({ id, versionKey, xBatch, content, selfclose })=> {

  const rndmKey = Math.random().toString(36).substr(2, 5);
  
	function saveNote(e) {
    e.preventDefault();
    this[`${rndmKey}go`].disabled = true;
    const content = this.mess.value.trim();
    const choose = versionKey ? true : false;

    if(!choose) {
      if(xBatch) {
        Meteor.call('setBatchNoteX', id, content, (error, reply)=>{
          error && console.log(error);
          if(reply) {
            toast.success('Saved');
            selfclose();
          }else{
            toast.error('NOT saved, Server Error');
          }
        });
      }else{
        Meteor.call('setBatchNote', id, content, (error, reply)=>{
          error && console.log(error);
          if(reply) {
            toast.success('Saved');
            selfclose();
          }else{
            toast.error('NOT saved, Server Error');
          }
        });
      }
    }else if(choose) {
      Meteor.call('setVersionNote', id, versionKey, content, (error, reply)=>{
        error && console.log(error);
        if(reply) {
          toast.success('Saved');
          selfclose();
        }else{
          toast.error('NOT saved, Server Error');
        }
      });
    }else{
      console.log('NoteForm component not wired up corectly');
      toast.error('Server Error');
    }
  }
  
  function goOp(e) {
    this[`${rndmKey}go`].disabled = false;
  }
  
  const now = content ? content : '';

  return(
    <form
      className='centre'
      onSubmit={(e)=>saveNote(e)}
      onChange={(e)=>goOp(e)}>
      <br />
      <p>
        <textarea
          id='mess'
          cols='30'
          rows='6'
          placeholder='comments, alerts, messages'
          defaultValue={now}
          autoFocus={true}></textarea>
        <label htmlFor='mess'>Note</label>
      </p>
      <p>
        <button
          id={`${rndmKey}go`}
          disabled={true}
          className='action clearGreen'
          type='submit'>Save</button>
      </p>
    </form>
  );
};

export default NotePopup;