import React, { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment-timezone';
// import Pref from '/client/global/pref.js';

import DownstreamTools from './DownstreamTools';
import ShipWindows from './ShipWindows';


const DownstreamView = ({ 
  traceDT, pCache,
  user, app, isDebug, isNightly
})=> {
  
  const sessionSticky = 'overviewDownstream';
  
  const [ loadTime, loadTimeSet ] = useState( moment() );
                        
  const sessionDense = Session.get(sessionSticky+'dense');
  const defaultDense = sessionDense !== undefined ? sessionDense :
                        user.miniAction || false;
                        
  const sessionLight = Session.get(sessionSticky+'lightTheme');
  const defaultLight =  sessionLight !== undefined ? sessionLight :
                        user.preferLight || false;
  
  const [ calcFor, calcForSet ] = useState(6);
  
  const [ focusBy, focusBySet ] = useState( Session.get(sessionSticky+'focus') || false );
  //const [ sortBy, sortBySet ] = useState( Session.get(sessionSticky+'sort') || 'priority' );
  const [ dense, denseSet ] = useState( defaultDense );
  const [ light, themeSet ] = useState( defaultLight );
  
  const [ updateTrigger, updateTriggerSet ] = useState(true);
  
  useEffect( ()=>{
    Meteor.call('REQUESTcacheUpdate', 
      false, // batchUp
      true, // priorityUp
      false, // activityUp
      false, // branchConUp
      false, // compUp
    ()=>{
      loadTimeSet( moment() );
      Meteor.call('updateLiveMovement');
    });
  }, [updateTrigger]);
  
  function changeNum(e) {
    const cleanVal = Number(e) < 1 ? 1 :
                    Number(e) > 24 ? 24 :
                    Number(e);
    calcForSet( cleanVal );
  }
  
  // function changeSort(e) {
  //   const sort = e.target.value;
  //   sortBySet( sort );
  //   Session.set(sessionSticky+'sort', sort);
  // }
  
  function changeFocus(e) {
    const value = e.target.value;
    const focus = value === 'false' ? false : value;
    focusBySet( focus );
    Session.set(sessionSticky+'focus', focus);
  }
  
  function changeDense(val) {
    denseSet( val );
    Session.set(sessionSticky+'dense', val);
  }
  
  function changeTheme(val) {
    themeSet( val );
    Session.set(sessionSticky+'lightTheme', val);
  }
  
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
        'lightTheme invert downstreamView' : 'downstreamView'}`}
    >
    
      <DownstreamTools
        app={app}
        traceDT={traceDT}
        loadTimeUP={loadTime}
        numUP={calcFor}
        changeNumUP={(e)=>changeNum(e.target.value)}
        
        focusByUP={focusBy}
        changeFocusByUP={(e)=>changeFocus(e)}
        
        // sortByUP={sortBy}
        denseUP={dense}
        lightUP={light}
        
        // changeSortUP={(e)=>changeSort(e)}
        denseSetUP={(e)=>changeDense(e)}
        themeSetUP={(e)=>changeTheme(e)}
        
        doThing={()=>updateTriggerSet(!updateTrigger)}
      />
              
      <ShipWindows
        calcFor={calcFor}
        traceDT={traceDT}
        pCache={pCache.dataSet}
        brancheS={brancheS}
        app={app}
        user={user}
        isDebug={isDebug}
        focusBy={focusBy}
        dense={density}
        updateTrigger={updateTrigger}
      />

    </div>
  );
};

export default DownstreamView;