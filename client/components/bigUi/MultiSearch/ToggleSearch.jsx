import React, { useState, useEffect } from 'react';
import Pref from '/client/global/pref.js';

const ToggleSearch = ({ 
  tggl, tgglSet, queryState, queryUP, resultUP
})=> {

  function batchAction() {
    const valid = queryState && queryState.length > 2;
    if(valid) {
      Meteor.call('batchExtraLookup', queryState, (error, reply)=>{
        error && console.log(error);
        if(reply) {
          let sortList = reply.sort((b1, b2)=>
                          b1[0] < b2[0] ? 1 : b1[0] > b2[0] ? -1 : 0);
          resultUP( sortList );
        }
  	  });
    }else{
      resultUP(null);
    }
  }
  
  function serialAction() {
    resultUP(undefined);
    const valid = queryState && queryState.length > 4;
    if(valid) {
      Meteor.call('serialLookupPartial', queryState, (error, reply)=>{
        error && console.log(error);
        resultUP(reply.sort((b1, b2)=>b1[0] < b2[0] ? 1 : b1[0] > b2[0] ? -1 : 0));
  	  });
    }else{
      resultUP(null);
    }
  }
  
  function verifyAction() {
    resultUP(undefined);
    const valid = queryState && queryState.length > 2;
    if(valid) {
  	  Meteor.call('firstVerifyLookup', queryState, (error, reply)=>{
        error && console.log(error);
        resultUP(reply.sort((b1, b2)=>b1[0] < b2[0] ? 1 : b1[0] > b2[0] ? -1 : 0));
  	  });
    }else{
      resultUP(null);
    }
  }
  
	useEffect( ()=> {
    if(tggl) {
      batchAction();
    }else if(tggl === false) {
      serialAction();
    }else{
      verifyAction();
    }
  }, [queryState, tggl]);
  
  function doTog(v) {
    tgglSet(v);
    this.multiSearch.focus();
  }
  
  function handle(e) {
    const value = e.target.value;
    const valid = value && value.length > (tggl === false ? 5 : 3);
    queryUP(value);
    if(!valid) {
      e.target.reportValidity();
    }
  }
  
  const bttnClss = 'smallAction variableInput big';
	
	return(
		<div className='wide centre centreText'>
	    <p>
	      <button
	        title={`${Pref.xBatchs}`}
          className={`${bttnClss} ${tggl ? 'toggleOn' : 'toggleOff'}`}
          onClick={(e)=>doTog(true)}
        ><i className="fas fa-cubes fa-fw"></i></button>
        
        <button
          title={`${Pref.item} ${Pref.itemSerial}s`}
          className={`${bttnClss} ${tggl === false ? 'toggleOn' : 'toggleOff'}`}
          onClick={(e)=>doTog(false)}
        ><i className="fas fa-qrcode fa-fw"></i></button>
        
        <button
          title={`${Pref.trackFirst} details`}
          className={`${bttnClss} ${tggl === null ? 'toggleOn' : 'toggleOff'}`}
          onClick={(e)=>doTog(null)}
        ><i className="fas fa-check-double fa-fw"></i></button>
      
        <input
          id='multiSearch'
          type='search'
          pattern='[A-Za-z0-9\.()_\-\s#,:[\]/\\]*'
          minLength={tggl === false ? '5' : '3'}
          className='variableInput big'
          onChange={(e)=>handle(e)}
          autoFocus={true}
          required
        />
      </p>
      
      <p>{tggl ? `Find by number, ${Pref.group}, ${Pref.widget}, sales order, tag, ${Pref.radio}, Notes content, ${Pref.shortfall} ${Pref.comp}, ${Pref.rapidEx} ID or issue.` : 
          tggl === false ? 'Find an item by whole or partial serial number.' :
          `Find by ${Pref.trackFirst}, ${Pref.method}, ${Pref.consume} or `}
          {tggl === null && <abbr title="only by exact user ID">{Pref.builder}</abbr>}.
      </p>
    </div>
  );
};

export default ToggleSearch;