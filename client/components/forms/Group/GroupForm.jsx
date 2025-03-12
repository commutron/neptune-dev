import React, { useState, useEffect } from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelNative from '/client/layouts/Models/ModelNative';
import { cleanURL } from '/client/utility/Convert';

const GroupForm = ({ gObj, clearOnClose, rootURL })=> {
  
  const [groupId, setgId] = useState(null);
  const [name, setgName] = useState('');
  const [alias, setgAlias] = useState('');
  const [wiki, setgWiki] = useState('');
  
  useEffect( ()=> {
    setgId(gObj?._id || null);
    setgName(gObj?.group || '');
    setgAlias(gObj?.alias || '');
    setgWiki(gObj?.wiki || '');
  },[gObj]);

  function createCustomer() {
    const groupName = name.trim();
    const groupAlias = alias.trim().toLowerCase();
    
    const gURL = wiki.trim();
    const groupWiki = cleanURL(gURL, rootURL);
    
    if(!groupId) {
      Meteor.call('addGroup', groupName, groupAlias, groupWiki, (error, reply)=>{
        if(error)
          console.log(error);
        if(reply) {
          clearOnClose();
          toast.success('Saved');
        }else{
          toast.error('Server Error');
        }
      });
    }else{
      Meteor.call('editGroup', groupId, groupName, groupAlias, groupWiki, (error, reply)=>{
        if(error)
          console.log(error);
        if(reply) {
          clearOnClose();
          toast.success('Saved');
          FlowRouter.go('/data/overview?request=groups&specify=' + groupAlias);
        }else{
          toast.error('Server Error');
        }
      });
    }
  }

  return(
    <ModelNative
      dialogId={'multifuncion_group_form'}
      title={`${groupId ? 'Edit' : 'Create'} ${Pref.group}`}
      icon='fa-solid fa-industry'
      colorT='blueT'
      closeFunc={clearOnClose}>
      
    <form id='newGroup' className='fitWide' onSubmit={(e)=>createCustomer(e)}>
      <p>
        <span>
          <input
            type='text'
            id='gName'
            value={name}
            onChange={(e)=>setgName(e.target.value)}
            placeholder='ie. Trailer Safegaurd'
            className='dbbleWide'
            pattern='[A-Za-z0-9 _\-]*'
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
            value={alias}
            onChange={(e)=>setgAlias(e.target.value)}
            placeholder='ie. TSG'
            pattern='[A-Za-z0-9 _\-]*'
            maxLength={Pref.aliasMax}
            required />
          <label htmlFor='gAlias'>Abbreviation / Alias</label>
        </span>
      </p>
      <p>
        <input
          type='text'
          id='gWiki'
          value={wiki}
          onChange={(e)=>setgWiki(e.target.value)}
          placeholder='http://192.168.1.68/pisces'
          className='dbbleWide' />
        <label htmlFor='gWiki' className='cap'>{Pref.group} {Pref.instruct} index</label>
      </p>
      <span className='centre'>
        <button
          type='submit'
          formMethod='dialog'
          id='grpSave'
          className='action nSolid'
          >Save
        </button>
      </span>
    </form>
    </ModelNative>
  );
};

export default GroupForm;