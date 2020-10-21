
function NonConOptionMerge(ncListKeys, app, allKeys) {

  const ncListKeysFlat = ncListKeys.flat();
  if(ncListKeysFlat.length === 0) {
    return app.nonConOption;
  }else{
    const asignedNCLists = allKeys ? app.nonConTypeLists :
                            app.nonConTypeLists.filter( 
                              x => ncListKeysFlat.find( y => y === x.key ) 
                            ? true : false );
    
    const ncTypeLists = Array.from(asignedNCLists, x => x.typeList);
  	
  	const ncTypesCombo = [].concat(...ncTypeLists);
  	
  	const ncTypesComboSort = ncTypesCombo.sort((n1, n2)=> {
    return n1.typeCode < n2.typeCode ? -1 : n1.typeCode > n2.typeCode ? 1 : 0 });
       
       
    return ncTypesComboSort;
  }
  
}

export default NonConOptionMerge;