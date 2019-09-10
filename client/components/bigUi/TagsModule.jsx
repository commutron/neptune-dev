import React from 'react';
import ReactDOM from 'react-dom';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import Pref from '/client/global/pref.js';

// requires data
// Batch ._id as "id"
// flags array as "tags"

const TagsModule = (props)=>	{

  function addTag(tag) {
    const cleanTag = !tag ? false : tag.trim();
    if(!cleanTag || cleanTag == '' || props.tags.includes(cleanTag)) {
      null;
    }else{
      if(!props.vKey) {
        if(!props.group) {
          if(props.xBatch) {
            Meteor.call('pushBTagX', props.id, cleanTag, (error)=>{
              if(error)
                console.log(error);
            });
          }else{
            Meteor.call('pushBTag', props.id, cleanTag, (error)=>{
              if(error)
                console.log(error);
            });
          }
        }else{
          Meteor.call('pushGTag', props.id, cleanTag, (error)=>{
            if(error)
              console.log(error);
          });
        }
      }else{
        Meteor.call('pushWTag', props.id, props.vKey, cleanTag, (error)=>{
        if(error)
          console.log(error);
      });
      }
    }
  }
  
  function removeTag(tag) {
    const yes = window.confirm('Remove ' + Pref.tag + ': ' + tag);
    if(!yes) {
      null;
    }else{
      if(!props.vKey) {
        if(!props.group) {
          if(props.xBatch) {
            Meteor.call('pullBTagX', props.id, tag, (error)=>{
              if(error)
                console.log(error);
            });
          }else{
            Meteor.call('pullBTag', props.id, tag, (error)=>{
              if(error)
                console.log(error);
            });
          }
        }else{
          Meteor.call('pullGTag', props.id, tag, (error)=>{
            if(error)
              console.log(error);
          });
        }
      }else{
        Meteor.call('pullWTag', props.id, props.vKey, tag, (error)=>{
          if(error)
            console.log(error);
        });  
      }
    }
  }

  return (
    <div className='rowWrap vmarginhalf'>
      {props.tags.map( (entry, index)=>{
        return(
         <IndieTag
          key={index}
          tagText={entry}
          removeTag={()=>removeTag(entry)} />
      )})}
      {Roles.userIsInRole(Meteor.userId(), 'run') ?
        <ContextMenuTrigger
          id={props.id}
          holdToDisplay={1}
          renderTag='span'>
          <i className='fas fa-plus tagAddButton'></i>
        </ContextMenuTrigger>
      :null}
      
      <ContextMenu id={props.id} className='noCopy'>
        {!props.tagOps ? null :
          props.tagOps.map( (entry, index)=>{
            return(
              <MenuItem
                key={index}
                onClick={()=>addTag(entry)}
                disabled={props.tags.includes(entry)}>
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

const IndieTag = ({ tagText, removeTag }) => (
  <span className='tagFlag'>
    <i>{tagText}</i>
    <button
      onClick={removeTag}
      disabled={!Roles.userIsInRole(Meteor.userId(), 'run')}
    ><i className='fas fa-times'></i></button>
  </span>
);