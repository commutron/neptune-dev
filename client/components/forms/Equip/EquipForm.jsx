import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelMedium from '/client/components/smallUi/ModelMedium';
import { cleanURL } from '/client/utility/Convert';

const EquipFormWrapper = ({ 
  id, name, alias, brKey, wiki, rootURL, brancheS,
  noText, primeTopRight, lgIcon,
  lockOut
})=> {
  const bttn = id ? `edit ${Pref.equip}` : `new ${Pref.equip}`;
  const otitle = id ? 'edit ' + Pref.equip : 'create new ' + Pref.equip;
  
  const access = id ? Roles.userIsInRole(Meteor.userId(), 'edit') :
                        Roles.userIsInRole(Meteor.userId(), 'create');
  const aT = !access ? Pref.norole : '';
  const lT = lockOut ? `${Pref.equip} is offline` : '';
  const title = access && !lockOut ? otitle : `${aT}\n${lT}`;
  
  return(
    <ModelMedium
      button={bttn}
      title={title}
      color='midnightblueT'
      icon='fa-vault'
      lock={!access || lockOut}
      noText={noText}
      primeTopRight={primeTopRight}
      lgIcon={lgIcon}>
      <EquipForm 
        id={id}
        name={name}
        alias={alias}
        brKey={brKey}
        wiki={wiki}
        rootURL={rootURL}
        brancheS={brancheS}
      />
    </ModelMedium>
  );
};

export default EquipFormWrapper;

const EquipForm = ({ 
  id, name, alias, brKey, wiki, rootURL, brancheS, selfclose
})=> {

  function saveEquipment(e) {
    e.preventDefault();
    const equipId = id;
    const eqname = this.eName.value.trim();
    const eqalias = this.eAlias.value.trim().toLowerCase();
    
    const eqBrKey = this.eBrKey.value;
    
    const eURL = this.eWiki.value.trim();
    const eqwiki = cleanURL(eURL, rootURL);
    
    if(equipId) {
       Meteor.call('editEquipment', equipId, eqname, eqalias, eqBrKey, eqwiki,
      (error, reply)=>{
        if(error)
          console.log(error);
        if(reply) {
          toast.success('Saved');
          FlowRouter.go('/data/overview?request=maintain&specify=' + eqalias);
          selfclose();
        }else{
          toast.warning('Duplicate Name');
        }
      });
    }else{
      Meteor.call('createEquipment', eqname, eqalias, eqBrKey, eqwiki,
      (error, reply)=>{
        error && console.log(error);
        if(reply) {
          toast.success('Saved');
          FlowRouter.go('/data/overview?request=maintain&specify=' + eqalias);
          selfclose();
        }else{
          toast.warning('Duplicate Name');
        }
      });
    }
  }
    
  const orName = name ? name : '';
  const orAlias = alias ? alias : '';
  const orBrKey = brKey ? brKey : false;
  const orWiki = wiki ? wiki : '';

  return(
    <form id='newEquip' className='fitWide' onSubmit={(e)=>saveEquipment(e)}>
      <p>
        <span>
          <input
            type='text'
            id='eName'
            defaultValue={orName}
            placeholder='ie. Heller 1707 Reflow Oven'
            className='dbbleWide'
            pattern='[A-Za-z0-9 _-]*'
            maxLength={Pref.groupMax}
            autoFocus={true}
            required />
          <label htmlFor='eName'>Full Name</label>
        </span>
      </p>
      <p>
        <span>
          <input
            type='text'
            id='eAlias'
            defaultValue={orAlias}
            placeholder='ie. Reflow'
            pattern='[A-Za-z0-9 _-]*'
            maxLength={Pref.aliasMax}
            required />
          <label htmlFor='eAlias'>Alias / Common</label>
        </span>
      </p>
      <p>
        <span>
          <select id='eBrKey' defaultValue={orBrKey} required>
            <option value={false}>Facility</option>
            {brancheS.map( (br, index)=>(
              <option key={index} value={br.brKey}>{br.branch}</option>
            ))}
          </select>
          <label htmlFor='eBrKey'>{Pref.branch}</label>
        </span>
      </p>
      <p>
        <input
          type='text'
          id='eWiki'
          defaultValue={orWiki}
          placeholder='http://192.168.1.68/pisces'
          className='dbbleWide' />
        <label htmlFor='eWiki' className='cap'>{Pref.equip} {Pref.instruct}</label>
      </p>
      <span className='centre'>
        <button
          type='submit'
          id='eqSave'
          className='action nSolid'
          >Save
        </button>
      </span>
    </form>
  );
};