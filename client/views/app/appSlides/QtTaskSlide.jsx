import React, { Fragment } from 'react';
// import Pref from '/public/pref.js';
// import { toast } from 'react-toastify';

import QtTaskBuilder from '/client/components/bigUi/ArrayBuilder/QtTaskBuilder';

const QtTaskSlide = ({ app, branchesS, isDebug })=> {
  
  function handleNewQualityTime(e) {
    e.preventDefault();
    this.nwQTTgo.disabled = true;
    const nameVal = this.newQttNm.value;
    const brKeyVal = this.newQttBrnch.value;
    if( typeof nameVal === 'string' && typeof brKeyVal === 'string' ) {
      Meteor.call('addQualityTimeTasks', nameVal, brKeyVal, (error, reply)=>{
        error && console.log(error);
        if(reply) {
          this.nwQTTgo.disabled = false;
          this.newQttNm.value = '';
          this.newQttBrnch.value = '';
        }
      });
    }
  }
  
  function runQTupdate() {
    Meteor.call('generateQualityTimeTasks', (error)=>{
      error && console.log(error);
    });
  }

  return(
    <div className='invert space3v overscroll'>
      
      <h2 className='cap'><i className='fas fa-gem fa-fw gapR'></i>Quality/Quoted Time</h2>
      <h3>Categorization for Quotes and Quotas</h3>
      <ul className='line15x max875'>
        <li>The Sub-Tasks are used with their connected branch when clocking-in. The Quality Time (QT) category is used to group the time records for comparison to a required/goal time.</li> 
        <li>For 'Pro' branches, the QT categories should correspond to the customer quote; these are the categories available in product quote time setup.</li>
        <li>Non-Pro branches will use the QT Sub-Tasks for 'Internal' work orders and the QT categories will be used to measure time in an organisational context.</li>
        <li>Static Qt groups will apply time as a fixed chunk. Dynamic (Not Static) groups will scale the time to the order quantity.</li>
      </ul>
      
      <p className='lAlign max875'>
        <i className='fas fa-exclamation-circle'></i>
        <i> Entries are case sensitive, "smt" does not equal "SMT".</i>
        <i> Capitalizing is unnecessary in most cases and only recommended for abbreviations.</i>
        <i> Text Areas allow for multiple entries by seperating by comma (,) or semicolon (;) </i>
      </p>
      
      {app.qtTasks ?
      <Fragment>
      
      <QtTaskBuilder app={app} branchesS={branchesS} isDebug={isDebug} />
      
      <h2 className='dropCeiling'>Add New Quality Time Category</h2>
      <form onSubmit={(e)=>handleNewQualityTime(e)} className='rowWrap gapminC'>
        <span>
          <label htmlFor='newBrchNm'>Category Name</label><br />
          <input
            type='text'
            id='newQttNm'
            required />
        </span>
        <span>
          <label htmlFor='newBrchCmn'>Branch</label><br />
          <select
            id='newQttBrnch'
            required>
            <option></option>
            {branchesS.map((b,i)=>{
              if(b.open) {
                return <option key={i+'-'+b.brKey} value={b.brKey}>{b.branch}</option>;
              }
            })}
          </select>
        </span>
        <span className='endSelf'>
          <button
            type='submit'
            id='nwQTTgo'
            className='action greenSolid'
            disabled={false}
          >Add</button>
        </span>
      </form>
      </Fragment>
      :
      <Fragment>
        <h2 className='dropCeiling'>Update Database for Quality Time</h2>
        <button
          title='run migration'
          onClick={()=>runQTupdate()}
          className='action blueSolid'>Run Update Function</button>
      </Fragment>
      }
    </div>
  );
};

export default QtTaskSlide;