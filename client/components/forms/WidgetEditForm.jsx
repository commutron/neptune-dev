import React, {Component} from 'react';
import Pref from '/client/global/pref.js';
import Alert from '/client/global/alert.js';

import Model from '../smallUi/Model.jsx';

// requires
// id={widget._id} now={widget}

export default class WidgetEditForm extends Component	{

  save(e) {
    e.preventDefault();
    const wId = this.props.id;
    const newName = this.refs.nwNm.value.trim().toLowerCase();
    const desc = this.refs.des.value.trim().toLowerCase();

    Meteor.call('editWidget', wId, newName, desc, (error, reply)=>{
      if(error)
        console.log(error);
      if(reply) {
        Bert.alert(Alert.success);
        Session.set('now', newName);
      }else{
        Bert.alert(Alert.warning);
      }
    });

  }

  render() {

    const now = this.props.now;

    return (
      <Model
        button={'Edit ' + Pref.widget}
        title={'Edit ' + Pref.widget}
        lock={!Meteor.user().power}>
        <form className='centre' onSubmit={this.save.bind(this)}>
          <p><label htmlFor='widgetId'>{Pref.widget} ID</label><br />
            <input
              type='text'
              id='widgetId'
              ref='nwNm'
              defaultValue={now.widget}
              placeholder='ID ie. A4-R-0221'
              autoFocus='true'
              required />
          </p>
          <p><label htmlFor='prodiption'>{Pref.widget} Description</label><br />
            <input
              type='text'
              id='prodiption'
              ref='des'
              defaultValue={now.describe}
              placeholder='Description ie. CRC Display'
              required />
          </p>
          <br />
          <button type='submit' className='action clear greenT'>SAVE</button>
        </form>
      </Model>
    );
  }
}