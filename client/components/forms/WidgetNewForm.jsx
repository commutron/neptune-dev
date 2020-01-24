import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import Model from '../smallUi/Model.jsx';

// requires
// groupId={g._id} end={this.props.end} rootWI={this.props.rootWI}

const WidgetNewForm = (props)=> {

  // const [ instruct, instructSet ] = useState( '...' );

  function save(e) {
    e.preventDefault();
    this.go.disabled = true;
    const groupId = props.groupId;
    const newName = this.nwNm.value.trim().toLowerCase();
    const desc = this.prodiption.value.trim();
    const version = this.rev.value.trim();
    const wiki = this.wikdress.value.trim().toLowerCase();
    const unit = this.unit.value.trim();
    const endTrack = props.end;
    
    Meteor.call('addNewWidget', newName, groupId, desc, version, wiki, unit, endTrack, (error, reply)=>{
      error && console.log(error);
      if(reply) {
        toast.success('Saved');
        FlowRouter.go('/data/widget?request=' + newName);
      }else{
        toast.error('Server Error');
        this.go.disabled = false;
      }
    });
  }

  return(
    <Model
      button={'new ' + Pref.widget}
      title={'new ' + Pref.widget}
      color='greenT'
      icon='fa-cube'
      lock={!Roles.userIsInRole(Meteor.userId(), 'create')}
      noText={props.noText}>

    <div className='split'>

      <div className='half space edit'>
        <form onSubmit={(e)=>save(e)}>
          <p>
            <input
              type='text'
              id='nwNm'
              placeholder='ID ie. A4-R-0221'
              className='wide'
              autoFocus={true}
              required />
            <label htmlFor='nwNm'>{Pref.widget} ID</label>
          </p>
          <p>
            <input
              type='text'
              id='prodiption'
              placeholder='Description ie. CRC Display'
              className='wide'
              required />
            <label htmlFor='prodiption'>{Pref.widget} Description</label>
          </p>
          <p>
            <input
              type='text'
              id='rev'
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
              pattern='[000-999]*'
              maxLength='3'
              minLength='1'
              max='100'
              min='1'
              defaultValue='1'
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
              placeholder='Full Address'
              className='wide'
              required />{/*instruct*/}
            <label htmlFor='wikdress'>Work Instructions</label>
          </p>
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
          src={props.rootWI}
          height='600'
          width='100%' />
      </div>

    </div>
  </Model>
  );
};

export default WidgetNewForm;