import React, { useState, useEffect } from 'react';
import Pref from '/client/global/pref.js';

const ToggleSearch = ({ 
  batchData, widgetData, variantData, groupData, app,
  tggl, tgglSet, queryState, queryUP, resultUP
})=> {
	
	const [ blendedListState, blendedListSet ] = useState( [] );
  
	useEffect( ()=> {
    const w = widgetData;
    const v = variantData;
    const g = groupData;
    let blendedList = [];
    for(let b of batchData){
      const subW = w.find( x => x._id === b.widgetId);
      const subV = v.find( x => x.versionKey === b.versionKey);
      const subG = g.find( x => x._id === subW.groupId);
      blendedList.push([
        b.batch,
        b.salesOrder || 'n/a',
        subG.alias,
        subW.widget, 
        subV.variant,
        b.tags,
        b.live
      ]);
    }
    blendedListSet( blendedList );
  }, []);

  function batchAction() {
    const valid = queryState && queryState.length > 1;
    if(valid) {
      let showList = blendedListState.filter( tx => tx.toString().toLowerCase()
                                  .includes(queryState.toLowerCase()) === true );
      let sortList = showList.sort((b1, b2)=>
                      b1[0] < b2[0] ? 1 : b1[0] > b2[0] ? -1 : 0);
      resultUP( sortList );
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
        resultUP(reply);
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
        resultUP(reply);
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
    const valid = value && value.length > (tggl ? 2 : tggl === false ? 5 : 3);
    queryUP(value);
    if(!valid) {
      e.target.reportValidity();
    }
  }
  
  const bttnClss = 'action variableInput big';
	
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
          pattern={
            tggl ? '[A-Za-z0-9 _-]*' : 
            tggl === false ? '([0-9]{8,10})|([0-9]{6}[-][0-9]{7})*' : ''
          }
          minLength={tggl ? '2' : tggl === false ? '5' : '3'}
          className='variableInput big'
          onChange={(e)=>handle(e)}
          autoFocus={true}
          required
        />
      </p>
      
      <p>{tggl ? `Find a ${Pref.xBatch} by number, ${Pref.group}, ${Pref.widget} or tag.` : 
          tggl === false ? 'Find an item by whole or partial serial number' :
          `Find by ${Pref.trackFirst} ${Pref.method}, ${Pref.consume} or ${Pref.builder}(by userID)`}
      </p>
      
    </div>
  );
};

export default ToggleSearch;