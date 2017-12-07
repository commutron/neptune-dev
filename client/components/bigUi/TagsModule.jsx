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
      Meteor.call('pushTag', this.props.id, cleanTag, (error)=>{
        if(error)
          console.log(error);
      });
    }
  }
  
  removeTag(tag) {
    const yes = window.confirm('Remove ' + Pref.tag + ': ' + tag);
    if(!yes) {
      null;
    }else{
      Meteor.call('pullTag', this.props.id, tag, (error)=>{
        if(error)
          console.log(error);
      });
    }
  }

  render() {
    return (
      <div>
        {this.props.tags.map( (entry, index)=>{
          return(
           <IndieTag
            key={index}
            tagText={entry}
            removeTag={()=>this.removeTag(entry)} />
        )})}
        <ContextMenuTrigger id={this.props.id} holdToDisplay={1}>
          <i className='tagAddButton'>ADD</i>
        </ContextMenuTrigger>
        
        <ContextMenu id={this.props.id}>
          <MenuItem onClick={()=>this.addTag('LF')} disabled={this.props.tags.includes('LF')}>
            LF
          </MenuItem>
          <MenuItem divider />
          <MenuItem onClick={()=>this.addTag(window.prompt('Add a new ' + Pref.tag))}>
            + Custom
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
      onClick={removeTag}>
      <i className='big'>-</i>
    </button>
  </span>
);