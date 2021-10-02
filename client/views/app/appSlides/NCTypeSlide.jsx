import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import SlidesNested from '/client/components/smallUi/SlidesNested';
import AppSetSimple from '/client/components/forms/AppSetSimple';

const NCTypeSlide = ({ app })=> {
  
  function addToList(e, listKey) {
    e.preventDefault();
    const type = this[listKey + 'input'].value.trim();
    
    Meteor.call('addNonConTypeToList', listKey, type, (error, reply)=>{
      if(error) {
        console.log(error);
        toast.warning('Server Error, see console log for details');
      }else if(reply.pass === true) {
        toast.success('Added New Type');
        this[listKey + 'input'].value = '';
      }else{
        toast.warning(reply.message);
      }
    });
  }
  
  
  const ncListS = app.nonConTypeLists.sort((b1, b2)=> {
    return b1.listPrefix > b2.listPrefix ? 1 : b1.listPrefix < b2.listPrefix ? -1 : 0 });
            
  const listMenu = Array.from(ncListS, n => [ `${n.listPrefix}. ${n.listName}` ]);
  
  return(
    <SlidesNested
      menuTitle='Defect Type Collections'
      menu={listMenu}
      filter={false}
      topPage={
        <TopNCSlide app={app} />
      }>
    
      {ncListS.map( (entry, index)=>{
        const listKey = entry.key;
        return(
          <div className='vspace' key={listKey+index}>
            <h2>{entry.listPrefix}. {entry.listName}</h2>
            <p>
              <SetDefault 
                listKey={listKey} 
                defaultOn={entry.defaultOn} />
            </p>
            <form 
              id={listKey + 'form'} 
              onSubmit={(e)=>addToList(e, listKey)}
              className='inlineForm'>
              <label htmlFor={listKey + 'input'}>Add A New Type To This List<br />
                <input
                  type='text'
                  id={listKey + 'input'}
                  placeholder='Type Name'
                  required
                />
              </label>
              <label htmlFor={listKey + 'go'}><br />
                <button
                  type='submit'
                  id={listKey + 'go'}
                  className='action clearGreen'
                  disabled={false}
                >Add</button>
              </label>
            </form>
            
            <dl className='line2x letterSpaced vspace'>
              {entry.typeList.map( (type, ix)=> ( 
                <TypeEntry 
                  key={type.key+ix}
                  listKey={listKey}
                  typeObj={type}
                  listIndex={ix} />
              ))}
            </dl>
          </div>
      )})}
    </SlidesNested>
  );
};

export default NCTypeSlide;

const SetDefault = ({ listKey, defaultOn })=> {
  
  function change() {
    const flip = !defaultOn ? true : false;
    Meteor.call('setDefaultNCTL', listKey, flip, (error, reply)=>{
      if(error)
        console.log(error);
      if(reply) {
        toast.success('Saved');
      }else{
        console.log("BLOCKED BY SERVER");
      }
    });
  }

  return(
    <span className='beside'>
      <input
        type='checkbox'
        id={listKey+'dfon'}
        defaultChecked={defaultOn}
        onChange={()=>change()}
        readOnly />
      <label htmlFor={listKey+'dfon'}>Use By Default</label>
    </span>
  );
};

const TypeEntry = ({ listKey, typeObj, listIndex })=> {
  
  function ncDormantType(typeKey) {
    Meteor.call('switchStateNonConType', listKey, typeKey, (error, reply)=>{
      if(error) {
        console.log(error);
        toast.warning('Server Error, see console log for details');
      }else if(reply.pass === false) {
        toast.warning(reply.message);
      }else{
        null;
      }
    });
  }
 
  return(
    <dd>
      <i className={typeObj.live ? '' : 'fade'}>{typeObj.typeCode}. {typeObj.typeText}</i>
      <button 
        className={`miniAction redT gap med ${typeObj.live ? '' : 'fade'}`}                      
        onClick={()=>ncDormantType(typeObj.key)}
      ><i className='fas fa-power-off fa-fw'></i></button>
    </dd>
  );
};

const TopNCSlide = ({ app })=> {
  
  const rndmKey = Math.random().toString(36).substr(2, 5);

  function newTypeList(e) {
    e.preventDefault();
    const title = this[rndmKey + 'inputTitle'].value.trim();
    const prefix = this[rndmKey + 'inputPre'].value.trim();
    
    Meteor.call('addNonConTypeList', title, prefix, (error, reply)=>{
      if(error) {
        console.log(error);
      }else if(reply.pass === true) {
        toast.success('Created New List');
        this[rndmKey + 'inputTitle'].value = '';
        this[rndmKey + 'inputPre'].value = '';
      }else{
        toast.warning(reply.message);
      }
    });
  }
  
  return(
    <div>
      <h2 className='cap'>{Pref.nonCon} Types</h2>
      <h3>Options for types of {Pref.nonCon}s</h3>
      
      <div className='autoFlex'>
        <div>
          <h3>Create A New List</h3>
          <form 
            id={rndmKey + 'form'} 
            onSubmit={(e)=>newTypeList(e)}
            className='inlineForm'>
            <label htmlFor={rndmKey + 'inputTitle'}>List Title<br />
              <input
                type='text'
                id={rndmKey + 'inputTitle'}
                placeholder='Descriptive Name'
                required
              />
            </label>
            <label htmlFor={rndmKey + 'inputPre'}>Defect Code Prefix<br />
              <input
                type='text'
                id={rndmKey + 'inputPre'}
                maxLength={2}
                pattern="[a-z]{1-2}"
                placeholder='Letter Pefix'
                required
              />
            </label>
            <label htmlFor={rndmKey + 'go'}><br />
              <button
                type='submit'
                id={rndmKey + 'go'}
                className='smallAction clearGreen'
                disabled={false}
              >Add</button>
            </label>
          </form>
        </div>
      
        <div>
          <h3 className='cap'>missing type</h3>
          <i>Type of {Pref.nonCon} that can be converted into a shortfall</i>
          <AppSetSimple
            title='type'
            action='addMissingType'
            rndmKey={Math.random().toString(36).substr(2, 5)} />
          <i><em>currently set to: </em>{app.missingType || ''}</i>
        </div>
      
        {app.nonConOption &&
          <div>
            <h3>Legacy List</h3>
            <ol>
              {app.nonConOption.map( (entry, index)=>{
                return( 
                  <li key={index}>{entry}</li>
              )})}
            </ol>
          </div>
        }
      </div>
      
    </div>
  );
};