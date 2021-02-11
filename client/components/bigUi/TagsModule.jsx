import React from 'react';
import ReactDOM from 'react-dom';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import Pref from '/client/global/pref.js';

// requires data
// Batch ._id as "id"
// flags array as "tags"

const TagsModule = ({ action, id, vKey, tags, tagOps })=>	{

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
      case Pref.batch:
        Meteor.call('pushBTag', id, cleanTag, (err)=>{
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
    const yes = window.confirm('Remove ' + Pref.tag + ': ' + tag);
    if(!yes) {
      null;
    }else{
      switch(action) {
      case Pref.xBatch:
        Meteor.call('pullBTagX', id, tag, (err)=>{
          err && console.log(err);
        });
        break;
      case Pref.batch:
        Meteor.call('pullBTag', id, tag, (err)=>{
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
  }
  
  const auth = Roles.userIsInRole(Meteor.userId(), 'run');
  const currTags = tags || [];
  
  return (
    <div className='rowWrap vmarginhalf'>
      {currTags.map( (entry, index)=>{
        return(
          <IndieTag
            key={index}
            tagText={entry}
            removeTag={()=>removeTag(entry)} 
            lock={!auth} />
      )})}
      {auth ?
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
        <MenuItem onClick={()=>addTag(window.prompt('Add a new ' + Pref.tag))}>
          Custom
        </MenuItem>
      </ContextMenu>
    </div>
  );
};

export default TagsModule;

const IndieTag = ({ tagText, removeTag, lock }) => (
  <div className='tagFlag'>
    <i>{tagText}</i>
    <button
      onClick={removeTag}
      disabled={lock}
    ><i className='fas fa-times' data-fa-transform='up-2'></i></button>
  </div>
);