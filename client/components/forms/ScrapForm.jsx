import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import Model from '../smallUi/Model.jsx';

//requires
// id
// barcode

const ScrapForm = (props)=> {
  
  function handleScrap(e) {
    e.preventDefault();
    this.go.disabled = true;
    const batchId = props.id;  
    const bar = props.item.serial;
    const where = this.discStp.value.trim().toLowerCase();
    const comm = this.scomment.value.trim().toLowerCase();
      
    Meteor.call('scrapItem', batchId, bar, where, comm, (error, reply)=> {
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
		
	let done = props.item.finishedAt !== false;
  let scrap = done ? props.item.history.find(x => x.type === 'scrap') : false;
		
	return(
	  <Model
      button={Pref.scrap}
      title={Pref.scrap + ' ' + Pref.item}
      color='redT'
      icon='fa-trash'
      lock={!Roles.userIsInRole(Meteor.userId(), 'qa') || scrap}
      noText={props.noText}>
		  <form className='centre' onSubmit={(e)=>handleScrap(e)}>
		    <br />
	      <p><b>Are you sure you want to do this?</b></p>
	      <br />
	      <p>
          <input
            id='discStp'
            className='cap redIn'
            list='shortcuts'
            required />
          <label htmlFor='discStp'>current process</label>
          <datalist id='shortcuts' className='cap'>
              {props.anc.map( (entry, index)=>{
                return ( 
                  <option key={index} value={entry}>{entry}</option>
              )})}
          </datalist>
        </p>
	      <p>
          <textarea
            id='scomment'
            className='redIn'
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
            id='go'
            disabled={false}
            >SCRAP {props.item.serial}</button>
        </p>
      </form>
    </Model>
  );
};

export default ScrapForm;