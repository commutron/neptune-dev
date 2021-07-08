import React, { useState, Fragment } from 'react';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import Pref from '/client/global/pref.js';

const NCTributary = ({ seriesId, serial, nonCons, sType })=> {

  function handleAction(ncKey, ACT, extra) {
    Meteor.call('runNCAction', seriesId, ncKey, ACT, extra, (error)=> {
			error && console.log(error);
		});
		let findBox = document.getElementById('lookup');
		findBox.focus();
  }
  
  function handleCluster(ncKeys, ACT) {
    Meteor.call('loopNCActions', seriesId, ncKeys, ACT, (error)=> {
			error && console.log(error);
		});
		let findBox = document.getElementById('lookup');
		findBox.focus();
  }
  
  const inspector = Roles.userIsInRole(Meteor.userId(), 'inspect');
  const verifier = Roles.userIsInRole(Meteor.userId(), 'verify');
 
  const chunkNC = Object.entries( _.groupBy(nonCons, x=> x.type) )
                    .sort((a,b)=>a[0] > b[0] ? 1 : a[0] < b[0] ? -1 : 0);
  
  return(
    <Fragment>
      {chunkNC.map( (chunk, chindex)=>{
        const allFixed = chunk[1].every(c=>c.fix !== false);
        
        const cluster = chunk[1].length >= Pref.clusterMin &&
          ( chunk[1].every(c=>c.fix === false) || allFixed );
        
        if(cluster) {
          return(
            <NCCluster
              key={'cluster'+chindex}
              seriesId={seriesId}
              chunk={chunk}
              chindex={chindex}
              sType={sType}
              allFixed={allFixed}
              inspector={inspector}
              verifier={verifier}
              handleCluster={handleCluster}
              handleAction={handleAction}
            />
          );
        }else{
          return(
            <Fragment key={'cluster'+chindex}>
              {chunk[1].map( (entry, index)=>{
                sType === 'finish' && entry.snooze === true ?
                  handleAction(entry.key, 'WAKE') : null;
                return(
                  <NCStream
                    key={'indie'+entry.key}
                    entry={entry}
                    seriesId={seriesId}
                    end={sType === 'finish'}
                    doAction={(act, extra)=>handleAction(entry.key, act, extra)}
                    inspector={inspector}
                    verifier={verifier}
                  />
              )})}
            </Fragment>
          );
        }
      })}
    </Fragment>
  );
};

export default NCTributary;

const NCCluster = ({ 
  seriesId, chunk, chindex, sType,
  allFixed, inspector, verifier,
  handleCluster, handleAction
})=> {
  
  const [ clickState, clickSet ] = useState(0);
  
  const doFunc = allFixed ? 'INSPECTALL' : 'FIXALL';
  
  const keys = Array.from(chunk[1], x=> x.key);
  
  const handleSelf = ()=> {
    if(clickState === 1) {
      clickSet(0);
      handleCluster(keys, doFunc);
    }else{
      clickSet(1);
    }
  };
  
  const sameLock = chunk[1].some(c=>c.fix && c.fix.who === Meteor.userId());
  const lockI = allFixed ? inspector ? false : true : false;
  
  const clr = allFixed ? 'riverG' : 'riverInfo';
  const on = clickState === 0 ? '' : 'pass2step';
  const sty = `ncAct ${clr} ${on}`;
  
  return( 
    <details className='tribCluster'>
      <summary>
        <i>{chunk[0]}</i>
        <n-trib-cluster-head>
        <n-trib-info>
          <n-num>{Array.from(chunk[1], x=>x.ref).join(", ")}</n-num>
        </n-trib-info>
        <n-trib-action-all>
          <button
            title={allFixed ? 'All OK' : 'All Fixed'}
            id={'cluster'+chindex+'doAll'}
            data-name={allFixed ? 'OK' : Pref.fix}
            className={sty}
            onClick={()=>handleSelf(keys)}
            readOnly={true}
            disabled={lockI || sameLock}
          ></button>
        </n-trib-action-all>
        </n-trib-cluster-head>
      </summary>
      
      {chunk[1].map( (entry, index)=>{
        sType === 'finish' && entry.snooze === true ?
          handleAction(entry.key, 'WAKE') : null;
        return(
          <NCStream
            key={'cluster'+chindex+entry.key}
            entry={entry}
            seriesId={seriesId}
            end={sType === 'finish'}
            doAction={(act, extra)=> handleAction(entry.key, act, extra)}
            inspector={inspector}
            verifier={verifier}
          />
        )})}
    </details>
  );
};

const NCStream = ({ entry, seriesId, end, doAction, inspector, verifier })=>{
  
  const [ selfLock, selfLockSet ] = useState(false);
  
  const handleComment = ()=> {
    let val = window.prompt('Add a comment');
    val !== '' ? doAction('COMM', val) : null;
  };
  
  function handleClick(ACT, extra) {
    selfLockSet(true);
    doAction(ACT, extra);
  }
    
  const fixed = entry.fix;
  const same = entry.fix.who === Meteor.userId();
  
  const lockI = fixed ? !same && inspector ? false : true : false;
  let snooze = entry.snooze;
  let snstyle = !snooze ? 'tribRed' : 'yellowList';

  return(
    <n-trib-row class={`cap noCopy ${snstyle}`}>
      <n-trib-info title={entry.comm}>
        <div className='up numFont'
          >{entry.ref} {entry.multi > 1 && <sup>x{entry.multi} </sup>}
          {entry.comm !== '' && <i className='fas fa-comment'></i>}
        </div>
        <div>{entry.type}</div>
      </n-trib-info>
      <n-trib-action>
        <n-trib-action-main>
          {snooze ?
            <span className='centre'>
              <i className='far fa-clock fa-lg'></i>
              <i>{window.innerWidth <= 1200 ? null : 'Later'}</i>
            </span>
          :
            fixed ?
              <button
                title='All Correct'
                id='inspectline'
                data-name='OK'
                className='ncAct riverG'
                onClick={()=>handleClick('INSPECT')}
                readOnly={true}
                disabled={lockI || selfLock}>
              </button>
          :
              <button
                title='Fix Complete'
                id='fixline'
                data-name={Pref.fix}
                className='ncAct riverInfo'
                onClick={()=>handleClick('FIX')}
                readOnly={true}
                disabled={fixed === true || selfLock}>
              </button>
          }
        </n-trib-action-main>
        <n-trib-action-extra>
          <ContextMenuTrigger
            id={entry.key}
            holdToDisplay={1}
            renderTag='span'>
            <i className='fas fa-ellipsis-v fa-lg'></i>
          </ContextMenuTrigger>
        
          <ContextMenu id={entry.key}>
          {!fixed &&
            <MenuItem 
              onClick={()=>handleClick('INSPECT')} 
              disabled={!verifier}>
              Inspected, no repair required
            </MenuItem> }
            <MenuItem 
              onClick={()=>handleClick('REJECT', [entry.fix.time, entry.fix.who])} 
              disabled={lockI || !fixed}>
              {Pref.reject}
            </MenuItem>      
            <MenuItem 
              onClick={()=>handleClick('SNOOZE')}
              disabled={snooze !== false || end}>
              Snooze, repair later
            </MenuItem>
            <MenuItem 
              onClick={()=>handleClick('WAKE')} 
              disabled={!snooze}>
              Wake Up, repair now
            </MenuItem>
            <MenuItem onClick={(e)=>handleComment(e)}>
              {entry.comm !== '' ? 'Change' : 'Add'} Comment
            </MenuItem>
          </ContextMenu>
        </n-trib-action-extra>
      </n-trib-action>
    </n-trib-row>
  );
};