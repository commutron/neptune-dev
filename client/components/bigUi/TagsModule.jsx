import React, { useState } from 'react';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import Pref from '/client/global/pref.js';


const TagsModule = ({ action, id, vKey, tags, tagOps, truncate, rad, hold, canRun })=>	{

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
  
  function addHoldFlag(rad) {
    Meteor.call('setHold', id, (err)=>{
      err && console.log(err);
    });
  }
  
  function addRadFlag(rad) {
    Meteor.call('setVRad', vKey, rad, (err)=>{
      err && console.log(err);
    });
  }
  
  const currTags = tags || [];
  
  const sty = {
    display: 'inline-block',
    margin: '0 10px',
    padding: '2px',
    verticalAlign: 'middle',
    color: 'var(--peterriver)',
    backgroundColor: 'transparent',
    fontSize: '1.6rem',
    borderRadius: '25%',
    transition: 'all 150ms ease-in-out',
    cursor: 'pointer'
  };

  return(
    <div className='rowWrap margin5'>
      {currTags.map( (entry, index)=>{
        return(
          <IndieTag
            key={index}
            tagText={entry}
            removeTag={()=>removeTag(entry)} 
            lock={!canRun} />
      )})}
      {canRun && !truncate ?
        <ContextMenuTrigger
          id={id+'tagnew'}
          holdToDisplay={1}
          renderTag='span'>
          <i className='fas fa-tags' style={sty}></i>
        </ContextMenuTrigger>
      :null}
      
      <ContextMenu id={id+'tagnew'} className='noCopy'>
        {!tagOps ? null :
          tagOps.map( (entry, index)=>{
            return(
              <MenuItem
                key={index}
                onClick={()=>addTag(entry)}
                disabled={tags && tags.includes(entry)}>
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
        
        {action === Pref.xBatch && !hold ?
        <span>
          <MenuItem divider />
          <MenuItem onClick={()=>addHoldFlag()} className='cap'>
            <n-faX>
              <i className='fas fa-pause fa-fw gapR darkgrayT'></i>
            </n-faX>Add {Pref.hold}
          </MenuItem>
        </span>
        : null}
        
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
              <i className='fa-solid fa-bust fa-fw fa-lg gapR darkOrangeT'></i>
            </n-faX>Add {Pref.radio.toUpperCase()}
          </MenuItem>
        </span>
        : null}
        
      </ContextMenu>
    </div>
  );
};

export default TagsModule;

const IndieTag = ({ tagText, removeTag, lock }) => {
  
  const sty = {
    display: 'flex',
    alignItems: 'center',
    margin: '2px',
    padding: '3px 5px 3px 5px',
    border: '0.5px solid white',
    borderRadius: '1px 25px 25px 1px',
    backgroundColor: 'var(--peterriver)',
    fontSize: '0.9rem',
    color: 'white',
    wordBreak: 'keep-all',
    wordWrap: 'normal'
  };
  
  return(
    <div style={sty}>
      <i>{tagText}</i>
      
      {!lock &&
        <ContextMenuTrigger
          id={tagText+'tagcut'}
          holdToDisplay={1}
          renderTag='span'
          attributes={ {className: 'miniAction centreText' } }>
          <i className='fas fa-times'></i>
        </ContextMenuTrigger>
      }
          
      <ContextMenu id={tagText+'tagcut'} className='noCopy'>
        <MenuItem onClick={()=>removeTag()}>Remove {Pref.tag}</MenuItem>
      </ContextMenu>
    </div>
  );
};

export const HoldFlag = ({ id, canRun })=> {

  function removeHoldFlag() {
    Meteor.call('unsetHold', id, (err)=>{
      err && console.log(err);
    });
  }
  
  return(
    <div 
      className='medBig max250 vmarginhalf holdpill' 
      title={`${Pref.xBatch} is ${Pref.isHold}`}
    >
      <ContextMenuTrigger
        id={id+'hldcut'}
        holdToDisplay={1}
        attributes={{
          style: { cursor: 'pointer' }
        }}
        renderTag='div'
      >
        <n-faX><i className='far fa-pause-circle fa-lg fa-fw wetasphaltT'></i></n-faX>
        <i>{Pref.isHold}</i>
      </ContextMenuTrigger>
        
      <ContextMenu id={id+'hldcut'} className='noCopy cap'>
        <MenuItem onClick={()=>removeHoldFlag()} disabled={!canRun}
        >Remove {Pref.hold}</MenuItem>
      </ContextMenu>
    </div>
  );
};

export const RadFlag = ({ vKey, rad, canRun })=> {

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
        <n-faX><i className='fa-solid fa-burst fa-fw fa-2x darkOrangeT'></i></n-faX>
        <i>{rad}</i>
      </ContextMenuTrigger>
        
      <ContextMenu id={vKey+'radcut'} className='noCopy cap'>
        <MenuItem onClick={()=>removeRadFlag()} disabled={!canRun}
        >Remove {Pref.radio.toUpperCase()}</MenuItem>
      </ContextMenu>
    </span>
  );
};