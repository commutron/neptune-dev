
function NonConOptionMerge(ncListKeys, app, allKeys) {

  const ncListKeysFlat = ncListKeys.flat();
  
  const asignedNCLists = allKeys ? app.nonConTypeLists :
                          app.nonConTypeLists.filter( 
                            x => ncListKeysFlat.find( y => y === x.key ) 
                          ? true : false );
  
  const ncTypesCombo = Array.from(asignedNCLists, x => x.typeList);
	
	const ncTypesComboFlat = [].concat(...ncTypesCombo,...app.nonConOption);
	
// 	const flatTypeList = Array.from(ncTypesComboFlat, x => 
// 	  typeof x === 'string' ? x : x.typeText
// 	);
	
  return ncTypesComboFlat;
  
}

export default NonConOptionMerge;