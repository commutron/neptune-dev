import React from 'react';
//import moment from 'moment';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelMedium from '../smallUi/ModelMedium.jsx';

// required data
/// batchId={b._id}
/// batchNow={b.batch}
/// versionNow={vKey}
/// versions={w.versions}
/// lock={!w.versions}

export const AlterFulfill = ({ batchId, end, lock })=> {

  function save(e) {
    e.preventDefault();
    
    const endDate = e.target.eDate.value;
    const reason = e.target.resn.value;

    Meteor.call('alterBatchFulfill', batchId, end, endDate, reason, (error, reply)=>{
      if(error) {
        console.log(error);
        toast.error('Server Error');
      }
      if(reply) {
        toast.success('Saved');
      }else{
        toast.warning('Not Saved');
      }
    });
  }
    
  return (
    <ModelMedium
      button={'Alter ' + Pref.end}
      title={`Alter ${Pref.batch} ${Pref.end}`}
      color='blueT'
      icon='fa-clock'
      smIcon={true}
      lock={!Roles.userIsInRole(Meteor.userId(), ['edit', 'sales']) || lock}
      noText={true}>
      <form className='centre' onSubmit={(e)=>save(e)}>
        <p>
          <label htmlFor='resn'>Reason for Change</label><br />
          <select
            id='resn'
            className='numberSet'
            required>
            <option value='Error Correction'>Error Correction</option>
            <option value='Customer Request'>Customer Request</option>
            <option value='Resource Shortage'>Resource Shortage</option>
          </select>
        </p>
        <p>
          <label htmlFor='eDate' className='breath'>{Pref.end}<br />
          <input
            type='date'
            id='eDate'
            className='numberSet'
            defaultValue={end}
            required 
          /></label>
        </p>
        <p><button type='submit' className='action clear greenHover'>Save</button></p>
      </form>
    </ModelMedium>
  );
};