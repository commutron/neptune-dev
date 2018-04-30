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
    const newName = this.nwNm.value.trim().toLowerCase();
    const desc = this.des.value.trim();

    Meteor.call('editWidget', wId, newName, desc, (error, reply)=>{
      if(error)
        console.log(error);
      if(reply) {
        Bert.alert(Alert.success);
        //Session.set('now', newName);
        FlowRouter.go('/data/widget?request=' + newName);
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
        title={'edit ' + Pref.widget}
        color='greenT'
        icon='fa-cube'
        lock={!Roles.userIsInRole(Meteor.userId(), 'edit')}
        noText={this.props.noText}>
        <form className='centre' onSubmit={this.save.bind(this)}>
          <p>
            <input
              type='text'
              id='widgetId'
              ref={(i)=> this.nwNm = i}
              defaultValue={now.widget}
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
              defaultValue={now.describe}
              placeholder='Description ie. CRC Display'
              required />
            <label htmlFor='prodiption'>{Pref.widget} Description</label>
          </p>
          <br />
          <button type='submit' className='action clearGreen'>SAVE</button>
        </form>
      </Model>
    );
  }
}