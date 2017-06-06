import React, {Component} from 'react';
import Pref from '/client/global/pref.js';
import Alert from '/client/global/alert.js';

import Model from '../smallUi/Model.jsx';
import {Submit} from './Inputs.jsx';

export default class GroupForm extends Component {

    createCustomer(e) {
      e.preventDefault();
      const groupName = this.gName.value.trim().toLowerCase();
      const groupAlias = this.gAlias.value.trim().toLowerCase();
      const groupId = this.props.id;
      
      
      function create(groupName, groupAlias) {
        Meteor.call('addGroup', groupName, groupAlias, (error, reply)=>{
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
        lock={!Roles.userIsInRole(Meteor.userId(), 'power')}>
        <form id='new' className='centre' onSubmit={this.createCustomer.bind(this)}>
          <p><label htmlFor='newName'>Full Name</label><br />
            <input
              type='text'
              id='newName'
              ref={(i)=> this.gName = i}
              defaultValue={orName}
              placeholder='ie. Trailer Safegaurd'
              autoFocus='true'
              required />
          </p>
          <p><label htmlFor='newAlias'>Abbreviation / Alias</label><br />
            <input
              type='text'
              id='newAlias'
              ref={(i)=> this.gAlias = i}
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