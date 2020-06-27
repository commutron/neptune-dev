import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelMedium from '../smallUi/ModelMedium.jsx';

// requires
// title : a string of the thing you want to delete
// check : a string for a conformation
// entry : the object to be deleted

const RemoveBatchWrapper = ({ entry, title, check, lockOut })=> {
  
  const auth = Roles.userIsInRole(Meteor.userId(), 'remove') && !lockOut;
  
  return(
    <ModelMedium
      button='Delete'
      title={`delete "${title}" permanently`}
      color='redT'
      icon='fa-minus-circle'
      lock={!auth}
    >
      <RemoveBatch
        entry={entry}
        title={title}
        check={check}
      />
    </ModelMedium>
  );   
};

export default RemoveBatchWrapper;  
      
const RemoveBatch = ({ entry, title, check })=> {
   
  function handleItemRemove(e) {
    this.cutItemGo.disabled = true;
    
    const check = window.confirm('Permanently Delete All Items??');
    
    if(check) {
      Meteor.call('deleteBatchItems', entry._id, (err, reply)=>{
        if(err) {
          console.log(err);
          toast.error('Server Error. see console');
        }
        if(reply) {
          toast.success('Items in BatchDB removed');
        }else{
          toast.warning('Records are In-Use or No Authorization');
        }
      });
    }
  }
  
  function handleTideRemove(e) {
    this.cutTideGo.disabled = true;

    const check = window.confirm('Permanently Delete All Times??');
    
    if(check) {
      Meteor.call('deleteBatchTide', entry._id, (err, reply)=>{
        if(err) {
          console.log(err);
          toast.error('Server Error. see console');
        }
        if(reply) {
          toast.success('Times in BatchDB removed');
        }else{
          toast.warning('Records are In-Use or No Authorization');
        }
      });
    }
  }
  
  function handleAllRemove(e) {
    e.preventDefault();
    this.cutAllGo.disabled = true;
    const confirm = this.confirmInput.value.trim();
    
    const check = window.confirm('Delete this User Forever??');
    
    if(check) {
      
      Meteor.call('deleteWholeBatch', entry._id, confirm, (err, reply)=>{
        err && console.log(err);
        if(reply === 'inUse') {
          toast.warning('Cannot do this, records are in use');
        }else if(reply) {
          FlowRouter.go('/data/overview?request=batches');
          toast.success('Entry in BatchDB removed');
        }else{
          toast.error('Rejected by Server, No Authorization');
        }
      });
    }
  }
  
  let checkshort = check.split('T')[0];

  const et = entry;
  
  return(
    <div className='vspace wide'>
      <h2 className='centreText redT'>This cannot be undone</h2>
      
      <div className='vspace balancer cap'>
        <div>
          <p>Delete ALL {et.items.length} {Pref.items}</p>
          <button
            className='smallAction clearRed'
            type='button'
            onClick={(e)=>handleItemRemove(e)}
            id='cutItemGo'
            disabled={et.items.length === 0}
          >DELETE Items</button>
        </div>
        <div>
          <p>Delete ALL {et.tide.length} {Pref.tide}s</p>
          <button
            className='smallAction clearRed'
            type='button'
            onClick={(e)=>handleTideRemove(e)}
            id='cutTideGo'
            disabled={et.tide.length === 0}
          >DELETE Times</button>
        </div>
      </div>
      
      <hr />
      
      {et.tide.length === 0 && et.items.length === 0 ?
        !Roles.userIsInRole(Meteor.userId(), 'admin') ? 
          <p className='centreText'>
            <strong>An "Admin" account is required to delete the entire {Pref.batch}</strong>
          </p> 
        :
        <div>
          <p className='centreText'>
            <strong>Are you sure you want to try to delete all of "{title}"?</strong>
          </p>
          <dl>
            <dt>This includes:</dt>
            <dd>NonCons: {et.nonCon.length}</dd>
            <dd>Escaped: {et.escaped.length}</dd>
            <dd>Shortfalls: {et.shortfall.length}</dd>
            <dd>Blocks: {et.blocks.length}</dd>
            <dd>Releases: {et.releases.length}</dd>
            <dd>Alterations: {et.altered.length}</dd>
            <dd>Events: {et.events.length}</dd>
          </dl>
      
          <p>Enter "<i className='noCopy'>{checkshort + ' '}</i>" to confirm.</p>
          <br />
          <form onSubmit={(e)=>handleAllRemove(e)} className='inlineForm'>
            <input
              type='text'
              id='confirmInput'
              placeholder={checkshort}
              className='noCopy redIn'
              required />
            <button
              className='smallAction clearRed'
              type='submit'
              id='cutAllGo'
              disabled={false}>DELETE Whole {Pref.batch}</button>
          </form>
        </div>
      : 
        <p className='centreText'>
          <strong>{Pref.batch} cannot be deleted while there are recorded items or times</strong>
        </p>
      }
      
      <hr />
    </div>
  );
};