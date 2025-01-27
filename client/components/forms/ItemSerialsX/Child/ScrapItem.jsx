import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelNative from '/client/layouts/Models/ModelNative';

const ScrapItem = ({ seriesId, item, ancillary })=> {    
      
  function handleScrap() {
    this.scpGO.disabled = true;
  
    const bar = item.serial;
    const where = this.discStp.value.trim().toLowerCase();
    const comm = this.scomment.value.trim().toLowerCase();
      
    Meteor.call('scrapItemX', seriesId, bar, where, comm, (error, reply)=> {
      if(error)
        console.log(error);
      if(reply) {
        toast.success('Item scrapped');
      }else{
        console.log('BLOCKED BY SERVER METHOD');
        toast.error('Server Error');
      }
    });
  }
	
	return(
	  <ModelNative
      dialogId={item.serial+'_scrap_form'}
      title={`${Pref.scrap} ${Pref.item}`}
      icon='fa-solid fa-trash-alt'
      colorT='redT'
      dark={false}>
	    
	  <form className='centre' onSubmit={(e)=>handleScrap(e)}>
      <p><b>Are you sure you want to do this?</b></p>
      <p>
        <input
          id='discStp'
          className='cap'
          list='shortcuts'
          required />
        <label htmlFor='discStp'>current process</label>
        <datalist id='shortcuts' className='cap'>
            {ancillary.map( (entry, index)=>{
              return ( 
                <option key={index} value={entry}>{entry}</option>
            )})}
        </datalist>
      </p>
      <p>
        <textarea
          id='scomment'
          className=''
          placeholder='reason for scrapping'
          rows='5'
          required></textarea>
        <label htmlFor='scomment'>comment</label>
      </p>
      <br />
      <p>
        <button 
          type="submit"
          formMethod="dialog"
          className='action redSolid'
          id='scpGO'
          disabled={false}
          >SCRAP {item.serial}</button>
      </p>
    </form>
    </ModelNative>
  );
};

export default ScrapItem;