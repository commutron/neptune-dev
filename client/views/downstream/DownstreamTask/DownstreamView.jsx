import React, {useState, useLayoutEffect } from 'react';
import moment from 'moment';
import 'moment-timezone';
import Pref from '/client/global/pref.js';

import Spin from '/client/components/tinyUi/Spin.jsx';

import DownstreamTools from './DownstreamTools';
import ShipWindows from './ShipWindows';


const DownstreamView = ({ 
  batch, batchX, bCache, pCache, acCache, brCache, zCache,
  user, clientTZ, app, isDebug, isNightly
})=> {
  
  const sessionSticky = 'overviewDownstream';
  
  // const [ working, workingSet ] = useState( false );
  const [ loadTime, loadTimeSet ] = useState( moment() );
                        
  const sessionDense = Session.get(sessionSticky+'dense');
  const defaultDense = sessionDense !== undefined ? sessionDense :
                        user.miniAction || false;
                        
  const sessionLight = Session.get(sessionSticky+'lightTheme');
  const defaultLight =  sessionLight !== undefined ? sessionLight :
                        user.preferLight || false;
  
  const [ calcFor, calcForSet ] = useState(6);
  const [ sortBy, sortBySet ] = useState( Session.get(sessionSticky+'sort') || 'priority' );
  const [ dense, denseSet ] = useState( defaultDense );
  const [ light, themeSet ] = useState( defaultLight );
  
  // const [ liveState, liveSet ] = useState( false );
  /*
  useLayoutEffect( ()=> {
    sortInitial();
  }, [batch, batchX, sortBy]);
  */
  function changeNum(e) {
    const cleanVal = Number(e) < 1 ? 1 :
                    Number(e) > 24 ? 24 :
                    Number(e);
    calcForSet( cleanVal );
  }
  
  function changeSort(e) {
    const sort = e.target.value;
    sortBySet( sort );
    Session.set(sessionSticky+'sort', sort);
  }
  
  function changeDense(val) {
    denseSet( val );
    Session.set(sessionSticky+'dense', val);
  }
  
  function changeTheme(val) {
    themeSet( val );
    Session.set(sessionSticky+'lightTheme', val);
  }
  /*
  function sortInitial() {
    return new Promise((resolve) => {
      
      let liveBatches = [...batch,...batchX];
      
      let filteredBatches = liveBatches.filter( bx => {
        const releasedToFloor = Array.isArray(bx.releases) ?
          bx.releases.findIndex( x => x.type === 'floorRelease') >= 0 :
          typeof bx.floorRelease === 'object';
        if(!releasedToFloor) {
          return bx;
        }
      });
        
      let orderedBatches = filteredBatches;
      
      if(sortBy === 'priority') {
        const pData = pCache.dataSet;
        orderedBatches = filteredBatches.sort((b1, b2)=> {
          
          const pB1 = pData.find( x => x.batchID === b1._id);
          const pB1bf = pB1 ? pB1.estEnd2fillBuffer : null;
          const pB2 = pData.find( x => x.batchID === b2._id);
          const pB2bf = pB2 ? pB2.estEnd2fillBuffer : null;
          if (!pB1bf) { return 1 }
          if (!pB2bf) { return -1 }
          if (pB1.lateLate) { return -1 }
          if (pB2.lateLate) { return 1 }
          if (pB1bf < pB2bf) { return -1 }
          if (pB1bf > pB2bf) { return 1 }
          return 0;
        });
        
      }else if(sortBy === 'sales') {
        orderedBatches = filteredBatches.sort((b1, b2)=> {
          if (b1.salesOrder < b2.salesOrder) { return -1 }
          if (b1.salesOrder > b2.salesOrder) { return 1 }
          return 0;
        });
      }else if( sortBy === 'due') {
        orderedBatches = filteredBatches.sort((b1, b2)=> {
          let endDate1 = b1.salesEnd || b1.end;
          let endDate2 = b2.salesEnd || b2.end;
          if (endDate1 < endDate2) { return -1 }
          if (endDate1 > endDate2) { return 1 }
          return 0;
        });
      }else{
        orderedBatches = filteredBatches.sort((b1, b2)=> {
          if (b1.batch < b2.batch) { return 1 }
          if (b1.batch > b2.batch) { return -1 }
          return 0;
        });
      }
      
      liveSet( orderedBatches );
    });
  }
   */   
  const density = !dense ? '' : 'minifyed';
  
  const branches = app.branches.filter( b => b.open === true );
  const brancheS = branches.sort((b1, b2)=> {
          if (b1.position < b2.position) { return 1 }
          if (b1.position > b2.position) { return -1 }
          return 0;
        });

  return(
    <div
      key={0} 
      className={`${light === true ? 
        'lightTheme invert downstreamView' : 'downstreamView'}`}>
    
      <DownstreamTools
        app={app}
        loadTimeUP={loadTime}
        numUp={calcFor}
        sortByUP={sortBy}
        denseUP={dense}
        lightUP={light}
        changeNumUP={(e)=>changeNum(e.target.value)}
        changeSortUP={(e)=>changeSort(e)}
        denseSetUP={(e)=>changeDense(e)}
        themeSetUP={(e)=>changeTheme(e)}
      />
        
      {/*!liveState ?
        <div className='centreContainer'>
          <div className='centrecentre'>
            <Spin />
          </div>
        </div>
      :   */}
              
        <ShipWindows
          calcFor={calcFor}
          bCache={bCache.dataSet}
          pCache={pCache.dataSet}
          acCache={acCache.dataSet}
          zCache={zCache.dataSet}
          brancheS={brancheS}
          app={app}
          user={user}
          clientTZ={clientTZ}
          density={density}
        />

    </div>
  );
};

export default DownstreamView;