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
    const newName = this.refs.nwNm.value.trim().toLowerCase();
    const desc = this.refs.des.value.trim().toLowerCase();
    const version = this.refs.rev.value.trim();
    const wiki = this.refs.wiki.value.trim().toLowerCase();
    const unit = this.refs.unit.value.trim();
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
        lock={!Meteor.user().power}>

      <div className='split'>

        <div className='half space edit'>
          <form onSubmit={this.save.bind(this)}>
            <p><label htmlFor='widgetId'>{Pref.widget} ID</label><br />
              <input
                type='text'
                id='widgetId'
                ref='nwNm'
                placeholder='ID ie. A4-R-0221'
                autoFocus='true'
                required />
            </p>
            <p><label htmlFor='prodiption'>{Pref.widget} Description</label><br />
              <input
                type='text'
                id='prodiption'
                ref='des'
                placeholder='Description ie. CRC Display'
                required />
            </p>
            <p><label htmlFor='rv'>Version</label><br />
              <input
                type='text'
                ref='rev'
                id='rv'
                placeholder='1a'
                inputMode='numeric'
                required
              />
            </p>
            <p><label htmlFor='cln'>{Pref.unit} Quantity</label><br />
              <input
                type='number'
                ref='unit'
                id='cln'
                pattern='[000-999]*'
                maxLength='3'
                minLength='1'
                max='100'
                min='1'
                defaultValue='1'
                placeholder='1-100'
                inputMode='numeric'
                required
              />
            </p>
            <hr />
            <p><label htmlFor='wikdress'>Work Instructions</label><br />
              <input
                type='url'
                id='wikdress'
                ref='wiki'
                defaultValue={this.props.rootWI}
                placeholder='Full Address'
                required />{/*this.state.instruct*/}
            </p>
            <br />
            <button
              type='submit'
              className='action clear greenT'
              ref={(input) => this.go = input}
              disabled={false}>SAVE</button>
          </form>
        </div>

        <div className='half'>
          <iframe
            id='instructMini'
            src={this.props.rootWI}
            height='600'
            width='100%' /><br />
          <button className='smallAction clear' onClick={this.pullOver} disabled>use this page</button>
          <i className='redT'>blocked for security</i>
        </div>

      </div>
    </Model>
    );
  }
}