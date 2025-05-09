import React, { useState, useEffect, useLayoutEffect } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import Spin from '/client/components/tinyUi/Spin.jsx';

import UpstreamTools from './UpstreamTools';
import UpstreamHeaders from './UpstreamHeaders';
import UpstreamDetails from './UpstreamDetails';


const UpstreamView = ({ batchX, traceDT, user, app, brancheS, isAuth, isDebug })=> {
  
  const sessionSticky = 'overviewUpstream';
  
  const [ loadTime, loadTimeSet ] = useState( moment() );
                        
  const sessionLight = Session.get(sessionSticky+'lightTheme');
  const defaultLight =  sessionLight !== undefined ? sessionLight :
                        user.preferLight || false;
  
  const [ focusBy, focusBySet ] = useState( Session.get(sessionSticky+'focus') || false );
  const [ salesBy, salesBySet ] = useState( Session.get(sessionSticky+'sales') || false );
  const [ sortBy, sortBySet ] = useState( Session.get(sessionSticky+'sort') || 'priority' );
  const [ tagBy, tagBySet ] = useState( Session.get(sessionSticky+'tags') || false );
  
  const [ light, themeSet ] = useState( defaultLight );
  
  const [ liveState, liveSet ] = useState( false );
  const [ holdState, holdSet ] = useState( [] );
  const [ holdShow, holdshowSet ] = useState( false );
  
  useLayoutEffect( ()=> {
    sortInitial();
  }, [batchX, traceDT, salesBy, sortBy]);
  
  const [ updateTrigger, updateTriggerSet ] = useState(true);
  
  useEffect( ()=>{
    Meteor.setTimeout( ()=> {
      Meteor.call('updateLiveNoise');
    },2000);
  }, [updateTrigger]);
  
  useEffect( ()=>{
    loadTimeSet( moment() );
  }, [traceDT]);
  
  function changeFocus(e) {
    const value = e.target.value;
    const focus = value === 'false' ? false : value;
    focusBySet( focus );
    Session.set(sessionSticky+'focus', focus);
    salesBySet( false );
    Session.set(sessionSticky+'sales', false);
  }
  
  function changeSort(e) {
    const sort = e.target.value;
    sortBySet( sort );
    Session.set(sessionSticky+'sort', sort);
  }
  
  function changeSales(e) {
    const value = e.target.value;
    const sales = value === 'false' ? false : value;
    salesBySet( sales );
    Session.set(sessionSticky+'sales', sales);
  }
  
  function changeTag(e) {
    const value = e.target.value;
    const tag = value === 'false' ? false : value;
    tagBySet( tag );
    Session.set(sessionSticky+'tags', tag);
  }
  
  function changeTheme(val) {
    themeSet( val );
    Session.set(sessionSticky+'lightTheme', val);
  }
  
  function sortInitial() {
    return new Promise((resolve) => {
      
      let liveBatches = batchX.filter( bx => bx.releases !== undefined );
      
      let filteredBatches = liveBatches.filter( bx => {
        const releasedToFloor =
          bx.releases.findIndex( x => x.type === 'floorRelease') >= 0;
        if(!releasedToFloor) {
          return bx;
        }
      });

      const limitToSales = !salesBy ? filteredBatches :
                      filteredBatches.filter( l => l.salesOrder === salesBy );
      
      const orderedBatches = 
        sortBy === 'priority' ?
          limitToSales.sort((b1, b2)=> {
            const pB1 = traceDT.find( x => x.batchID === b1._id);
            const pB1bf = pB1 ? pB1.bffrRel : null;
            const pB2 = traceDT.find( x => x.batchID === b2._id);
            const pB2bf = pB2 ? pB2.bffrRel : null;
            if (isNaN(pB1bf) || !!pB1.hold) { return 1 }
            if (isNaN(pB2bf) || !!pB2.hold) { return -1 }
            if (pB1.lateLate) { return -1 }
            if (pB2.lateLate) { return 1 }
            if (pB1bf < pB2bf) { return -1 }
            if (pB1bf > pB2bf) { return 1 }
            return 0;
          })
        :
        sortBy === 'sales' ?
          filteredBatches.sort((b1, b2)=> {
            if (b1.salesOrder < b2.salesOrder) { return -1 }
            if (b1.salesOrder > b2.salesOrder) { return 1 }
            return 0;
          })
        :
        sortBy === 'due' ?
          filteredBatches.sort((b1, b2)=> {
            let endDate1 = b1.salesEnd || b1.end;
            let endDate2 = b2.salesEnd || b2.end;
            if (endDate1 < endDate2) { return -1 }
            if (endDate1 > endDate2) { return 1 }
            return 0;
          })
        :
        filteredBatches.sort((b1, b2)=> {
          if (b1.batch < b2.batch) { return 1 }
          if (b1.batch > b2.batch) { return -1 }
          return 0;
        });
      
      liveSet( orderedBatches.filter( x => !x.hold ) );
      holdSet( orderedBatches.filter( x => x.hold ) );
    });
  }
  
  return(
    <div key={0} className={`upstreamView ${light ? 'lightTheme' : 'darkTheme'}`}>
    
      <UpstreamTools
        traceDT={traceDT}
        loadTimeUP={loadTime}
        focusByUP={focusBy}
        changeFocusByUP={(e)=>changeFocus(e)}
        salesByUP={salesBy}
        changeSalesUP={(e)=>changeSales(e)}
        tagBy={tagBy}
        changeTagsUP={(e)=>changeTag(e)} 
        sortByUP={sortBy}
        changeSortUP={(e)=>changeSort(e)}
        lightUP={light}
        themeSetUP={(e)=>changeTheme(e)}
        doThing={()=>updateTriggerSet(!updateTrigger)}
      />
      
      <div className='overviewContent forceScrollStyle' tabIndex='0'>
        
      {!liveState ?
        <div className='centreContainer'>
          <div className='centrecentre'>
            <Spin />
          </div>
        </div>
      :  
        <div className='overGridWideFrame'>
          
          <UpstreamHeaders
            key='fancylist0'
            oB={liveState}
            hB={holdState}
            traceDT={traceDT}
            app={app}
            isDebug={isDebug}
            title={Pref.kitting}
            holdShow={holdShow}
            holdshowSet={holdshowSet}
            focusBy={focusBy}
            tagBy={tagBy}
          />

          <UpstreamDetails
            key='fancylist1'
            oB={liveState}
            hB={holdState}
            traceDT={traceDT}
            user={user}
            app={app}
            brancheS={brancheS}
            isAuth={isAuth}
            isDebug={isDebug}
            holdShow={holdShow}
            holdshowSet={holdshowSet}
            focusBy={focusBy}
            tagBy={tagBy}
          />
            
        </div>
      }  
      </div>
    </div>
  );
};

export default UpstreamView;