import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelMedium from '../smallUi/ModelMedium.jsx';

const GroupFormWrapper = ({ 
  id, name, alias, wiki, 
  noText, primeTopRight, lgIcon,
  lockOut
})=> {
  const bttn = name ? `edit ${Pref.group}` : `new ${Pref.group}`;
  const otitle = name ? 'edit ' + Pref.group : 'create new ' + Pref.group;
  
  const access = Roles.userIsInRole(Meteor.userId(), ['create', 'edit']);
  const aT = !access ? Pref.norole : '';
  const lT = lockOut ? `${Pref.group} is hibernated` : '';
  const title = access && !lockOut ? otitle : `${aT}\n${lT}`;
  
  return(
    <ModelMedium
      button={bttn}
      title={title}
      color='greenT'
      icon='fa-industry'
      lock={!access || lockOut}
      noText={noText}
      primeTopRight={primeTopRight}
      lgIcon={lgIcon}>
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

const GroupForm = ({ id, name, alias, wiki, title, selfclose })=> {

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
          selfclose();
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
    <form id='newGroup' className='fitWide' onSubmit={(e)=>createCustomer(e)}>
      <p>
        <span>
          <input
            type='text'
            id='gName'
            defaultValue={orName}
            placeholder='ie. Trailer Safegaurd'
            className='dbbleWide'
            pattern='[A-Za-z0-9 _-]*'
            maxLength={Pref.groupMax}
            autoFocus={true}
            required />
          <label htmlFor='gName'>Full Name</label>
        </span>
      </p>
      <p>
        <span>
          <input
            type='text'
            id='gAlias'
            defaultValue={orAlias}
            placeholder='ie. TSG'
            pattern='[A-Za-z0-9 _-]*'
            maxLength={Pref.aliasMax}
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
      <span className='centre'>
        <button
          type='submit'
          id='grpSave'
          className='action clearGreen'
          >Save
        </button>
      </span>
    </form>
  );
};