import React from 'react';
import { toast } from 'react-toastify';

import ModelNative from '/client/layouts/Models/ModelNative';

// requires Data
// action : a string to determine which method to use
// title : a string of the thing you want to delete
// check : a string for a conformation
// entry : the object to be deleted
      
const Remove = ({ action, entry, title, check, access })=> {
  
  function handleRemove(e) {
    this.cutGo.disabled = true;
    const confirm = this.confirmInput.value.trim();
    switch(action) {
      case 'group':
        Meteor.call('deleteGroup', entry, confirm, (err, reply)=>{
          err && console.log(err);
          if(reply === 'inUse') {
            toast.warning('Cannot do this, entry is in use');
          }else if(reply) {
            toast.success('Entry removed');
            FlowRouter.go('/data/overview?request=groups');
          }else{
            toast.error('Rejected by Server');
            this.cutGo.disabled = false;
          }
        });
        break;
      case 'widget':
        Meteor.call('deleteWidget', entry, confirm, (err, reply)=>{
          err && console.log(err);
          if(reply === 'inUse') {
            toast.warning('Cannot do this, entry is in use');
          }else if(reply) {
            toast.success('Entry removed');
            FlowRouter.go('/data/overview?request=groups');
          }else{
            toast.error('Rejected by Server');
            this.cutGo.disabled = false;
          }
        });
        break;
      case 'variant':
        Meteor.call('deleteVariant', entry, confirm, (err, reply)=>{
          err && console.log(err);
          if(reply === 'inUse') {
            toast.warning('Cannot do this, entry is in use');
          }else if(reply) {
            toast.success('Entry removed');
          }else{
            toast.error('Rejected by Server');
            this.cutGo.disabled = false;
          }
        });
        break;
      default:
        toast.error('Server Error');
        console.log('this component is not wired properly');
    }
  }
  
  let checkshort = check.split('T')[0];
  
  if(!access) {
    return null;
  }
  
  return(
    <ModelNative
      dialogId={action+'_multi_delete_form'}
      title={`delete "${title}"`}
      icon='fa-solid fa-minus-circle'
      colorT='redT'>
      
      <div className='actionBox centre centreText'>
        <p>Are you sure you want to try to delete "{title}"?</p>
        <p>This cannot be undone and could cause unexpected consequences.</p>
        <br />
        <p>Enter "<i className='noCopy redT'>{checkshort}</i>" to confirm.</p>
        <br />
        <form onSubmit={(e)=>handleRemove(e)} className='inlineForm'>
          <input
            type='text'
            id='confirmInput'
            placeholder={checkshort}
            autoFocus={true}
            className='noCopy'
            required />
          <button
            className='action redSolid'
            type='submit'
            formMethod='dialog'
            id='cutGo'
            disabled={false}>DELETE</button>
        </form>
        <br />
      </div>
    </ModelNative>
  );
};

export default Remove;