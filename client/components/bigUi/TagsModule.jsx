import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import Pref from '/client/global/pref.js';


const TagsModule = ({ action, id, vKey, tags, tagOps, truncate, rad })=>	{

  const [ newOption, newOptionSet ] = useState(false);
  const [ newRad, newRadSet ] = useState(false);
  
  function addTag(tag) {
    const cleanTag = !tag ? false : tag.trim();
    if(!cleanTag || cleanTag == '' || tags.includes(cleanTag)) {
      null;
    }else{
      switch(action) {
      case Pref.xBatch:
        Meteor.call('pushBTagX', id, cleanTag, (err)=>{
          err && console.log(err);
        });
        break;
      case 'variant':
        Meteor.call('pushVTag', id, vKey, cleanTag, (err)=>{
          err && console.log(err);
        });
        break;
      case 'group':
        Meteor.call('pushGTag', id, cleanTag, (err)=>{
          err && console.log(err);
        });
        break;
      default:
        console.log('this component is not wired properly');
      }
    }
  }
  
  function removeTag(tag) {
    switch(action) {
    case Pref.xBatch:
      Meteor.call('pullBTagX', id, tag, (err)=>{
        err && console.log(err);
      });
      break;
    case 'variant':
      Meteor.call('pullVTag', id, tag, (err)=>{
        err && console.log(err);
      });
      break;
    case 'group':
      Meteor.call('pullGTag', id, tag, (err)=>{
        err && console.log(err);
      });
      break;
    default:
      console.log('this component is not wired properly');
    }
  }
  
  function addRadFlag(rad) {
    Meteor.call('setVRad', vKey, rad, (err)=>{
      err && console.log(err);
    });
  }
  
  const auth = Roles.userIsInRole(Meteor.userId(), 'run');
  const currTags = tags || [];
  
  return(
    <div className='rowWrap margin5'>
      {currTags.map( (entry, index)=>{
        return(
          <IndieTag
            key={index}
            tagText={entry}
            removeTag={()=>removeTag(entry)} 
            lock={!auth} />
      )})}
      {auth && !truncate ?
        <ContextMenuTrigger
          id={id+'tagnew'}
          holdToDisplay={1}
          renderTag='span'>
          <i className='fas fa-tags tagAddButton'></i>
        </ContextMenuTrigger>
      :null}
      
      <ContextMenu id={id+'tagnew'} className='noCopy'>
        {!tagOps ? null :
          tagOps.map( (entry, index)=>{
            return(
              <MenuItem
                key={index}
                onClick={()=>addTag(entry)}
                disabled={tags.includes(entry)}>
                {entry}
              </MenuItem>
        )})}
        <MenuItem divider />
        <MenuItem onClick={null} disabled={true} className='noFade'>
          <input 
            type='text' 
            id={vKey+'addnewtag'}
            maxLength='24'
            className='wide black whiteT' 
            onChange={(e)=>newOptionSet(this[vKey+'addnewtag'].value)} />
        </MenuItem>
        <MenuItem onClick={()=>addTag(newOption)} disabled={!newOption}>
          Add Custom
        </MenuItem>
        
        {action === 'variant' && !rad ?
        <span>
          <MenuItem divider />
          <MenuItem onClick={null} disabled={true} className='noFade'>
            <input 
              type='text' 
              id={vKey+'addnewrad'}
              maxLength='24'
              className='wide black whiteT' 
              onChange={(e)=>newRadSet(this[vKey+'addnewrad'].value)} />
          </MenuItem>
          <MenuItem onClick={()=>addRadFlag(newRad)} disabled={!newRad} className='cap'>
            <n-faX>
              <i className='fas fa-radiation-alt fa-fw fa-lg gapR darkOrangeT'></i>
            </n-faX>Add {Pref.radio.toUpperCase()}
          </MenuItem>
          </span>
        : null}
        
      </ContextMenu>
    </div>
  );
};

export default TagsModule;

const IndieTag = ({ tagText, removeTag, lock }) => (
  <div className='tagFlag'>
    <i>{tagText}</i>
    
    <ContextMenuTrigger
      id={tagText+'tagcut'}
      holdToDisplay={1}
      renderTag='span'>
      <i className='fas fa-times' data-fa-transform='up-2'></i>
    </ContextMenuTrigger>
        
    <ContextMenu id={tagText+'tagcut'} className='noCopy'>
      <MenuItem onClick={()=>removeTag()}>Remove {Pref.tag}</MenuItem>
    </ContextMenu>
  </div>
);

export const RadFlag = ({ vKey, rad })=> {

  function removeRadFlag() {
    Meteor.call('cutVRad', vKey, (err)=>{
      err && console.log(err);
    });
  }
  
  return(
    <span>
      <ContextMenuTrigger
        id={vKey+'radcut'}
        holdToDisplay={1}
        attributes={{ 
          className: 'centre max100',
          style: { cursor: 'pointer' }
        }}
        renderTag='div'
      >
        <n-faX><i className='fas fa-radiation-alt fa-fw fa-2x darkOrangeT'></i></n-faX>
        <i>{rad}</i>
      </ContextMenuTrigger>
        
      <ContextMenu id={vKey+'radcut'} className='noCopy cap'>
        <MenuItem onClick={()=>removeRadFlag()}>Remove {Pref.radio.toUpperCase()}</MenuItem>
      </ContextMenu>
    </span>
  );
};