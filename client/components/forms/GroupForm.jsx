import React, {Component} from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import Model from '../smallUi/Model.jsx';
import {Submit} from './Inputs.jsx';

export default class GroupForm extends Component {

    createCustomer(e) {
      e.preventDefault();
      const groupId = this.props.id;
      const groupName = this.gName.value.trim();
      const groupAlias = this.gAlias.value.trim().toLowerCase();
      const groupWiki = this.gWiki.value.trim();
      
      function create(groupName, groupAlias, groupWiki) {
        Meteor.call('addGroup', groupName, groupAlias, groupWiki, (error, reply)=>{
          if(error)
           console.log(error);
          if(reply) {
            toast.success('Saved');
            //Session.set('now', groupName);
            FlowRouter.go('/data/group?request=' + groupAlias);
          }else{
            toast.error('Server Error');
          }
        });
      }
      
      function edit(groupId, groupName, groupAlias, groupWiki) {
        Meteor.call('editGroup', groupId, groupName, groupAlias, groupWiki, (error, reply)=>{
          if(error)
            console.log(error);
          if(reply) {
            toast.success('Saved');
            //Session.set('now', groupName);
            FlowRouter.go('/data/group?request=' + groupAlias);
          }else{
            toast.error('Server Error');
          }
        });
      }
      
      /////////Selection/////////
      if(this.props.name === false) {
        create(groupName, groupAlias, groupWiki);
      }else{
        edit(groupId, groupName, groupAlias, groupWiki);
      }
      
    }
  

  render() {
    
    const orName = this.props.name ? this.props.name : '';
    const orAlias = this.props.alias ? this.props.alias : '';
    const orWiki = this.props.wiki ? this.props.wiki : '';
    const bttn = this.props.name ? 'edit ' + Pref.group : 'new';
    const title = this.props.name ? 'edit' : 'create new';

    return (
      <Model
        button={bttn}
        title={title + ' ' + Pref.group}
        color='greenT'
        icon='fa-users'
        lock={!Roles.userIsInRole(Meteor.userId(), ['create', 'edit'])}
        noText={this.props.noText}
        primeTopRight={this.props.primeTopRight}>
        <form id='new' className='centre' onSubmit={this.createCustomer.bind(this)}>
          <p>
            <input
              type='text'
              id='newName'
              ref={(i)=> this.gName = i}
              defaultValue={orName}
              placeholder='ie. Trailer Safegaurd'
              autoFocus='true'
              required />
            <label htmlFor='newName'>Full Name</label>
          </p>
          <p>
            <input
              type='text'
              id='newAlias'
              ref={(i)=> this.gAlias = i}
              defaultValue={orAlias}
              placeholder='ie. TSG'
              required />
            <label htmlFor='newAlias'>Abbreviation / Alias</label>
          </p>
          <p>
            <input
              type='url'
              id='newWiki'
              ref={(i)=> this.gWiki = i}
              defaultValue={orWiki}
              placeholder='http://192.168.1.68/dokuwiki'
              required />
            <label htmlFor='newAlias' className='cap'>{Pref.group} {Pref.instruct} index</label>
          </p>
          <br />
          <Submit name={title} type='action' />
        </form>
      </Model>
    );
  }
}