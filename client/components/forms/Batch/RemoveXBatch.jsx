import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelMedium from '/client/components/smallUi/ModelMedium.jsx';

const RemoveXBatchWrapper = ({ batchData, seriesData, check, lock })=> {
  
  const access = Roles.userIsInRole(Meteor.userId(), 'remove');
  const aT = !access ? Pref.norole : '';
  const lT = lock ? lock : '';
  const title = access && !lock ? `Delete "${batchData.batch}" permanently` : `${aT}\n${lT}`;
  
  return(
    <ModelMedium
      button='Delete'
      title={title}
      color='redT'
      icon='fa-minus-circle'
      lock={!access || lock}
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
    const pinVal = this.orgPINitem.value;
    
    const check = window.confirm('Permanently Delete All Items??');
    
    if(check && srsID) {
      Meteor.call('deleteSeriesItems', batchData._id, srsID, pinVal, (err, reply)=>{
        if(err) {
          console.log(err);
          toast.error('Server Error. see console');
        }
        if(reply) {
          toast.success('Items of XSeriesDB removed');
        }else{
          toast.warning('Records are In-Use or No Authorization');
          this.cutItemGo.disabled = false;
        }
      });
    }
  }
  
  function handleProbRemove(e) {
    this.cutProbGo.disabled = true;
    const srsID = seriesData && seriesData._id;
    const pinVal = this.orgPINprob.value;
    
    const check = window.confirm(`Permanently Delete All ${Pref.nonCons} & ${Pref.shortfalls}??`);
    
    if(check && srsID) {
      Meteor.call('deleteSeriesProblems', batchData._id, srsID, pinVal, (err, reply)=>{
        if(err) {
          console.log(err);
          toast.error('Server Error. see console');
        }
        if(reply) {
          toast.success('nonCon & shortfall of XSeriesDB removed');
        }else{
          toast.warning('Records are In-Use or No Authorization');
          this.cutProbGo.disabled = false;
        }
      });
    }
  }
  
  function handleFallRemove(e) {
    this.cutFallGo.disabled = true;
    const pinVal = this.orgPINfall.value;
    
    const check = window.confirm('Permanently Delete All Waterfall Counters??');
    
    if(check) {
      Meteor.call('deleteXBatchFall', batchData._id, pinVal, (err, reply)=>{
        if(err) {
          console.log(err);
          toast.error('Server Error. see console');
        }
        if(reply) {
          toast.success('Waterfall of XBatchDB removed');
        }else{
          toast.warning('Records are In-Use or No Authorization');
          this.cutFallGo.disabled = false;
        }
      });
    }
  }
  
  function handleTideXRemove(e) {
    this.cutTideGo.disabled = true;
    const pinVal = this.orgPINtime.value;
    
    const check = window.confirm('Permanently Delete All Times??');
    
    if(check) {
      Meteor.call('deleteXBatchTide', batchData._id, pinVal, (err, reply)=>{
        if(err) {
          console.log(err);
          toast.error('Server Error. see console');
        }
        if(reply) {
          toast.success('Times in XBatchDB removed');
        }else{
          toast.warning('Records are In-Use or No Authorization');
          this.cutTideGo.disabled = false;
        }
      });
    }
  }
  
  function handleAllRemove(e) {
    e.preventDefault();
    this.cutAllGo.disabled = true;
    const pinVal = this.orgPINall.value;
    
    const confirm = this.confirmInput.value.trim();
    
    const check = window.confirm(`Delete this ${Pref.xBatch} Forever??`);
    
    if(check) {
      
      Meteor.call('deleteWholeXBatch', batchData._id, confirm, pinVal, (err, reply)=>{
        err && console.log(err);
        if(reply === 'inUse') {
          toast.warning('Cannot do this, records are in use');
        }else if(reply) {
          FlowRouter.go('/data');
          toast.success('Entry in XBatchDB removed');
        }else{
          toast.error('Rejected by Server, No Authorization');
          this.cutAllGo.disabled = false;
        }
      });
    }
  }
  
  let checkshort = checkStr.split('T')[0];
  const itemsQ = !seriesData ? 0 : seriesData.items.length;
  const probsQ = !seriesData ? 0 : seriesData.nonCon.length +
                                  seriesData.shortfall.length;
  
  return(
    <div className='vspace wide centreText'>
      <h2 className='redT up'>This cannot be undone</h2>
      
      <div className='vspace balancer gapsC cap'>
        <div>
          <p>Delete ALL {itemsQ}<br />{Pref.items}</p>
          <input
            id='orgPINitem'
            autoComplete="false"
            className='noCopy miniIn12 interSelect centreText gap redIn clearRed'
            pattern='[\d\d\d\d]*'
            maxLength='4'
            minLength='4'
            placeholder='PIN'
            required />
          <br />
          <button
            className='smallAction clearRed'
            type='button'
            onClick={(e)=>handleItemRemove(e)}
            id='cutItemGo'
            disabled={itemsQ === 0}
          >DELETE Items</button>
        </div>
        
        <div>
          <p>Delete ALL {probsQ}<br />{Pref.nonCons} & {Pref.shortfalls}</p>
          <input
            id='orgPINprob'
            autoComplete="false"
            className='noCopy miniIn12 interSelect centreText gap redIn clearRed'
            pattern='[\d\d\d\d]*'
            maxLength='4'
            minLength='4'
            placeholder='PIN'
            required />
          <br />
          <button
            className='smallAction clearRed'
            type='button'
            onClick={(e)=>handleProbRemove(e)}
            id='cutProbGo'
            disabled={probsQ === 0}
          >DELETE Problems</button>
        </div>
        
        <div>
          <p>Delete ALL {batchData.waterfall.length}<br />{Pref.counter}s</p>
          <input
            id='orgPINfall'
            autoComplete="false"
            className='noCopy miniIn12 interSelect centreText gap redIn clearRed'
            pattern='[\d\d\d\d]*'
            maxLength='4'
            minLength='4'
            placeholder='PIN'
            required />
          <br />
          <button
            className='smallAction clearRed'
            type='button'
            onClick={(e)=>handleFallRemove(e)}
            id='cutFallGo'
            disabled={batchData.waterfall.length === 0}
          >DELETE Counts</button>
        </div>
        
        <div>
          <p>Delete ALL {batchData.tide.length}<br />{Pref.tide}s</p>
          <input
            id='orgPINtime'
            autoComplete="false"
            className='noCopy miniIn12 interSelect centreText gap redIn clearRed'
            pattern='[\d\d\d\d]*'
            maxLength='4'
            minLength='4'
            placeholder='PIN'
            required />
          <br />
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
      
      {batchData.tide.length === 0 &&
       batchData.waterfall.length === 0 && 
       itemsQ === 0 && probsQ === 0 ?
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
          
          <p>Enter "<i className='noCopy'>{checkshort + ' '}</i>" and PIN to confirm.</p>
          
          <form onSubmit={(e)=>handleAllRemove(e)} className='inlineForm centreRow'>
            <input
              type='text'
              id='confirmInput'
              placeholder={checkshort}
              className='noCopy miniIn12 interSelect centreText gap redHover'
              required />
            <input
              id='orgPINall'
              autoComplete="false"
              className='noCopy miniIn12 interSelect centreText gap redHover'
              pattern='[\d\d\d\d]*'
              maxLength='4'
              minLength='4'
              placeholder='PIN'
              required />
            <button
              className='smallAction clearRed'
              type='submit'
              id='cutAllGo'
              disabled={false}>DELETE Entire {Pref.xBatch}
            </button>
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