import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelSmall from '/client/components/smallUi/ModelSmall';

const SeriesCreate = ({ batchData, lock, noText })=> {
  const access = Roles.userIsInRole(Meteor.userId(), 'run');
  const aT = !access ? Pref.norole : '';
  const lT = lock ? `${Pref.series} has been added` : '';
  const title = access && !lock ? `Add ${Pref.series}` : `${aT}\n${lT}`;
  return(
    <ModelSmall
      button={`Add ${Pref.series}`}
      title={title}
      color='blueT'
      icon='fa-layer-group'
      lock={!access || lock}
      noText={noText}>
      <SeriesCreateForm batchData={batchData} />
    </ModelSmall>
  );
};
      
      
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
        selfclose();
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
      <dd>Process {Pref.nonCons} and Part {Pref.shortfalls}</dd>
      
      <p className='centreText'>
        <button
          type='submit'
          id='goSRS'
          onClick={(e)=>save(e)}
          disabled={false}
          className='action clearBlue'
        >Create</button>
      </p>
    </div>
  );
};

export default SeriesCreate;

export const SeriesDelete = ({ batchId, seriesId })=> {
  const access = Roles.userIsInRole(Meteor.userId(), 'run');
  const aT = !access ? Pref.norole : '';
  const title = access ? `Delete ${Pref.series}` : aT;
  return(
    <ModelSmall
      button={`Delete ${Pref.series}`}
      title={title}
      color='redT'
      icon='fa-trash'
      lock={!access}
      lgIcon={true}>
      <SeriesRemoveForm 
        batchId={batchId}
        seriesId={seriesId} />
    </ModelSmall>
  );
};
      

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
    <div>
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
    </div>
  );
};