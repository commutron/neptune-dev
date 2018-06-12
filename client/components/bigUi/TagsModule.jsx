import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import Pref from '/client/global/pref.js';

// requires data
// Batch ._id as "id"
// flags array as "tags"

export default class TagsModule extends Component	{

  addTag(tag) {
    const cleanTag = !tag ? false : tag.trim();
    if(!cleanTag || cleanTag == '' || this.props.tags.includes(cleanTag)) {
      null;
    }else{
      if(!this.props.vKey) {
        if(!this.props.group) {
          if(this.props.pBatch) {
            Meteor.call('pushpBTag', this.props.id, cleanTag, (error)=>{
              if(error)
                console.log(error);
            });
          }else{
            Meteor.call('pushBTag', this.props.id, cleanTag, (error)=>{
              if(error)
                console.log(error);
            });
          }
        }else{
          Meteor.call('pushGTag', this.props.id, cleanTag, (error)=>{
            if(error)
              console.log(error);
          });
        }
      }else{
        Meteor.call('pushWTag', this.props.id, this.props.vKey, cleanTag, (error)=>{
        if(error)
          console.log(error);
      });
      }
    }
  }
  
  removeTag(tag) {
    const yes = window.confirm('Remove ' + Pref.tag + ': ' + tag);
    if(!yes) {
      null;
    }else{
      if(!this.props.vKey) {
        if(!this.props.group) {
          if(this.props.pBatch) {
            Meteor.call('pullpBTag', this.props.id, tag, (error)=>{
              if(error)
                console.log(error);
            });
          }else{
            Meteor.call('pullBTag', this.props.id, tag, (error)=>{
              if(error)
                console.log(error);
            });
          }
        }else{
          Meteor.call('pullGTag', this.props.id, tag, (error)=>{
            if(error)
              console.log(error);
          });
        }
      }else{
        Meteor.call('pullWTag', this.props.id, this.props.vKey, tag, (error)=>{
          if(error)
            console.log(error);
        });  
      }
    }
  }

  render() {
    return (
      <div className='rowWrap'>
        {this.props.tags.map( (entry, index)=>{
          return(
           <IndieTag
            key={index}
            tagText={entry}
            removeTag={()=>this.removeTag(entry)} />
        )})}
        {Roles.userIsInRole(Meteor.userId(), 'run') ?
          <ContextMenuTrigger
            id={this.props.id}
            holdToDisplay={1}
            renderTag='span'>
            <i className='fas fa-plus tagAddButton'></i>
          </ContextMenuTrigger>
        :null}
        
        <ContextMenu id={this.props.id}>
          {!this.props.tagOps ? null :
            this.props.tagOps.map( (entry, index)=>{
              return(
                <MenuItem
                  key={index}
                  onClick={()=>this.addTag(entry)}
                  disabled={this.props.tags.includes(entry)}>
                  {entry}
                </MenuItem>
          )})}
          <MenuItem divider />
          <MenuItem onClick={()=>this.addTag(window.prompt('Add a new ' + Pref.tag))}>
            Custom
          </MenuItem>
        </ContextMenu>
      </div>
    );
  }
}

const IndieTag = ({ tagText, removeTag }) => (
  <span className='tagFlag'>
    <i>{tagText}</i>
    <button
      onClick={removeTag}
      disabled={!Roles.userIsInRole(Meteor.userId(), 'run')}>
    </button>
  </span>
);