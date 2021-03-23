import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelLarge from '../smallUi/ModelLarge';

const VariantModel = ({ widgetData, variantData, app, rootWI, lockOut })=> {
  
  let name = variantData ? `edit ${Pref.variant}` : `new ${Pref.variant}`;
  
  return(
    <ModelLarge
      button={name}
      title={name}
      color='greenT'
      icon='fa-cube fa-rotate-90'
      lock={!Roles.userIsInRole(Meteor.userId(), ['create', 'edit']) || lockOut}>
      
      <VariantForm
        widgetData={widgetData}
        variantData={variantData}
        app={app}
        rootWI={rootWI}
      />
    </ModelLarge>
  );
};
  
export default VariantModel;

const VariantForm = ({ widgetData, variantData, app, rootWI, lockOut, selfclose })=> {

  function save(e) {
    e.preventDefault();
    this.go.disabled = true;
    const wId = widgetData._id;
    const gId = widgetData.groupId;
    
    const edit = variantData;
    const vId = edit ? variantData._id : false;
    
    const variant = this.rev.value.trim();
    const wiki = this.wikdress.value.trim();
    const unit = this.unit.value.trim();
    
    if(edit) {
      Meteor.call('editVariant', wId, vId, variant, wiki, unit, (error, reply)=>{
        error && console.log(error);
        if(reply) {
          toast.success('Saved');
          selfclose();
        }else{
          toast.error('Server Error');
          this.go.disabled = false;
        }
      });
    }else{
      Meteor.call('addNewVariant', wId, gId, variant, wiki, unit, (error, reply)=>{
        error && console.log(error);
        if(reply) {
          toast.success('Saved');
        }else{
          toast.error('Server Error');
          this.go.disabled = false;
        }
      });
    }
  }
  
  let e = variantData;
  let eV = e ? e.variant : null;
  let eU = e ? e.runUnits : null;
  
  const instruct = !e ? app.instruct : e.instruct;

  return (
    <div className='split'>

      <div className='half space edit'>
        <h2 className='up'>{widgetData.widget}</h2>
        <h3>{widgetData.describe}</h3>
        
        <form onSubmit={(e)=>save(e)}>
          <p>
            <input
              type='text'
              id='rev'
              defaultValue={eV}
              placeholder='1a'
              pattern='[A-Za-z0-9 \._-]*'
              className='wide'
              required />
            <label htmlFor='rev'>{Pref.variant}</label>
          </p>
          <p>
            <input
              type='number'
              id='unit'
              pattern='[0-999]*'
              maxLength='3'
              minLength='1'
              max='100'
              min='1'
              defaultValue={eU}
              placeholder='1-100'
              inputMode='numeric'
              className='wide'
              required />
            <label htmlFor='unit'>{Pref.unit} Quantity</label>
          </p>
          <hr />
          <p>
            <input
              type='url'
              id='wikdress'
              defaultValue={instruct}
              placeholder='Full Address'
              className='wide' />{/*instructState*/}
            <label htmlFor='wikdress'>Work Instructions</label>
          </p>
          <button
            type='submit'
            className='action clearGreen'
            id='go'
            disabled={false}>SAVE</button>
        </form>
      </div>

      <div className='half'>
        <iframe
          id='instructMini'
          src={instruct}
          height='600'
          width='100%' />
      </div>
      
    </div>
  );
};