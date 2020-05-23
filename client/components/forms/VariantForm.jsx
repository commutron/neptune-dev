import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import Model from '../smallUi/Model.jsx';

const VariantForm = ({ widgetData, variantData, app, rootWI })=> {

  // const [ instructState, instructSet ] = useState( '...' );

  function save(e) {
    e.preventDefault();
    this.go.disabled = true;
    const wId = widgetData._id;
    const gId = widgetData.groupId;
    
    const edit = variantData;
    const vId = edit ? variantData._id : false;
    
    const variant = this.rev.value.trim();
    const live = this.live ? this.live.checked : false;
    const wiki = this.wikdress.value.trim().toLowerCase();
    const unit = this.unit.value.trim();
    
    if(edit) {
      Meteor.call('editVariant', wId, vId, variant, live, wiki, unit, (error, reply)=>{
        error && console.log(error);
        if(reply) {
          toast.success('Saved');
          FlowRouter.go('/data/widget?request=' + widgetData.widget + '&specify=' + variant);
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
  let name = e ? `edit ${Pref.variant}` : `new ${Pref.variant}`;
  let eV = e ? e.variant : null;
  let eU = e ? e.runUnits : null;
  let eL = e ? e.live : null;
  
  const instruct = !e ? app.instruct : e.instruct;

  return (
    <Model
      button={name}
      title={name}
      color='greenT'
      icon='fa-cube fa-rotate-90'
      lock={!Roles.userIsInRole(Meteor.userId(), ['create', 'edit'])}>

      <div className='split'>
  
        <div className='half space edit'>
          <form onSubmit={(e)=>save(e)}>
            <p>
              <input
                type='text'
                id='widgetId'
                defaultValue={widgetData.widget}
                className='wide'
                disabled={true} />
              <label htmlFor='widgetId'>{Pref.widget} ID</label>
            </p>
            <p>
              <input
                type='text'
                id='prodiption'
                defaultValue={widgetData.describe}
                className='wide'
                disabled={true} />
              <label htmlFor='prodiption'>{Pref.widget} Description</label>
            </p>
            <p>
              <input
                type='text'
                id='rev'
                defaultValue={eV}
                placeholder='1a'
                inputMode='numeric'
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
            <br />
            {e ?
              <fieldset>
                <input
                  type='checkbox'
                  id='live'
                  defaultChecked={eL} />
                <label htmlFor='live'>{Pref.live} {Pref.variant}</label>
              </fieldset>
            : null}
            <br />
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
    </Model>
  );
};

export default VariantForm;
