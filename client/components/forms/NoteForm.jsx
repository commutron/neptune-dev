import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelMedium from '../smallUi/ModelMedium.jsx';


const NotePopup = ({ action, id, versionKey, content, lgIcon })=> {
  
  const unlock = !versionKey ? 
                 !Roles.userIsInRole(Meteor.userId(), 'run') : 
                 !Roles.userIsInRole(Meteor.userId(), 'edit');
  
  return(               
    <ModelMedium
      button=''
      title={action + ' notes'}
      color='blueT'
      icon='fa-edit'
      lgIcon={lgIcon}
      lock={unlock}>
      <NoteForm 
        action={action}
        id={id}
        versionKey={versionKey}
        content={content} />
    </ModelMedium>
  );
};
        
const NoteForm = ({ action, id, versionKey, content, selfclose })=> {

  const rndmKey = Math.random().toString(36).substr(2, 5);
  
	function saveNote(e) {
    e.preventDefault();
    this[`${rndmKey}go`].disabled = true;
    const content = this.mess.value.trim();
    
    switch(action) {
      case Pref.xBatch:
        Meteor.call('setBatchNoteX', id, content, (error, reply)=>{
          error && console.log(error);
          if(reply) {
            toast.success('Saved');
            selfclose();
          }else{
            toast.error('NOT saved, Server Error');
          }
        });
        break;
      case Pref.batch:
        Meteor.call('setBatchNote', id, content, (error, reply)=>{
          error && console.log(error);
          if(reply) {
            toast.success('Saved');
            selfclose();
          }else{
            toast.error('NOT saved, Server Error');
          }
        });
        break;
      case 'variant':
        Meteor.call('setVariantNote', id, content, (error, reply)=>{
          error && console.log(error);
          if(reply) {
            toast.success('Saved');
            selfclose();
          }else{
            toast.error('NOT saved, Server Error');
          }
        });
        break;
      case 'version':
        Meteor.call('setVersionNote', id, versionKey, content, (error, reply)=>{
          error && console.log(error);
          if(reply) {
            toast.success('Saved');
            selfclose();
          }else{
            toast.error('NOT saved, Server Error');
          }
        });
        break;
      default:
        toast.error('Server Error');
        console.log('this component is not wired properly');
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
          cols='40'
          rows='15'
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