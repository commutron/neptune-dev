import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelMedium from '/client/components/smallUi/ModelMedium';
import { cleanURL } from '/client/utility/Convert';

const ServeFormWrapper = ({ 
  id, name, alias, wiki, rootURL,
  noText, primeTopRight, lgIcon,
  lockOut
})=> {
  const bttn = name ? `edit ${Pref.group}` : `new ${Pref.group}`;
  const otitle = name ? 'edit ' + Pref.group : 'create new ' + Pref.group;
  
  const access = name ? Roles.userIsInRole(Meteor.userId(), 'edit') :
                        Roles.userIsInRole(Meteor.userId(), 'create');
  const aT = !access ? Pref.norole : '';
  const lT = lockOut ? `${Pref.group} is hibernated` : '';
  const title = access && !lockOut ? otitle : `${aT}\n${lT}`;
  
  return(
    <ModelMedium
      button={bttn}
      title={title}
      color='blueT'
      icon='fa-industry'
      lock={!access || lockOut}
      noText={noText}
      primeTopRight={primeTopRight}
      lgIcon={lgIcon}>
      <EquipForm 
        id={id}
        name={name}
        alias={alias}
        wiki={wiki}
        title={title}
        rootURL={rootURL}
      />
    </ModelMedium>
  );
};

export default ServeFormWrapper;

const ServeForm = ({ id, name, alias, wiki, rootURL, title, selfclose })=> {

  function newEquipment(e) {
    e.preventDefault();
    const equipId = id;
    const eqname = this.eName.value.trim();
    const alias = this.eAlias.value.trim().toLowerCase();
    
    const eURL = this.eWiki.value.trim();
    const eWiki = cleanURL(eURL, rootURL);
    
    function create(eqname, alias, groupWiki) {
      Meteor.call('createEquipment', eqname, alias, maincode, brKey, eWiki,
      (error, reply)=>{
        error && console.log(error);
        if(reply) {
          toast.success('Saved');
          selfclose();
        }else{
          toast.error('Server Error');
        }
      });
    }
      
    // function edit(groupId, groupName, groupAlias, groupWiki) {
    //   Meteor.call('editGroup', groupId, groupName, groupAlias, groupWiki, (error, reply)=>{
    //     if(error)
    //       console.log(error);
    //     if(reply) {
    //       toast.success('Saved');
    //       FlowRouter.go('/data/overview?request=groups&specify=' + groupAlias);
    //       selfclose();
    //     }else{
    //       toast.error('Server Error');
    //     }
    //   });
    // }
    
    /////////Selection/////////
    // if(name === false) {
    //   create(groupName, groupAlias, groupWiki);
    // }else{
    //   edit(groupId, groupName, groupAlias, groupWiki);
    // }
    
  }
    
  const orName = name ? name : '';
  const orAlias = alias ? alias : '';
  const orWiki = wiki ? wiki : '';

  return(
    <form id='newEquip' className='fitWide' onSubmit={(e)=>newEquipment(e)}>
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
          type='text'
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
          className='action nSolid'
          >Save
        </button>
      </span>
    </form>
  );
};