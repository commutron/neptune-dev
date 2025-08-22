import React, { useState, useEffect, Fragment } from 'react';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import Pref from '/client/global/pref.js';
// import TideControl from '/client/components/tide/TideControl/TideControl';

// import TimeStop from '/client/components/tide/TimeStop';
import MiniHistory from '/client/components/riverX/MiniHistory';


const KioskElements = ({ 
  kactionState, klisten, bScope,
  
  gem, user, users, app, 
  
  hotReady, hotxBatch, hotxSeries, hotVariant
  // hotGroup, hotWidget
})=> {
  
  const [ jwl, jwlSet ] = useState(false);

  const [ konfirm, konfirmSet ] = useState(undefined);
  const [ kmsg, kmsgSet ] = useState('');
  
  const [ kitem, kitemSet ] = useState(false);
  const [ kinc, kincSet ] = useState(false);
  const [ kish, kishSet ] = useState(false);
  
  const kflash = (state)=> {
    konfirmSet(state);
    Meteor.setTimeout(()=>konfirmSet(undefined),!state ? 5000 : 500);
  };
  
  const errorCode = (err)=> err === 'invalid' ? ['Invalid Format', ''] : 
                            err === 'duplicate' ? ['Serial Duplicate', 'Serial number has been already been assigned.'] : 
                            err === 'nobatch' ? ['Batch Unavailable', `${Pref.xBatch} is complete or has an error.`] : 
                            err === 'maxsrs' ? ['Maximum Quantity', `${Pref.series} is full. Increase ${Pref.xBatch} quantity.`] : 
                            err === 'nomatch' ? ['Serial Not Found', ''] :
                            ['Undefined', 'Unknown Error'];
  
  useEffect( ()=> {
    if(konfirm !== undefined) {
      Session.set('now', '');
    }else if(!gem) {
      jwlSet(false);
    }else if(klisten && kactionState === 'info') {
      konfirmSet(0);
      Meteor.apply('kallInfo', 
        [ gem ],
        {wait: true},
        (error, re)=> {
          error && console.error(error);
          kflash(re ? true : false);
          kmsgSet(re ? gem : 'nomatch');
          jwlSet(re ? gem : false);
          !re && Session.set('now', '');
        } 
      );
    }else if(klisten && kactionState === 'serial') {
      konfirmSet(0);
      const vUnit = hotVariant?.runUnits || 1;
      Meteor.apply('kallNewSerial',
        [ gem, bScope, vUnit ],
        {wait: true},
        (error, re)=> {
          error && console.error(error);
          kflash(!re || !re[0] ? false : true);
          kmsgSet(re?.[1] || null);
          jwlSet(re?.[0] ? gem : false);
          !re || !re[0] ? Session.set('now', '') : null;
          
          // console.log(re);
        } 
      );
    }
  }, [gem]);
  
  useEffect( ()=> {
    if(hotxSeries) {
      const item = hotxSeries.items.find(x => x.serial === jwl);
      kitemSet( item || false );
      const iNC = hotxSeries.nonCon.filter(x => x.serial === jwl && !x.trash);
      kincSet( iNC || false );
      const iSH = hotxSeries.shortfall.filter(x => x.serial === jwl);
      kishSet( iSH || false );
    }else{
      kitemSet(false);
      kincSet(false);
      kishSet(false);
    }
  }, [hotxSeries, jwl]);
  
  useEffect( ()=> {
    // console.log({kactionState});
    // console.log({hotxBatch});
    // console.log({hotxSeries});
    // console.log({hotVariant});
    // console.log({allTrace});
  }, [kactionState, hotxBatch, hotxSeries]);
  
  const shortate = (eff, slv)=> {
    if(eff === null) { return 'Decide' }
    else if(eff === true) { return 'Leave' }
    else if(!slv) { return 'Wait' }
    else if(slv === true) { return 'Good' }
    else{ return 'unknown' }
  };
                        
  return(
    <Fragment>
          
      <div className='kioskBatch forceScrollStyle forceScroll'>
        {
          hotxBatch &&
            <div className='stick darkCard spacehalf'>
              <h3 className='nomargin centreText'>{hotxBatch.batch}</h3>
              <dl>
                <dt>{hotxBatch.live ? 'Live' : 'Not Live'}</dt>
                <dt>Start: {moment(hotxBatch.salesStart).calendar()}</dt>
                <dt>Due: {moment(hotxBatch.salesEnd).calendar()}</dt>
                <dt>Completed: {hotxBatch.completed ? moment(hotxBatch.completedAt).calendar() : <em>in progress</em>}</dt>
                <dt>Batch Quanity: {hotxBatch.quantity}</dt>
              {hotxSeries &&
                <dt>Series Quanity: {hotxSeries.items.length}</dt>
              }
              </dl>
            </div>
        }
      </div>
          
      <div className='kioskItem forceScrollStyle forceScroll'>
        {!kactionState ? null :
          kitem &&
            // const altIs = kitem.altPath.find( x => x.r2403130005iver !== false );
            // const altFlow = altIs && widgetData.flows.find( f => f.flowKey === altIs.river );
            // const altitle = altFlow && altFlow.title;
            <Fragment>
              <div className='stick darkCard'>
                <h3 className='nomargin centreText vspacehalf'>{kitem.serial}</h3>
              </div>
              <MiniHistory
                history={kitem.history || []}
                iAlt={kitem.altPath}
              /> 
            </Fragment>
        }
      </div>
          
      <div className='kioskProb forceScrollStyle forceScroll'>
        {kactionState === 'serial' &&
          hotVariant?.radioactive &&
            <div className='centreText medBig bold red'>NCR: {hotVariant.radioactive}</div>
        }
        <table className='w100 contrastList overscroll'>
        <tbody>
        {!kactionState ? null :
          kinc ? 
            kinc.map((n, i)=><tr key={i} className='borderRed'>
                              <td className='up'>{n.ref}</td>
                              <td className='cap'>{n.type}</td>
                              <td>{n.inspect ? 'Inspected' : n.fix ? 'Fixed' : ''}</td>
                             </tr>)
          : null
        }
        {!kactionState ? null :
          kish ? 
            kish.map((s, i)=><tr key={i} className='borderOrange'>
                              <td className='cap'>{s.refs.join(', ')}</td>
                              <td className='up'>{s.partNum}</td>
                              <td>{shortate(s.inEffect, s.reSolve)}</td>
                             </tr>)
          : null
        }
        </tbody></table>
      </div>
          
      <div className='kioskStat centreRow'>
        {!kactionState ? null :
          kitem ? kitem.completed ? 
            <n-faZ><i className='fas fa-flag-checkered fa-fw fillstatic'></i></n-faZ> :
            <n-faA><i className='fas fa-route fa-fw fillstatic'></i></n-faA>
          : null
        }
      </div>
          
      <div className={`kioskFlash ${konfirm === undefined ? 'clear' : konfirm === 0 ? 'wait' : konfirm ? 'good' : 'bad'}`}>
      {konfirm === undefined ? null :
       konfirm === 0 ?
        <n-faW><i className='fas fa-stroopwafel fa-fw fa-spin'></i></n-faW>
        :
        konfirm ?
          <Fragment>
            <n-faA><i className='fas fa-check-circle fa-fw'></i></n-faA>
            <span>{kmsg}</span>
          </Fragment>
        :
          <Fragment>
            <n-faX><i className='fas fa-times-circle fa-fw'></i></n-faX>
            {errorCode(kmsg).map((m,i)=><span key={i}>{m}</span>)}
          </Fragment>
      }
      </div>
      
      <div className='kioskTime centreRow'>
        <n-fa0T><i className="fas fa-clock fa-fw fillstatic"></i></n-fa0T>
        {/*!kactionState ? 
          <n-fa0T><i className="fas fa-clock fa-fw fillstatic"></i></n-fa0T>
        :
          <div>Time Start/Stop Utility</div>
        */}
      </div>
         
    </Fragment>
  );
};

export default KioskElements;