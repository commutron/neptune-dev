
function NonConOptionMerge(ncListKeys, app, user, allKeys) {

  const ncListKeysFlat = ncListKeys.flat();
  if(ncListKeysFlat.length === 0 && !allKeys) {
    return app.nonConOption;
  }else{
    const asignedNCLists = allKeys ? app.nonConTypeLists :
                            app.nonConTypeLists.filter( 
                              x => ncListKeysFlat.find( y => y === x.key ) 
                            ? true : false );
    
    const ncTypeLists = Array.from(asignedNCLists, x => x.typeList);
  	
  	const ncTypesCombo = [].concat(...ncTypeLists);
  	
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

export default NonConOptionMerge;