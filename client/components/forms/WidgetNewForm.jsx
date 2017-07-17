import React, {Component} from 'react';
import Pref from '/client/global/pref.js';
import Alert from '/client/global/alert.js';

import Model from '../smallUi/Model.jsx';

// requires
// groupId={g._id} end={this.props.end} rootWI={this.props.rootWI}

export default class WidgetNewForm extends Component	{

  constructor() {
    super();
    this.state = {
      instruct: '...'
   };
  }

//// This is not functioning. Gets blocked for security \\\\
  pullOver() {
    this.setState({instruct: document.getElementById('instruct').contentWindow.location.href});
  }

  save(e) {
    e.preventDefault();
    this.go.disabled = true;
    const groupId = this.props.groupId;
    const newName = this.nwNm.value.trim().toLowerCase();
    const desc = this.des.value.trim().toLowerCase();
    const version = this.rev.value.trim();
    const wiki = this.wiki.value.trim().toLowerCase();
    const unit = this.unit.value.trim();
    const end = this.props.end;

    
    Meteor.call('addNewWidget', newName, groupId, desc, version, wiki, unit, end, (error, reply)=>{
      if(error)
        console.log(error);
      if(reply) {
        Bert.alert(Alert.success);
        Session.set('now', newName);
      }else{
        Bert.alert(Alert.warning);
        this.go.disabled = false;
      }
    });

  }

  render() {

    return (
      <Model
        button={'new ' + Pref.widget}
        title={'new ' + Pref.widget}
        lock={!Roles.userIsInRole(Meteor.userId(), 'create')}>

      <div className='split'>

        <div className='half space edit'>
          <form onSubmit={this.save.bind(this)}>
            <p>
              <input
                type='text'
                id='widgetId'
                ref={(i)=> this.nwNm = i}
                placeholder='ID ie. A4-R-0221'
                autoFocus='true'
                required />
              <label htmlFor='widgetId'>{Pref.widget} ID</label>
            </p>
            <p>
              <input
                type='text'
                id='prodiption'
                ref={(i)=> this.des = i}
                placeholder='Description ie. CRC Display'
                required />
              <label htmlFor='prodiption'>{Pref.widget} Description</label>
            </p>
            <p>
              <input
                type='text'
                ref={(i)=> this.rev = i}
                id='rv'
                placeholder='1a'
                inputMode='numeric'
                required />
              <label htmlFor='rv'>Version</label>
            </p>
            <p>
              <input
                type='number'
                ref={(i)=> this.unit = i}
                id='cln'
                pattern='[000-999]*'
                maxLength='3'
                minLength='1'
                max='100'
                min='1'
                defaultValue='1'
                placeholder='1-100'
                inputMode='numeric'
                required />
              <label htmlFor='cln'>{Pref.unit} Quantity</label>
            </p>
            <hr />
            <p>
              <input
                type='url'
                id='wikdress'
                ref={(i)=> this.wiki = i}
                defaultValue={this.props.rootWI}
                placeholder='Full Address'
                required />{/*this.state.instruct*/}
              <label htmlFor='wikdress'>Work Instructions</label>
            </p>
            <br />
            <button
              type='submit'
              className='action clear greenT'
              ref={(i) => this.go = i}
              disabled={false}>SAVE</button>
          </form>
        </div>

        <div className='half'>
          <iframe
            id='instructMini'
            src={this.props.rootWI}
            height='600'
            width='100%' />
          <br />
          <button className='smallAction clear' onClick={this.pullOver} disabled>use this page</button>
          <i className='redT'>blocked for security</i>
        </div>

      </div>
    </Model>
    );
  }
}