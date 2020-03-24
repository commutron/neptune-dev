import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelMedium from '../smallUi/ModelMedium.jsx';
import {Submit} from './Inputs.jsx';

const GroupFormWrapper = ({ id, name, alias, wiki, noText, primeTopRight })=> {
  const bttn = name ? 'edit ' + Pref.group : 'new';
  const title = name ? 'edit' : 'create new';
  
  return(
    <ModelMedium
      button={bttn}
      title={title + ' ' + Pref.group}
      color='greenT'
      icon='fa-industry'
      lock={!Roles.userIsInRole(Meteor.userId(), ['create', 'edit'])}
      noText={noText}
      primeTopRight={primeTopRight}>
      <GroupForm 
        id={id}
        name={name}
        alias={alias}
        wiki={wiki}
        title={title}
      />
    </ModelMedium>
  );
};

export default GroupFormWrapper;

const GroupForm = ({ id, name, alias, wiki, title })=> {

    function createCustomer(e) {
      e.preventDefault();
      const groupId = id;
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
      if(name === false) {
        create(groupName, groupAlias, groupWiki);
      }else{
        edit(groupId, groupName, groupAlias, groupWiki);
      }
      
    }
    
  const orName = name ? name : '';
  const orAlias = alias ? alias : '';
  const orWiki = wiki ? wiki : '';

  return(
    <form id='new' className='centre' onSubmit={(e)=>createCustomer(e)}>
      <p className='inlineForm'>
        <span>
          <input
            type='text'
            id='gName'
            defaultValue={orName}
            placeholder='ie. Trailer Safegaurd'
            autoFocus={true}
            required />
          <label htmlFor='gName'>Full Name</label>
        </span>
        <span className='breath' />
        <span>
          <input
            type='text'
            id='gAlias'
            defaultValue={orAlias}
            placeholder='ie. TSG'
            required />
          <label htmlFor='gAlias'>Abbreviation / Alias</label>
        </span>
      </p>
      <p>
        <input
          type='url'
          id='gWiki'
          defaultValue={orWiki}
          placeholder='http://192.168.1.68/pisces'
          className='dbbleWide' />
        <label htmlFor='gWiki' className='cap'>{Pref.group} {Pref.instruct} index</label>
      </p>
      <br />
      <Submit name={title} type='action' />
    </form>
  );
};
