import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';
//import AppSetSimple from '/client/components/forms/AppSetSimple';

const NCTypeSlide = ({app})=> {
  
  const rndmKey = Math.random().toString(36).substr(2, 5);
  
  function ncUpdate() {
    Meteor.call('updateToNewNonConScheme', (error, reply)=>{
      if(error)
        console.log(error);
      if(reply === true) {
        toast.success('Database updated');
      }else{
        toast.warning('ERROR');
      }
    });
  }
  
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
  
  function ncDormantType(listKey, typeKey) {
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
  
  return (
    <div>
      <h2 className='cap'>{Pref.nonCon} Types</h2>
      <p>Options for types of {Pref.nonCon}s</p>
      <p>A new smarter, scalable collection</p>
      <hr />
      {!app.nonConTypeLists || app.nonConOptionA || app.nonConOptionB ?
        <div>
          <p>Data structure for 'App' has changed, please update your database</p>
          <p>'Batch', 'BatchX', 'Group', 'Widget' and 'Cache' data will NOT be changed or removed</p>
          <p>
            <button 
              className='action clearBlue'
              onClick={()=>ncUpdate()}
            >Update</button>
          </p>
        </div>
      :
        <div className='space'>
          <p>Create A New List</p>
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
                maxLength={1}
                pattern="[a-z]{1}"
                placeholder='One Letter Pefix'
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
          <hr />    
          {app.nonConTypeLists.map( (entry, index)=>{
            const listKey = entry.key;
            return(
              <div className='vspace' key={listKey+index}>
                <h2>{entry.listPrefix}. {entry.listName}</h2>
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
                      className='smallAction clearGreen'
                      disabled={false}
                    >Add</button>
                  </label>
                </form>
                <ul>
                {entry.typeList.map( (type, ix)=>{
                  return( 
                    <li key={type.key+ix}>
                      <i className={type.live ? '' : 'fade'}>{type.typeCode}. {type.typeText}</i>
                      <button 
                        className='miniAction redT'
                        onClick={()=>ncDormantType(listKey, type.key)}
                      ><i className='fas fa-power-off fa-fw'></i></button>
                    </li>
                )})}
                </ul>
                <hr />
              </div>
            )})}
          
        </div>
      }
    </div>
  );
};

export default NCTypeSlide;