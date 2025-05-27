import React, { useState, useEffect, useLayoutEffect, Fragment } from 'react';
import { Meteor } from 'meteor/meteor';

import { ScanListenLiteUtility, ScanListenLiteOff } from '/client/utility/ScanListener.js';

import HomeIcon from './HomeIcon';

// import TideControl from '/client/components/tide/TideControl/TideControl';
import TideFollow from '/client/components/tide/TideFollow';
// import { NonConMerge } from '/client/utility/NonConOptions';

// import EquipMenu from '/client/views/production/lists/EquipMenu';
// import TimeStop from '/client/components/tide/TimeStop';
import MiniHistory from '/client/components/riverX/MiniHistory';


function testWithPaste(event) {
  event.preventDefault();
  const val = (event.clipboardData || window.clipboardData).getData("text");
  if(val) {
    Session.set('now', val);
  }
}

const TerminalWrap = ({ 
  orb, user, users, app, 
  hotReady, hotxBatch, hotxSeries,
})=> {
  
  const [ gem, gemSet ] = useState(false);
  
  const [ kactionState, kactionSet ] = useState(false);
  const [ klisten, klistenSet ] = useState(false);
  const [ kondeckState, kondeckSet ] = useState(false);
  const [ konfirm, konfirmSet ] = useState(undefined);
  
  const [ ncTypesComboFlat, ncTypesComboSet ] = useState([]);
  const [ kitem, kitemSet ] = useState(false);
  const [ kinc, kincSet ] = useState(false);
  const [ kish, kishSet ] = useState(false);
  
  useEffect( ()=> {
    ScanListenLiteUtility();
    return ()=> {
      ScanListenLiteOff();
      window.removeEventListener('paste', testWithPaste);
    };
  }, []);
  
  const kflash = (state)=> {
    konfirmSet(state);
    Meteor.setTimeout(()=>konfirmSet(undefined),!state ? 5000 : 1000);
  };
  
  useEffect( ()=> {
    if(klisten && kactionState === 'info') {
      konfirmSet(0);
      Meteor.apply('kallInfo', 
        [ orb ],
        {wait: true},
        (error, re)=> {
          error && console.error(error);
          gemSet(re ? orb : false);
          kondeckSet(re);
          kflash(re);
        } 
      );
    }
  }, [orb]);
  
  useEffect( ()=> {
    if(kondeckState && hotxSeries) {
      const item = hotxSeries.items.find(x => x.serial === gem);
      kitemSet( item || false );
      const iNC = hotxSeries.nonCon.filter(x => x.serial === gem);
      kincSet( iNC || false );
      const iSH = hotxSeries.shortfall.filter(x => x.serial === gem);
      kishSet( iSH || false );
    }else{
      kitemSet(false);
      kincSet(false);
      kishSet(false);
    }
  }, [kondeckState, hotxSeries, gem]);
  
  useEffect( ()=> {
    console.log({kactionState});
    
    console.log({kondeckState});
    
    console.log({hotxBatch});
    
    console.log({hotxSeries});
    
  }, [kactionState, kondeckState, hotxBatch, hotxSeries]);
  
  const startListen = ()=> {
    klistenSet(true);
    window.addEventListener("paste", testWithPaste);
  };
  
  const stopListen = ()=> {
    klistenSet(false);
    window.removeEventListener('paste', testWithPaste);
  };
  
  const eng = user?.engaged || false;
  const etPro = eng?.task === 'PROX';
  const etMlt = eng?.task === 'MLTI';
  // 'MAINT', 'EQFX';
  const etKey = eng?.tKey;
  
                        
  return(
    <div className={'kioskFrame do_not_use'}>
      <div className='tenHeader'>
        <div className='topBorder' />
        <HomeIcon />
        
        <div className='frontCenterTitle'>
          <select 
            id='kioskSelect' 
            onChange={(e)=>kactionSet(e.target.value)}
            value={kactionState}
            className={!kactionState ? 'grayT' : ''}
            disabled={klisten}>
            <option value='' className='grayT'>Select Terminal Action</option>
            <option value='info'>Info (Scan Tester)</option>
            <option value='serial' disabled={true}>Initiate Serial</option>
            <option value='checkpoint' disabled={true}>Checkpoint</option>
            <option value='complete' disabled={true}>Complete</option>
          </select>
        </div>
        <div className='auxRight'>
          
        </div>
        <TideFollow tOpen={null} />
      </div>
      
      <Fragment>
        
        <div className='kioskContent forceScrollStyle darkTheme'>
          
          <div className={`kioskTask ${klisten ? 'nBg' : ''}`}>
            {!kactionState ?
              <n-fa0><i className="fa-solid fa-power-off fa-fw fillstatic"></i></n-fa0>
            :
              !klisten ?
                <button 
                  title='Start Listening'
                  className='kioskListen' 
                  onClick={()=>startListen()}>
                  <n-fa0><i className="fa-solid fa-compact-disc fa-fw"></i></n-fa0>
                  <span>Ready</span>
                </button>
              :
                <button 
                  title='Stop Listening'
                  className='kioskListen' 
                  onClick={()=>stopListen()}>
                  <n-fa1><i className="fa-solid fa-compact-disc fa-fw fa-spin"></i></n-fa1>
                  <span>Listening...</span>
                </button>
            }
          </div>
          
          <div className='kioskBatch forceScrollStyle forceScroll'>
            {!kactionState || !kondeckState ? null :
              hotxBatch ? 
                <div className='stick darkCard spacehalf'>
                  <h3 className='nomargin centreText'>{hotxBatch.batch}</h3>
                </div>
              :
                <div>no batch on deck</div>
            }
          </div>
          
          <div className='kioskItem forceScrollStyle forceScroll'>
            {!kactionState ? null :
              <Fragment>
                <div className='stick darkCard spacehalf'>
                  {gem ? <h3 className='nomargin centreText'>{gem}</h3> :
                    `Last Scan "${orb}"`
                  }</div>
                {kitem &&
                  // const altIs = kitem.altPath.find( x => x.river !== false );
                  // const altFlow = altIs && widgetData.flows.find( f => f.flowKey === altIs.river );
                  // const altitle = altFlow && altFlow.title;
                    <MiniHistory
                      history={kitem.history}
                      iAlt={kitem.altPath}
                    /> 
                }
              </Fragment>
            }
          </div>
          
          <div className='kioskProb'>
            {!kactionState ? null :
              kinc ? 
                <ul>{kinc.map((n, i)=><li key={i}>{n.ref}, {n.type}</li>)}</ul>
              : null
            }
            {!kactionState ? null :
              kish ? 
                <ul>{kish.map((s, i)=><li key={i}>{s.partNum}</li>)}</ul>
              : null
            }
          </div>
          
          <div className='kioskStat'>
            {!kactionState ? null :
              kitem ? kitem.completed ? "Complete" : "In Progress" : null
            }
          </div>
          
          <div className={`kioskFlash ${konfirm === undefined ? 'clear' : konfirm === 0 ? 'wait' : konfirm ? 'good' : 'bad'}`}>
          {konfirm === undefined ? null :
           konfirm === 0 ?
            <n-faW><i className='fas fa-stroopwafel fa-fw fa-spin'></i></n-faW>
            :
            konfirm ?
              <n-faA><i className='fas fa-check fa-fw'></i></n-faA>
            :
              <n-faX><i className='fas fa-times fa-fw'></i></n-faX>
          }
          </div>
          
          <div className='kioskProd'>
            <div>Time Start/Stop Utility</div>
          </div>
         
        </div>
      
      </Fragment>
    </div>
  );
};

export default TerminalWrap;