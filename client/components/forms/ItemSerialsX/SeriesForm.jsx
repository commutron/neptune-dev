import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelSmall from '/client/components/smallUi/ModelSmall';

const SeriesCreate = ({ batchData, lock, noText })=> (
  <ModelSmall
    button={`Add ${Pref.series}`}
    title={`Add ${Pref.series}`}
    color='greenT'
    icon='fa-barcode'
    lock={!Roles.userIsInRole(Meteor.userId(), 'run') || lock}
    noText={noText}
    lgIcon={true}>
    <SeriesCreateForm batchData={batchData} />
  </ModelSmall>
);
      
      
const SeriesCreateForm = ({ batchData, selfclose })=> {

  function save(e) {
    this.goSRS.disabled = true;
    
    const batchId = batchData._id;
    const groupId = batchData.groupId;
    const widgetId = batchData.widgetId;
    const vKey = batchData.versionKey;
    
    Meteor.call('addSeries', batchId, groupId, widgetId, vKey, (error, reply)=>{
      error && console.log(error);
      if(reply) {
        toast.success('Saved');
      }else{
        toast.error('Server Error');
        this.goSRS.disabled = false;
      }
    });
  }
  
  return(
    <div>
      <h4>A Series enables individual item tracking by serial number</h4>
      <dt>Including:</dt>
      <dd>First-off, Build, Inspection and Test records</dd>
      <dd>Process Nonconformances and Part Shortfalls</dd>
      <dd>Customer Return handling</dd>
      
      <p className='centreText'>
        <button
          type='submit'
          id='goSRS'
          onClick={(e)=>save(e)}
          disabled={false}
          className='action clearGreen'
        >Create</button>
      </p>
    </div>
  );
};

export default SeriesCreate;

export const SeriesDelete = ({ batchId, seriesId, lock })=> (
  <ModelSmall
    button={`Delete ${Pref.series}`}
    title={`Delete ${Pref.series}`}
    color='redT'
    icon='fa-trash'
    lock={!Roles.userIsInRole(Meteor.userId(), 'run') || lock}
    lgIcon={true}>
    <SeriesRemoveForm 
      batchId={batchId}
      seriesId={seriesId} />
  </ModelSmall>
);
      

const SeriesRemoveForm = ({ batchId, seriesId, selfclose })=> {

  function doRemove(e) {
    this.noSRS.disabled = true;
    
    Meteor.call('deleteWholeSeries', batchId, seriesId, (error, reply)=>{
      error && console.log(error);
      if(reply) {
        toast.success('Saved');
      }else{
        toast.error('Server Error');
        this.noSRS.disabled = false;
      }
    });
  }
  
  return(
    <form onSubmit={(e)=>save(e)}>
      <h4>Removing the Series will remove individual item tracking by serial number</h4>
      <dt>Including:</dt>
      <dd>First-off, Build, Inspection and Test records</dd>
      <dd>Process Nonconformances and Part Shortfalls</dd>
      <dd>Customer Return handling</dd>
      
      <p className='centreText'>
        <button
          type='submit'
          id='noSRS'
          onClick={(e)=>doRemove(e)}
          disabled={false}
          className='action clearRed'
        >Delete Series</button>
      </p>
    </form>
  );
};