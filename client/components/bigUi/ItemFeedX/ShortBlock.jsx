import React, { useState } from 'react';
import './style.css';
import Pref from '/client/global/pref.js';

import UserNice from '/client/components/smallUi/UserNice.jsx';

const ShortBlock = ({ seriesId, serial, units, entry, iopen, canQA, cal })=> {
  
  const [ editState, editSet ] = useState(false);
  const [ confirmState, confirmSet ] = useState(false);
  
  function handleChange() {
    const shKey = entry.key;
    const partNum = this.shPN.value.trim();
    const refs = this.shRefs.value.trim().toLowerCase()
                  .replace(Pref.listCut, "|").split("|").filter(f=>f);
    const multi = units > 1 ? this.shMulti.value : undefined;           
                  
    let effect = null;
    let solve = null;
    const act = this.shAct.value;
    switch(act) {
      case Pref.doOmit : // Leave thing out, Continue and Ship
        effect = true; 
        break;
      case Pref.shortageWaiting : // Waiting to be Able to Resolve
        effect = false;
        solve = null;
        break;
      case Pref.notResolved : // Can be Resolved but is Not Yet
        effect = false;
        solve = false;
        break;
      case Pref.isResolved : // Problem is Resolved
        effect = false;
        solve = true;
        break;
      default:
        null; // Don't have a thing, what to do?
    }
    const comm = this.shCm.value.trim();
    
    Meteor.call('editShortX', 
      seriesId, serial, shKey, partNum, refs, multi, effect, solve, comm, 
    (error)=> {
      error && console.log(error);
			editSet(false);
		});
  }
  
  function popSh(e) {
    const shKey = entry.key;
    Meteor.call('removeShortX', seriesId, shKey, (error)=>{
      error && console.log(error);
      confirmSet(false);
      editSet(false);
    });
  }
  
  const dt = entry;
  
  const inE = dt.inEffect;
  const reS = dt.reSolve;
  const actionState = inE === null ? Pref.shortagePending : 
                      inE === true ? Pref.doOmit : 
                      reS === null ? Pref.shortageWaiting : 
                      reS === false ? Pref.notResolved : 
                      reS === true ? Pref.isResolved : 
                      'unknown';
    
  const open = inE === true || reS === true ?
          <n-fa1><i className="fa-solid fa-check-circle fa-lg fa-fw" title='Good'></i></n-fa1> :
          <n-fa2><i className="fa-regular fa-circle fa-lg fa-fw" title='Awaiting Repair'></i></n-fa2>;
                
  const editAllow = Roles.userIsInRole(Meteor.userId(), 'verify') && iopen;
  const editIndicate = editState ? 'editStandout' : '';     

  return(
    <n-feed-info-block class={`short ${editIndicate}`}>
      <n-feed-left-anchor>{open}</n-feed-left-anchor>
      <n-feed-info-center>
      {editState === true ?
        <n-feed-info-title>
          <input
            type='text'
            id='shPN'
            className='up miniIn18'
            placeholder='References'
            defaultValue={dt.partNum} />
          <input
            type='text'
            id='shRefs'
            className='up miniIn18'
            placeholder='Part Number'
            defaultValue={dt.refs.toString()} />
          {units > 1 &&
            <input
              type='number'
              id='shMulti'
              title={`${Pref.nonCon} occurs on how many ${Pref.unit}s?`}
              className='up miniIn8'
              pattern='[0-9]*'
              maxLength='4'
              max={units}
              min={1}
              defaultValue={dt.multi || 1}
              required
              placeholder={Pref.unit+'s'} />
          }
          <select 
            id='shAct'
            className='miniIn18'
            defaultValue={actionState}
            required>
            <option value={Pref.shortagePending}>{Pref.shortagePending}</option>
            <option value={Pref.doOmit}>{Pref.doOmit}</option>
            <option value={Pref.shortageWaiting}>{Pref.shortageWaiting}</option>
            <option value={Pref.isResolved}>{Pref.isResolved}</option>
          </select>
          <input
            type='text'
            id='shCm'
            className='miniIn24'
            placeholder='comment'
            defaultValue={dt.comm}/>
              
          <div className='wide comfort'> 
            <span>
              <button
                className='smallAction inlineButton vmarginhalf redHover blackT'
                onClick={(e)=>confirmSet(true)}
                disabled={!canQA}
              >Remove</button>
              {confirmState &&
                <span><b> Are you sure? </b><button
                    className='smallAction redHover blackT inlineButton'
                    disabled={!canQA}
                    onClick={(e)=>popSh(e)}
                  >YES</button>
                  <button
                    className='smallAction blackHover inlineButton'
                    disabled={!canQA}
                    onClick={(e)=>confirmSet(false)}
                  >NO</button>
                </span>
              }
            </span>
            <button
              className='smallAction inlineButton vmarginhalf greenHover blackT'
              onClick={(e)=>handleChange(e)}
            >Save</button>
          </div>
          
        </n-feed-info-title>
      :
        <n-feed-info-title class='doFlexWrap'>
          
          <span className='up'>{dt.partNum}</span>
          <span className='up'
            >{dt.refs.toString()}{dt.multi > 1 && <sup> x{dt.multi}</sup>}
          </span>
          <span className='cap'>{dt.where}</span>
          <span><UserNice id={dt.cWho} /></span>
          <span>{cal(dt.cTime)}</span>

        </n-feed-info-title>
      }

      <dl>
        <dd>Last Updated: <UserNice id={dt.uWho} /> {cal(dt.uTime)}</dd>
        <dd>{actionState}</dd>
      </dl>
      {dt.comm !== '' && <p className='endComment'><i className='far fa-comment'></i> {dt.comm}</p>}
    
    </n-feed-info-center>
    <n-feed-right-anchor>
      <button
        className='miniAction'
        onClick={(e)=>editSet(!editState)}
        disabled={!editAllow}>
        {editState === true ? 'cancel' : 
          <n-fa1><i className='fa-solid fa-edit fa-lg fa-fw'></i></n-fa1>}
      </button>
      </n-feed-right-anchor>
    </n-feed-info-block>
  );
};

export default ShortBlock;