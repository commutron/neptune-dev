
function NonConOptionMerge(ncListKeys, app, allKeys) {

  const ncListKeysFlat = ncListKeys.flat();
  if(ncListKeysFlat.length === 0) {
    return app.nonConOption;
  }else{
    const asignedNCLists = allKeys ? app.nonConTypeLists :
                            app.nonConTypeLists.filter( 
                              x => ncListKeysFlat.find( y => y === x.key ) 
                            ? true : false );
    
    const ncTypesCombo = Array.from(asignedNCLists, x => x.typeList);
  	
  	const ncTypesComboFlat = [].concat(...ncTypesCombo);
  	
    return ncTypesComboFlat;
  }
  
}

export default NonConOptionMerge;