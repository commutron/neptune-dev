import React from 'react';
//import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelMedium from '../smallUi/ModelMedium.jsx';

// requires Data
// action : a string to determine which method to use
// title : a string of the thing you want to delete
// check : a string for a conformation
// entry : the object to be deleted

const RemoveWrapper = ({ action, entry, title, check, noText, lockOut })=> {
  
  const auth = Roles.userIsInRole(Meteor.userId(), 'remove') && !lockOut;
  
  return(
    <ModelMedium
      button='Delete'
      title={`delete "${title}" permanently`}
      color='redT'
      icon='fa-minus-circle'
      lock={!auth}
      noText={noText}
    >
      <Remove
        action={action}
        entry={entry}
        title={title}
        check={check}
      />
    </ModelMedium>
  );   
};

export default RemoveWrapper;  
      
const Remove = ({ action, entry, title, check })=> {
  
  function handleRemove(e) {
    e.preventDefault();
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
      case 'xbatch':
        Meteor.call('deleteBatchX', entry, confirm, (err, reply)=>{
          err && console.log(err);
          if(reply === 'inUse') {
            toast.warning('Cannot do this, entry is in use');
          }else if(reply) {
            toast.success('Entry removed');
            FlowRouter.go('/data/overview?request=batches');
          }else{
            toast.error('Rejected by Server');
            this.cutGo.disabled = false;
          }
        });
        break;
      case 'item':
        Meteor.call('deleteItem', entry._id, title, confirm, (err, reply)=>{
          err && console.log(err);
          if(reply === 'inUse') {
            toast.warning('Cannot do this, entry is in use');
          }else if(reply) {
            toast.success('Entry removed');
            FlowRouter.go('/data/batch?request=' + entry.batch);
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

  return(
    <div className='actionBox redT'>
      <br />
      <p>Are you sure you want to try to delete "{title}"?</p>
      <p>This cannot be undone and could cause unexpected consequences.</p>
      <br />
      <p>Enter "<i className='noCopy'>{checkshort + ' '}</i>" to confirm.</p>
      <br />
      <form onSubmit={(e)=>handleRemove(e)} className='inlineForm'>
        <input
          type='text'
          id='confirmInput'
          placeholder={checkshort}
          autoFocus={true}
          className='noCopy redIn'
          required />
        <button
          className='smallAction clearRed'
          type='submit'
          id='cutGo'
          disabled={false}>DELETE</button>
      </form>
      <br />
    </div>
  );
};