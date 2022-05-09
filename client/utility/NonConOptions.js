export function NonConCheck(target, flatCheckList) {
  let match = flatCheckList.find( x => x === target.value);
  let message = !match ? 'please choose from the list' : '';
  target.setCustomValidity(message);
  return !match ? false : true;
}

export function NonConMerge(ncListKeys, app, user, allKeys) {

  const ncListKeysFlat = ncListKeys.flat();
  if(ncListKeysFlat.length === 0 && !allKeys) {
    return app.nonConOption;
  }else{
    const asignedNCLists = allKeys ? app.nonConTypeLists :
                            app.nonConTypeLists.filter( 
                              x => ncListKeysFlat.find( y => y === x.key ) 
                            ? true : false );
    
    const ncTypeLists = Array.from(asignedNCLists, x => x.typeList);
  	
  	const ncTypesCombo = !allKeys ? [].concat(...ncTypeLists) :
  	                      [].concat(...ncTypeLists,...app.nonConOption);
  	
  	const ncTypesComboSort = user.showNCcodes ?
  	        ncTypesCombo.sort((n1, n2)=>
              n1.typeCode < n2.typeCode ? -1 : 
              n1.typeCode > n2.typeCode ? 1 : 0 )
          :
            ncTypesCombo.sort((n1, n2)=>
              n1.typeText < n2.typeText ? -1 : 
              n1.typeText > n2.typeText ? 1 : 0 );
       
    return ncTypesComboSort;
  }
}

export const onFire = ()=> (
  navigator.userAgent.indexOf("Firefox") !== -1 ? "off" : ""
// ^^^ workaround for persistent bug in desktop Firefox ^^^
);