import React, { useState, Fragment } from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelNative from '/client/layouts/Models/ModelNative';

const PanelBreak = ({ seriesId, batchId, batchNum, item, access })=> {
  
  const [ newSerials, newSerialsSet ] = useState([]);
  const [ confirmState, confirmSet ] = useState(false);
  
  function setSerials() {
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
    <ModelNative
      dialogId={item.serial+'_split_form'}
      title='Split Panel Into Its Units'
      icon='fa-solid fa-cut'
      colorT='blueT'
      dark={false}>
      
    <Fragment>
      <p className='medBig spacehalf'>
        <b>Transform this item into new individual units</b>
      </p>
      <ul>
        <li>New Items are created with a copy of this item's history</li>
        <li>NonConformances & Shortfalls WILL BE LOST</li>
        <li>The highest serial number is NOT saved in the app settings</li>
        <li>The original IS deleted</li>
      </ul>
      
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
                formMethod="dialog"
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
    </ModelNative>
  );
};

export default PanelBreak;