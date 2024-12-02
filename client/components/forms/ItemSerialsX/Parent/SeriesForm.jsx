import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelNative from '/client/layouts/Models/ModelNative';

const SeriesCreate = ({ batchData, access })=> {

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
        // selfclose();
      }else{
        toast.error('Server Error');
        this.goSRS.disabled = false;
      }
    });
  }
  
  return(
    <ModelNative
      dialogId={batchData._id+'_series_form'}
      title={`Add ${Pref.series}`}
      icon='fa-solid fa-layer-group'
      colorT='blueT'>
      
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
          className='action nSolid'
        >Create</button>
      </p>
    </div>
    </ModelNative>
  );
};

export default SeriesCreate;

export const SeriesDelete = ({ batchId, seriesId, srs })=> {

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
  
  const emptySRS = srs.items.length === 0 &&
                   srs.nonCon.length === 0 &&
                   srs.shortfall.length === 0;
  
  return(
    <ModelNative
      dialogId={batchId+'_seriesdelete_form'}
      title={`Remove Empty ${Pref.series}`}
      icon='fa-regular fa-trash-can'
      colorT='redT'>
      
    <div>
      <h4>Removing the Series will remove individual item tracking by serial number</h4>
      
      <p className='centreText'>
        <button
          type='submit'
          id='noSRS'
          onClick={(e)=>doRemove(e)}
          disabled={!emptySRS}
          className='action redSolid'
        >Delete Series</button>
      </p>
    </div>
    </ModelNative>
  );
};