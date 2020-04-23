import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import Model from '../smallUi/Model.jsx';
// requires
// widgetData={widgetData} end={a.lastTrack} rootWI={a.instruct}

const VersionForm = (props)=> {

  // const [ instructState, instructSet ] = useState( '...' );

  function save(e) {
    e.preventDefault();
    this.go.disabled = true;
    const wId = props.widgetData._id;
    
    const edit = props.versionData;
    const vKey = edit ? edit.versionKey : false;
    
    const version = this.rev.value.trim();
    const live = this.live ? this.live.checked : false;
    const wiki = this.wikdress.value.trim().toLowerCase();
    const unit = this.unit.value.trim();
    
    if(edit) {
      Meteor.call('editVersion', wId, vKey, version, live, wiki, unit, (error, reply)=>{
        error && console.log(error);
        if(reply) {
          toast.success('Saved');
          FlowRouter.go('/data/widget?request=' + props.widgetData.widget + '&specify=' + version);
        }else{
          toast.error('Server Error');
          this.go.disabled = false;
        }
      });
    }else{
      Meteor.call('addVersion', wId, version, wiki, unit, (error, reply)=>{
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
    
  const app = props.app;
  
  let e = props.versionData;
  let name = e ? `edit ${Pref.version}` : `new ${Pref.version}`;
  let eV = e ? e.version : null;
  let eU = e ? e.units : null;
  let eL = e ? e.live : null;
  
  const instruct = !e ? app.instruct : e.wiki;

  return (
    <Model
      button={name}
      title={name}
      color='greenT'
      icon='fa-cube fa-rotate-90'
      smIcon={props.small}
      lock={!Roles.userIsInRole(Meteor.userId(), ['create', 'edit'])}
      noText={props.noText}>

      <div className='split'>
  
        <div className='half space edit'>
          <form onSubmit={(e)=>save(e)}>
            <p>
              <input
                type='text'
                id='widgetId'
                defaultValue={props.widgetData.widget}
                className='wide'
                disabled={true} />
              <label htmlFor='widgetId'>{Pref.widget} ID</label>
            </p>
            <p>
              <input
                type='text'
                id='prodiption'
                defaultValue={props.widgetData.describe}
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
              <label htmlFor='rev'>Version</label>
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
                <label htmlFor='live'>{Pref.live} {Pref.widget}</label>
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

export default VersionForm;
