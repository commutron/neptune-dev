import React, { useState, useEffect, useMemo } from 'react';
import moment from 'moment';
import 'moment-timezone';
import Pref from '/client/global/pref.js';
import { branchesOpenSort } from '/client/utility/Arrays.js';
import DownstreamTools from './DownstreamTools';
import ShipWindows from './ShipWindows';


const DownstreamView = ({ traceDT, dayTime, user, app, isDebug })=> {
  
  const sessionSticky = 'overviewDownstream';
  
  const [ loadTime, loadTimeSet ] = useState( moment() );
  
  const sessionProgs = Session.get(sessionSticky+'prog');
  const defaultProgs = sessionProgs !== undefined ? sessionProgs :
                        user.progType || false;
                        
  const sessionLight = Session.get(sessionSticky+'lightTheme');
  const defaultLight =  sessionLight !== undefined ? sessionLight :
                        user.preferLight || false;
  
  const [ calcFor, calcForSet ] = useState(6);
  
  const [ focusBy, focusBySet ] = useState( Session.get(sessionSticky+'focus') || false );
  const [ salesBy, salesBySet ] = useState( Session.get(sessionSticky+'sales') || false );
  const [ tagBy, tagBySet ] = useState( Session.get(sessionSticky+'tags') || false );
  const [ stormy, stormySet ] = useState(false);
  const [ prog, progSet ] = useState( defaultProgs );
  const [ light, themeSet ] = useState( defaultLight );
  
  const [ updateTrigger, updateTriggerSet ] = useState(true);
  
  useEffect( ()=>{
    Meteor.setTimeout( ()=> {
      Meteor.call('updateLiveNoise');
    },2000);
  }, [updateTrigger]);
  
  useEffect( ()=>{
    loadTimeSet( moment() );
  }, [traceDT]);
  
  function changeNum(e) {
    const cleanVal = Number(e) < 1 ? 1 :
            Number(e) > Pref.downDayMax ? Pref.downDayMax : Number(e);
    calcForSet( cleanVal );
  }
  
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
  
  function changeTag(e) {
    const value = e.target.value;
    const tag = value === 'false' ? false : value;
    tagBySet( tag );
    Session.set(sessionSticky+'tags', tag);
  }
  
  function changeState(val, key) {
    Session.set(sessionSticky+key, val);
    switch (key) {
      case 'prog':
        progSet( val );
        break;
      case 'lightTheme':
        themeSet( val );
        break;
      default:
        null;
    }
  }
  
  const brancheS = useMemo( ()=> branchesOpenSort(app?.branches || [], true), [app]);
  
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
        changeFocusByUP={(e)=>changeFocus(e)}
        salesByUP={salesBy}
        changeSalesUP={(e)=>changeSales(e)}
        tagBy={tagBy}
        changeTagsUP={(e)=>changeTag(e)} 
        stormy={stormy}
        stormySet={stormySet}
        progUP={prog}
        progSetUP={(e)=>changeState(e, 'prog')}
        lightUP={light}
        themeSetUP={(e)=>changeState(e, 'lightTheme')}
        doThing={()=>updateTriggerSet(!updateTrigger)}
      />
              
      <ShipWindows
        calcFor={calcFor}
        traceDT={traceDT}
        dayTime={dayTime ? dayTime.dataNum : 0}
        brancheS={brancheS}
        app={app}
        user={user}
        isDebug={isDebug}
        focusBy={focusBy}
        salesBy={salesBy}
        tagBy={tagBy}
        prog={prog}
        stormy={stormy}
        updateTrigger={updateTrigger}
      />

    </div>
  );
};

export default DownstreamView;