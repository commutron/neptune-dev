import React, { useState, useEffect } from 'react';

import { NonConBarCH } from '/client/components/charts/NonCon/NonConBar';
import { countMulti } from '/client/utility/Arrays';

const NonConBarRefs = ({ ncOp, nonCons, app, isDebug })=> {
  
  const [ series, seriesSet ] = useState([]);
  const [ types, typeNumSet ] = useState(null);
  
  useEffect( ()=> {
    const uniqueRefs =  new Set( Array.from(nonCons, x => x.ref) );
    
    const splitByRef = [...uniqueRefs].map( (ref, index)=> {
      let match = nonCons.filter( y => y.ref === ref );
      return{
        'name': ref,
        'ncs': match,
        'index': index
      };
    });
    
    const nonConOptions = ncOp || [];
    
    let splitByType = [];
    let typeSet = new Set();
    for(let ref of splitByRef) {
      let type = [];
      for(let n of nonConOptions) {
        const typeCount = countMulti( ref.ncs.filter( x => x.type === n ) );
        if(typeCount > 0) {
          typeSet.add(n);
          type.push({
            x: typeCount,
            y: n,
            l: ref.name,
          });
        }
      }
      const clrshift = "hwb(7.16deg 14.74% " + (ref.index*10) + "%)";
        splitByType.push({
          label: ref.name,
          data: type,
          backgroundColor: clrshift,
          stack: 'stk'
        });
    }
    typeNumSet([...typeSet]);
    seriesSet( splitByType );
  }, []);
  
  isDebug && console.log({series, types});
  
  return(
    <NonConBarCH
      series={series}
      types={types}
      isDebug={isDebug}
      title='Defect Type and Reference'
    />
  );
};

export default NonConBarRefs;