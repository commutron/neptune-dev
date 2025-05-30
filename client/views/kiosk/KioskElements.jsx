import React, { useState, useEffect, useLayoutEffect, Fragment } from 'react';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';

// import TideControl from '/client/components/tide/TideControl/TideControl';
// import { NonConMerge } from '/client/utility/NonConOptions';

// import EquipMenu from '/client/views/production/lists/EquipMenu';
// import TimeStop from '/client/components/tide/TimeStop';
import MiniHistory from '/client/components/riverX/MiniHistory';


const KioskElements = ({ 
  kactionState, klisten, bScope,
  
  orb, user, users, app, 
  
  hotReady, hotxBatch, hotxSeries,
  hotGroup, hotWidget, hotVariant
})=> {
  
  const [ gem, gemSet ] = useState(false);

  const [ kondeckState, kondeckSet ] = useState(false);
  const [ konfirm, konfirmSet ] = useState(undefined);
  
  const [ kitem, kitemSet ] = useState(false);
  const [ kinc, kincSet ] = useState(false);
  const [ kish, kishSet ] = useState(false);
  
  const kflash = (state)=> {
    konfirmSet(state);
    Meteor.setTimeout(()=>konfirmSet(undefined),!state ? 5000 : 1000);
  };
  
  useEffect( ()=> {
    if(konfirm !== undefined) {
      Session.set('now', '');
    }else if(klisten && kactionState === 'info') {
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
    // console.log({kactionState});
    
    // console.log({kondeckState});
    
    console.log({hotxBatch});
    
    console.log({hotxSeries});
  
    console.log({hotGroup, hotWidget, hotVariant});
    
    // console.log({allTrace});
    
  }, [kactionState, kondeckState, hotxBatch, hotxSeries]);
  
  
  // const eng = user?.engaged || false;
  // const etPro = eng?.task === 'PROX';
  // const etMlt = eng?.task === 'MLTI';
  // 'MAINT', 'EQFX';
  // const etKey = eng?.tKey;
  
                        
  return(
    <Fragment>
          
      <div className='kioskBatch forceScrollStyle forceScroll'>
        {
          hotxBatch ? 
            <div className='stick darkCard spacehalf'>
              <h3 className='nomargin centreText'>{hotxBatch.batch}</h3>
              <ul>
                <li>{hotxBatch.live ? 'live' : 'not live'}</li>
                <li>{hotxBatch.completed ? moment(hotxBatch.completedAt).calendar() : 'in progress'}</li>
                <li>{hotxBatch.quantity}</li>
                <li>{hotxBatch.river}</li>
                <li>{moment(hotxBatch.salesStart).calendar()}</li>
                <li>{moment(hotxBatch.salesEnd).calendar()}</li>
              </ul>
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
          
      <div className='kioskStat centreRow'>
        {!kactionState ? null :
          kitem ? kitem.completed ? 
            <n-faZ><i className='las la-flag-checkered la-fw fillstatic'></i></n-faZ> :
            <n-faA><i className='las la-route la-fw fillstatic'></i></n-faA>
          : null
        }
      </div>
          
      <div className={`kioskFlash ${konfirm === undefined ? 'clear' : konfirm === 0 ? 'wait' : konfirm ? 'good' : 'bad'}`}>
      {konfirm === undefined ? null :
       konfirm === 0 ?
        <n-faW><i className='las la-stroopwafel la-fw la-spin'></i></n-faW>
        :
        konfirm ?
          <n-faA><i className='las la-check-circle la-fw'></i></n-faA>
        :
          <n-faX><i className='las la-times-circle la-fw'></i></n-faX>
      }
      </div>
      
      <div className='kioskTime centreRow'>
        <n-fa0T><i className="las la-clock la-fw fillstatic"></i></n-fa0T>
        {/*!kactionState || !kondeckState ? 
          <n-fa0T><i className="las la-clock la-fw fillstatic"></i></n-fa0T>
        :
          <div>Time Start/Stop Utility</div>
        */}
      </div>
         
    </Fragment>
  );
};

export default KioskElements;