import React, { useState, Fragment } from 'react';
// import ReactDOM from 'react-dom';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import Pref from '/client/global/pref.js';

const NCTributary = ({ seriesId, serial, nonCons, sType })=> {

  function handleAction(ncKey, ACT, extra) {
    Meteor.call('runNCAction', seriesId, ncKey, ACT, extra, (error)=> {
			if(error)
			  console.log(error);
		});
		let findBox = document.getElementById('lookup');
		findBox.focus();
  }
  
  const inspector = Roles.userIsInRole(Meteor.userId(), 'inspect');
  const verifier = Roles.userIsInRole(Meteor.userId(), 'verify');
  
  // const nc = nonCons.filter( 
  //             x => x.serial === item.serial && !x.trash && x.inspect === false )
  //               .sort((n1, n2)=> n1.ref < n2.ref ? -1 : n1.ref > n2.ref ? 1 : 0 );

  // const chunkNC = Object.entries( _.groupBy(nonCons, x=> x.type) );
  /*
  return(
    <Fragment>
      {chunkNC.map( (chunk, chindex)=>{
        const rL = chunk[1][0].ref.charAt(0);
        const cluster = chunk[1].length >= Pref.clusterMin &&
          chunk[1].every(c=>c.ref.charAt(0) === rL);/*&&
          ( chunk[1].every(c=>c.fix === false) || 
          chunk[1].every(c=>c.fix !== false) );
        
        if(cluster) {
          return( 
            <details key={'cluster'+chindex} className='tribCluster'>
              <summary><em><small>NC cluster</small></em>
                <span className='tribInfo'
                  ><n-sm-b>{chunk[0]}</n-sm-b>
                  <n-num>{Array.from(chunk[1], x=>x.ref).join(", ")}</n-num>
                </span>
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
        }else{*/
          return(
            <Fragment /*key={'cluster'+chindex}*/>
              {/*chunk[1]*/nonCons.map( (entry, index)=>{
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
          );/*
        }
      })}
    </Fragment>
  );*/
};

export default NCTributary;

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
    <div className={`cap noCopy tribRow ${snstyle}`}>
      <div className='tribInfo' title={entry.comm}>
        <div className='up numFont'
          >{entry.ref} {entry.comm !== '' && <i className='far fa-comment'></i>}
        </div>
        <div>{entry.type}</div>
      </div>
      <div className='tribAction'>
      <div className='tribActionMain'>
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
        </div>
        <div className='tribActionExtra'>
          <ContextMenuTrigger
            id={entry.key}
            holdToDisplay={1}
            renderTag='span'>
            <i className='fas fa-ellipsis-v fa-fw fa-lg'></i>
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
        </div>
      </div>
    </div>
  );
};