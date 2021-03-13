import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelMedium from '/client/components/smallUi/ModelMedium';

const ScrapItemX = ({ seriesId, item, ancillary, noText })=> {
  
  let done = item.completed;
  let rapid = item.altPath.find( a => a.rapId !== false && a.completed === false );
  let scrap = item.history.find(x => x.type === 'scrap' && x.good === true);
		
	return(
    <ModelMedium
      button={Pref.scrap}
      title={`${Pref.scrap} ${Pref.item}`}
      color='redT'
      icon='fa-trash'
      lock={!Roles.userIsInRole(Meteor.userId(), 'qa') || scrap || (done && !rapid)}
      noText={noText}
    >
      <ScrapForm
        seriesId={seriesId}
        item={item}
        ancillary={ancillary}
      />
    </ModelMedium>
  );
};

export default ScrapItemX;

const ScrapForm = ({ seriesId, item, ancillary, selfclose })=> {    
      
  function handleScrap(e) {
    e.preventDefault();
    this.scpGO.disabled = true;
  
    const bar = item.serial;
    const where = this.discStp.value.trim().toLowerCase();
    const comm = this.scomment.value.trim().toLowerCase();
      
    Meteor.call('scrapItemX', seriesId, bar, where, comm, (error, reply)=> {
      if(error)
        console.log(error);
      if(reply) {
        toast.success('Item scrapped');
        selfclose();
      }else{
        console.log('BLOCKED BY SERVER METHOD');
        toast.error('Server Error');
      }
    });
  }
	
	return(
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
          className='action clearRed'
          id='scpGO'
          disabled={false}
          >SCRAP {item.serial}</button>
      </p>
    </form>
  );
};