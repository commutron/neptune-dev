import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelMedium from '/client/components/smallUi/ModelMedium.jsx';

const RemoveXBatchWrapper = ({ batchData, seriesData, check, lockOut })=> {
  
  const auth = Roles.userIsInRole(Meteor.userId(), 'remove') && !lockOut;
  
  return(
    <ModelMedium
      button='Delete'
      title={`delete "${batchData.batch}" permanently`}
      color='redT'
      icon='fa-minus-circle'
      lock={!auth}
      // menuItem={true}
    >
      <RemoveXBatch
        batchData={batchData}
        seriesData={seriesData}
        checkStr={check}
      />
    </ModelMedium>
  );   
};

export default RemoveXBatchWrapper;  
      
const RemoveXBatch = ({ batchData, seriesData, checkStr })=> {
   
  function handleItemRemove(e) {
    this.cutItemGo.disabled = true;
    const srsID = seriesData && seriesData._id;
    
    const check = window.confirm('Permanently Delete All Items??');
    
    if(check && srsID) {
      Meteor.call('deleteSeriesItems', batchData._id, srsID, (err, reply)=>{
        if(err) {
          console.log(err);
          toast.error('Server Error. see console');
        }
        if(reply) {
          toast.success('Items of BatchDB removed');
        }else{
          toast.warning('Records are In-Use or No Authorization');
        }
      });
    }
  }
  
  function handleTideXRemove(e) {
    this.cutTideGo.disabled = true;

    const check = window.confirm('Permanently Delete All Times??');
    
    if(check) {
      Meteor.call('deleteXBatchTide', batchData._id, (err, reply)=>{
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
    
    const check = window.confirm(`Delete this ${Pref.xBatch} Forever??`);
    
    if(check) {
      
      Meteor.call('deleteWholeXBatch', batchData._id, confirm, (err, reply)=>{
        err && console.log(err);
        if(reply === 'inUse') {
          toast.warning('Cannot do this, records are in use');
        }else if(reply) {
          FlowRouter.go('/data');
          toast.success('Entry in BatchDB removed');
        }else{
          toast.error('Rejected by Server, No Authorization');
        }
      });
    }
  }
  
  let checkshort = checkStr.split('T')[0];
  const srsQ = !seriesData ? 0 : seriesData.items.length;
  
  return(
    <div className='vspace wide centreText'>
      <h2 className='redT'>This cannot be undone</h2>
      
      <div className='vspace balancer cap'>
        <div>
          <p>Delete ALL {srsQ} {Pref.items}</p>
          <button
            className='smallAction clearRed'
            type='button'
            onClick={(e)=>handleItemRemove(e)}
            id='cutItemGo'
            disabled={srsQ === 0}
          >DELETE Items</button>
        </div>
        <div>
          <p>Delete ALL {batchData.tide.length} {Pref.tide}s</p>
          <button
            className='smallAction clearRed'
            type='button'
            onClick={(e)=>handleTideXRemove(e)}
            id='cutTideGo'
            disabled={batchData.tide.length === 0}
          >DELETE Times</button>
        </div>
      </div>
      
      <hr />
      
      {batchData.tide.length === 0 && srsQ === 0 ?
        !Roles.userIsInRole(Meteor.userId(), 'admin') ? 
          <p>
            <strong>An "Admin" account is required to delete the entire {Pref.xBatch}</strong>
          </p> 
        :
        <div>
        
          <p>
            <strong>Are you sure you want to try to delete all of "{batchData.batch}"?</strong>
          </p>
          <p className='vspace max500'
            >Including: NonCons ({!seriesData ? 0 : seriesData.nonCon.length}), 
            Shortfalls ({!seriesData ? 0 : seriesData.shortfall.length}), 
            Blocks ({batchData.blocks.length}), 
            Releases ({batchData.releases.length}), 
            Alterations ({batchData.altered.length}) and 
            Events ({batchData.events.length}).
          </p>
            {/*<dd>Escaped: {et.escaped.length}</dd>*/}
            
          <form onSubmit={(e)=>handleAllRemove(e)} className='inlineForm centre'>
            <label>
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
                disabled={false}>DELETE Entire {Pref.xBatch}
              </button>
              <br />Enter "<i className='noCopy'>{checkshort + ' '}</i>" to confirm.
            </label>
          </form>
        </div>
      : 
        <p>
          <strong>{Pref.XBatch} cannot be deleted while there are recorded times or item history</strong>
        </p>
      }
      
      <hr />
    </div>
  );
};