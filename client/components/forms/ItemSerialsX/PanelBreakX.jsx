import React, { useState, Fragment } from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelLarge from '/client/layouts/Models/ModelLarge';

const PanelBreakX = ({ seriesId, batchId, batchNum, item })=> {
  
  const auth = Roles.userIsInRole(Meteor.userId(), 'remove');
  let done = item.completed;
  
  const aT = !auth ? Pref.norole : '';
  const lock = done || item.units < 2;
  const lT = lock ? 'unavailable' : '';
  const title = auth && !lock ? 'Split Panel Into Its Units' : `${aT}\n${lT}`;
  
  return(
    <ModelLarge
      button='Split Panel'
      title={title}
      color='blueT'
      icon='fa-cut'
      lock={!auth || lock}
    >
      <PanelBreakForm
        seriesId={seriesId}
        batchId={batchId}
        batchNum={batchNum}
        item={item}
      />
    </ModelLarge>
  );
};

export default PanelBreakX;

const PanelBreakForm = ({ seriesId, batchId, batchNum, item })=> {
  
  const [ newSerials, newSerialsSet ] = useState([]);
  const [ confirmState, confirmSet ] = useState(false);

  
  function setSerials(e) {
    const srlInput = this.serials.value.trim().replace(",", " ");
    let cutInput = srlInput.split(/\s* \s*/gi);
    newSerialsSet( cutInput );
  }
  
  function splitApart(e) {
    e.preventDefault();
    const serial = item.serial;
    
    if(newSerials.length > 0) {
      let overlap = newSerials.find( x => x === serial);
      if(!overlap) {
        Meteor.call('breakItemIntoUnitsX', batchId, seriesId, serial, newSerials, 
        (error, reply)=>{
          if(error)
          console.log(error);
        if(reply) {
          toast.success('Saved');
          FlowRouter.go(`/data/batch?request=${batchNum}`);
        }else{
          toast.error('Server Error');
        }
        });
      }else{toast.error('Error');}
    }else{toast.error('Error');}
  }

  return(
    <Fragment>
      <p className='medBig space'>
        <b>Transform this item into new individual units</b><br />
        <i>New Items are created with a copy of this item's history</i><br />
        <i>NonConformances & Shortfalls WILL BE LOST</i><br />
        <i>The highest serial number is NOT saved in the app settings</i><br />
        <i>The original IS deleted</i><br />
      </p>
      <br />
      <form
        className='centre'
        onSubmit={(e)=>splitApart(e)}>
        <div className='balance'>
          <p>
            <textarea
              id='serials'
              onChange={(e)=>setSerials(e)}
              cols='5'
              rows='5'
              defaultValue=''
              autoFocus={true}
              required></textarea>
            <label htmlFor='con'>New serials for each new item</label>
            <br />
            <em>{item.units} numbers, separated by a space</em>
          </p>
          <ol className='medBig'>
            {newSerials.map( (entry, index)=>{
              return( <li key={index}>{entry}</li> );
            })}
          </ol>
        </div>
        <p>
          <button
            id='pBrkGO'
            disabled={newSerials.length !== item.units}
            className='action nSolid'
            type='button'
            onClick={(e)=>confirmSet(true)}
          >Split</button>
        </p>
        <div>
          {confirmState &&
            <p><b>Are you sure? </b><button
                className='smallAction redHover inlineButton'
                type='submit'
              >YES</button>
              <button
                className='smallAction blackHover inlineButton'
                type='button'
                onClick={(e)=>confirmSet(false)}
              >NO</button>
            </p>
          }
        </div>
      </form>
    </Fragment>
  );
};