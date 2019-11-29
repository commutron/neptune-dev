import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import Model from '../smallUi/Model.jsx';
import {Submit} from './Inputs.jsx';

const GroupForm = (props)=> {

    function createCustomer(e) {
      e.preventDefault();
      const groupId = props.id;
      const groupName = this.gName.value.trim();
      const groupAlias = this.gAlias.value.trim().toLowerCase();
      const groupWiki = this.gWiki.value.trim();
      
      function create(groupName, groupAlias, groupWiki) {
        Meteor.call('addGroup', groupName, groupAlias, groupWiki, (error, reply)=>{
          if(error)
            console.log(error);
          if(reply) {
            toast.success('Saved');
            FlowRouter.go('/data/overview?request=groups&specify=' + groupAlias);
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
            FlowRouter.go('/data/overview?request=groups&specify=' + groupAlias);
          }else{
            toast.error('Server Error');
          }
        });
      }
      
      /////////Selection/////////
      if(props.name === false) {
        create(groupName, groupAlias, groupWiki);
      }else{
        edit(groupId, groupName, groupAlias, groupWiki);
      }
      
    }
    
  const orName = props.name ? props.name : '';
  const orAlias = props.alias ? props.alias : '';
  const orWiki = props.wiki ? props.wiki : '';
  const bttn = props.name ? 'edit ' + Pref.group : 'new';
  const title = props.name ? 'edit' : 'create new';

  return(
    <Model
      button={bttn}
      title={title + ' ' + Pref.group}
      color='greenT'
      icon='fa-users'
      lock={!Roles.userIsInRole(Meteor.userId(), ['create', 'edit'])}
      noText={props.noText}
      primeTopRight={props.primeTopRight}>
      <form id='new' className='centre' onSubmit={(e)=>createCustomer(e)}>
        <p>
          <input
            type='text'
            id='gName'
            defaultValue={orName}
            placeholder='ie. Trailer Safegaurd'
            autoFocus={true}
            required />
          <label htmlFor='gName'>Full Name</label>
        </p>
        <p>
          <input
            type='text'
            id='gAlias'
            defaultValue={orAlias}
            placeholder='ie. TSG'
            required />
          <label htmlFor='gAlias'>Abbreviation / Alias</label>
        </p>
        <p>
          <input
            type='url'
            id='gWiki'
            defaultValue={orWiki}
            placeholder='http://192.168.1.68/pisces' />
          <label htmlFor='gWiki' className='cap'>{Pref.group} {Pref.instruct} index</label>
        </p>
        <br />
        <Submit name={title} type='action' />
      </form>
    </Model>
  );
};

export default GroupForm;