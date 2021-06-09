import React, { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment-timezone';
import Pref from '/client/global/pref.js';
import { branchesOpenSort } from '/client/utility/Arrays.js';
import DownstreamTools from './DownstreamTools';
import ShipWindows from './ShipWindows';


const DownstreamView = ({ 
  traceDT,
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
  const [ salesBy, salesBySet ] = useState( Session.get(sessionSticky+'sales') || false );
  const [ dense, denseSet ] = useState( defaultDense );
  const [ light, themeSet ] = useState( defaultLight );
  
  const [ updateTrigger, updateTriggerSet ] = useState(true);
  
  useEffect( ()=>{
    Meteor.setTimeout( ()=> {
      Meteor.call('updateLiveNoise');
    },3000);
  }, [updateTrigger]);
  
  useEffect( ()=>{
    loadTimeSet( moment() );
  }, [traceDT]);
  
  function changeNum(e) {
    const cleanVal = Number(e) < 1 ? 1 :
            Number(e) > Pref.downDayMax ? Pref.downDayMax : Number(e);
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
    salesBySet( false );
    Session.set(sessionSticky+'sales', false);
  }

  function changeSales(e) {
    const value = e.target.value;
    const sales = value === 'false' ? false : value;
    salesBySet( sales );
    Session.set(sessionSticky+'sales', sales);
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
  
  const brancheS = branchesOpenSort(app.branches);
  
  return(
    <div
      key={0} 
      className={`${light === true ? 
        'lightTheme downstreamView' : 'darkTheme downstreamView'}`}
    >
    
      <DownstreamTools
        app={app}
        traceDT={traceDT}
        loadTimeUP={loadTime}
        numUP={calcFor}
        changeNumUP={(e)=>changeNum(e.target.value)}
        
        focusByUP={focusBy}
        salesByUP={salesBy}
        denseUP={dense}
        lightUP={light}
        
        changeFocusByUP={(e)=>changeFocus(e)}
        changeSalesUP={(e)=>changeSales(e)}
        denseSetUP={(e)=>changeDense(e)}
        themeSetUP={(e)=>changeTheme(e)}
        
        doThing={()=>updateTriggerSet(!updateTrigger)}
      />
              
      <ShipWindows
        calcFor={calcFor}
        traceDT={traceDT}
        brancheS={brancheS}
        app={app}
        user={user}
        isDebug={isDebug}
        focusBy={focusBy}
        salesBy={salesBy}
        dense={density}
        updateTrigger={updateTrigger}
      />

    </div>
  );
};

export default DownstreamView;