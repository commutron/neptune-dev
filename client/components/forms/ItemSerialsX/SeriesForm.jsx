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
    e.preventDefault();
    this.go.disabled = true;
    
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
        this.go.disabled = false;
      }
    });
  }
  
  return(
    <form onSubmit={(e)=>save(e)}>
      <h4>A Series will allow individual item tracking by serial number</h4>
      <dt>Including:</dt>
      <dd>First-off, Build, Inspection and Test records</dd>
      <dd>Process Nonconformances and Part Shortfalls</dd>
      <dd>Customer Return handling</dd>
      
      <p className='centreText'>
        <button
          type='submit'
          id='go'
          disabled={false}
          className='action clearGreen'
        >Create</button>
      </p>
    </form>
  );
};

export default SeriesCreate;