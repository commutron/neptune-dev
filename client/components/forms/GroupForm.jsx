import React, {Component} from 'react';
import Pref from '/client/global/pref.js';
import Alert from '/client/global/alert.js';

import Model from '../smallUi/Model.jsx';
import {Submit} from './Inputs.jsx';

export default class GroupForm extends Component {

    createCustomer(e) {
      e.preventDefault();
      const groupName = this.refs.gName.value.trim().toLowerCase();
      const groupAlias = this.refs.gAlias.value.trim().toLowerCase();
      const groupId = this.props.id;
      
      
      function create(groupName, groupAlias) {
        //check for existing Group
        if(GroupDB.findOne({group: groupName}) || GroupDB.findOne({alias: groupAlias})) {
          Bert.alert({
            title: 'Duplicate',
            message: Pref.group + ' name or abbreviation already exists. Pick a unique name.',
            type: 'carrot',
            style: 'fixed-bottom',
            icon: 'fa-ban'});
        }else{
          Meteor.call('addGroup', groupName, groupAlias, (error, reply)=>{
            if(error)
             console.log(error);
            if(reply) {
              Bert.alert(Alert.success);
              Session.set('now', groupName);
            }else{
              Bert.alert(Alert.danger);
            }
          });
        }
      }
      
      
      function edit(groupId, groupName, groupAlias) {
        Meteor.call('editGroup', groupId, groupName, groupAlias, (error, reply)=>{
          if(error)
            console.log(error);
          if(reply) {
            Bert.alert(Alert.success);
            Session.set('now', groupName);
          }else{
            Bert.alert(Alert.warning);
          }
        });
      }
      
      /////////Selection/////////
      
      if(this.props.name === 'new') {
        create(groupName, groupAlias);
      }else{
        edit(groupId, groupName, groupAlias);
      }
      
    }
  

  render() {
    
    const orName = this.props.name === 'new' ? '' : this.props.name;
    const orAlias = this.props.alias === 'new' ? '' : this.props.alias;
    const title = this.props.name === 'new' ? 'create new' : 'edit';

    return (
      <Model
        button={title + ' ' + Pref.group}
        title={title + ' ' + Pref.group}
        type='action clear greenT'
        lock={!Meteor.user().power}>
        <form id='new' className='centre' onSubmit={this.createCustomer.bind(this)}>
          <p><label htmlFor='newName'>Full Name</label><br />
            <input
              type='text'
              id='newName'
              ref='gName'
              defaultValue={orName}
              placeholder='ie. Trailer Safegaurd'
              autoFocus='true'
              required />
          </p>
          <p><label htmlFor='newAlias'>Abbreviation / Alias</label><br />
            <input
              type='text'
              id='newAlias'
              ref='gAlias'
              defaultValue={orAlias}
              placeholder='ie. TSG'
              required />
          </p>
          <br />
          <Submit name='Create' type='action' />
        </form>
      </Model>
    );
  }
}