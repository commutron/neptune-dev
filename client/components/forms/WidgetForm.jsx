import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelNative from '/client/layouts/Models/ModelNative';

const WidgetNew = ({ groupId, clearOnClose })=> {

  function saveNewWidget() {
    this.goSvNwWg.disabled = true;
    const newName = this.nwNm.value.trim().toLowerCase();
    const desc = this.prodiption.value.trim();
    
    Meteor.call('addNewWidget', newName, groupId, desc, (error, reply)=>{
      error && console.log(error);
      if(reply) {
        FlowRouter.go('/data/widget?request=' + newName);
      }else{
        toast.error('Server Error');
        this.goSvNwWg.disabled = false;
      }
    });
  }

  return(
    <ModelNative
      dialogId={'multi_widget_new_form'}
      title={`New ${Pref.widget}`}
      icon='fa-solid fa-cube'
      colorT='blueT'
      closeFunc={clearOnClose}>
      
      <form className='fitWide' onSubmit={(e)=>saveNewWidget(e)} disabled={!groupId}>
        <p>
          <input
            type='text'
            id='nwNm'
            placeholder='ID ie. A4-R-0221'
            pattern='[A-Za-z0-9 _\-]*'
            autoFocus={true}
            required />
          <label htmlFor='nwNm'>{Pref.widget} ID</label>
        </p>
        <p>
          <input
            type='text'
            id='prodiption'
            placeholder='Description ie. CRC Display'
            className='wide min300'
            required />
          <label htmlFor='prodiption'>{Pref.widget} Description</label>
        </p>
        <span className='centre'>
          <button
            type='submit'
            formMethod='dialog'
            className='action nSolid'
            id='goSvNwWg'
            disabled={false}>SAVE</button>
        </span>
      </form>
    </ModelNative>
  );
};

export default WidgetNew;

export const WidgetEdit = ({ id, now })=> {

  function saveEditWidget() {
    const newName = this.edtNm.value.trim().toLowerCase();
    const desc = this.prodiption.value.trim();

    Meteor.call('editWidget', id, newName, desc, (error, reply)=>{
      error && console.log(error);
      if(reply) {
        FlowRouter.go('/data/widget?request=' + newName);
        toast.success('Saved');
      }else{
        toast.error('Server Error');
      }
    });
  }

  return(
    <ModelNative
      dialogId={id+'_widget_edit_form'}
      title={`Edit ${Pref.widget}`}
      icon='fa-solid fa-cube'
      colorT='blueT'>
      
    <form className='fitWide' onSubmit={(e)=>saveEditWidget(e)}>
      <p>
        <input
          type='text'
          id='edtNm'
          defaultValue={now.widget}
          placeholder='ID ie. A4-R-0221'
          pattern='[A-Za-z0-9 _\-]*'
          autoFocus={true}
          required />
        <label htmlFor='edtNm'>{Pref.widget} ID</label>
      </p>
      <p>
        <input
          type='text'
          id='prodiption'
          defaultValue={now.describe}
          placeholder='Description ie. CRC Display'
          className='dbbleWide'
          required />
        <label htmlFor='prodiption'>{Pref.widget} Description</label>
      </p>
      <span className='centre'>
        <button
          type='submit'
          formMethod='dialog'
          className='action nSolid'
        >SAVE</button>
      </span>
    </form>
    </ModelNative>
  );
};