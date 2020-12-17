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
    const valid = queryState && queryState.length > 0;
    if(valid) {
      let showList = blendedListState.filter( tx => tx.toString().toLowerCase()
                                  .includes(queryState.toLowerCase()) === true );
      let sortList = showList.sort((b1, b2)=> {
                  if (b1[0] < b2[0]) { return 1 }
                  if (b1[0] > b2[0]) { return -1 }
                  return 0;
                });
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
  
	useEffect( ()=> {
    if(tggl) {
      batchAction();
    }else{
      serialAction();
    }
  }, [queryState, tggl]);
  
  function doTog(v) {
    tgglSet(v);
    this.multiSearch.focus();
  }
  
  function handle(e) {
    const value = e.target.value;
    const valid = value && value.length > (tggl ? 0 : 4);
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
	        title={`${Pref.batches} & ${Pref.xBatchs}`}
          className={`${bttnClss} ${tggl ? 'toggleOn' : 'toggleOff'}`}
          onClick={(e)=>doTog(true)}
        ><i className="fas fa-cubes fa-fw"></i></button>
        
        <button
          title={`${Pref.item} ${Pref.itemSerial}s/${Pref.serialType}s`}
          className={`${bttnClss} ${!tggl ? 'toggleOn' : 'toggleOff'}`}
          onClick={(e)=>doTog(false)}
        ><i className="fas fa-qrcode fa-fw"></i></button>
      
        <input
          id='multiSearch'
          type='search'
          pattern={tggl ? '[A-Za-z0-9 _-]*' : '([0-9]{8,10})|([0-9]{6}[-][0-9]{7})*'}
          minLength={tggl ? '0' : '5'}
          className='variableInput big'
          onChange={(e)=>handle(e)}
          autoFocus={true}
          required
          list={tggl ? 'tagList' : null}
        />
        {/*tggl &&
        <datalist id='tagList'>
          {app.tagOption && app.tagOption.map( (entry, index)=>{
            return ( 
              <option key={index} value={entry} className=''>{entry}</option>
          )})}
        </datalist>*/}
      </p>
      
      <p>{tggl ? `Find a ${Pref.batch} by number, ${Pref.group}, ${Pref.widget} or tag.` : 
                 `Find an item by whole or partial serial number`}
      </p>
      
    </div>
  );
};

export default ToggleSearch;