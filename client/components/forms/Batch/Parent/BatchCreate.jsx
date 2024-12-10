import React, { useState, useLayoutEffect } from 'react';
import moment from 'moment';
import 'moment-business-time';
import 'moment-timezone';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelNative from '/client/layouts/Models/ModelNative';
import { onFire } from '/client/utility/NonConOptions';

const BatchCreate = ({ groupId, widgetId, allVariants, prerun, clearOnClose })=> {
  
  const liveVs = allVariants.filter( v => v.live );
  
  const [ tempver, tempverSet ] = useState(liveVs[0] ? liveVs[0].versionKey : false);
  const [ pstState, pstSet ] = useState(false);
  const [ radState, radSet ] = useState(false);
  
  useLayoutEffect( ()=>{
    if(prerun) {
      Meteor.call('getPastBatch', widgetId, tempver, (err, re)=>{
        err && console.log(err);
        re && pstSet(re);
       });
     
      radSet( liveVs.find( v => v.versionKey === tempver ).radioactive );
    }
   }, [prerun, tempver]);
   
  const [ nxtNum, nxtSet ] = useState(false);
  
  useLayoutEffect( ()=>{
    if(prerun) {
      Meteor.call('getNextBatch', (err, re)=>{
        err && console.log(err);
        re && nxtSet(re);
       }); 
    }
   }, [prerun]);
  
  const [ temptime, temptimeSet ] = useState(0);
  const [ endDateState, endDateSet ] = useState( moment().format('YYYY-MM-DD') );
  const [ shipAim, shipAimSet ] = useState(0);
  const [ loadState, loadSet ] = useState( null );
  
  useLayoutEffect( ()=> {
    if(prerun) {
      Meteor.call('mockDayShipLoad', endDateState, (err, re)=>{
        err && console.log(err);
        loadSet(re);
      });
    }
  }, [prerun, endDateState]);
  
  useLayoutEffect( ()=> {
    if(prerun) {
      const daymoment = moment(endDateState);
      const shpmoment = daymoment.isShipDay() ? daymoment.format('ddd, MMM Do') :
                        daymoment.lastShippingTime().format('ddd, MMM Do');
      shipAimSet(shpmoment);
    }
  }, [prerun, endDateState]);
   
  function save(e) {
    e.preventDefault();
    
    const vKey = this.vrsn.value;
    const batchNum = this.oNum.value.trim().toLowerCase();
    const salesNum = this.soNum.value.trim().toLowerCase();
    
    const startDate = this.sDate.value;
    const corStart = moment(startDate).startOf('day').format();
    
    const endDate = this.eDate.value;
    const corEnd = moment(endDate).endOf('day').format();
    
    const quantity = this.quant.value.trim().toLowerCase();
    
    const doSerialize = this.srlz.checked;
    const quoteTimeInput = this.hourNum.value;
    
    Meteor.call('addBatchX', 
      batchNum, groupId, widgetId, vKey, 
      salesNum, corStart, corEnd,
      quantity, doSerialize, quoteTimeInput,
      (error, reply)=>{
        if(error) {
          console.log(error);
          toast.error('Server Error');
        }
        if(reply) {
          FlowRouter.go('/data/batch?request=' + batchNum);
        }else{
          toast.warning('Duplicate');
        }
    });
  }
   
  return(
    <ModelNative
      dialogId={widgetId+'_batch_new_form'}
      title={`New ${Pref.xBatch}`}
      icon='fa-solid fa-cubes'
      colorT='blueT'
      closeFunc={()=>clearOnClose()}>
      
    <form className='centre max500' onSubmit={(e)=>save(e)}>
      <span className='overscroll'>
        <div className='centreRow'>
          <label className='breath' htmlFor='vrsn'>{Pref.variant}<br />
            <select
              id='vrsn'
              onChange={(e)=>tempverSet(e.target.value)}
              required>
            {liveVs.map( (entry)=>(
                <option value={entry.versionKey} key={entry.versionKey}>
                  {entry.variant}
                </option>
              ))}
            </select>
          </label>
        </div>
        
        <p className='nospace vmarginquarter clean centreText contrast'
          >The last 3 {Pref.xBatchs} averaged <b>{pstState && 
            pstState[0] > 0 && '+'}{pstState[0]}</b> Performance and <b>{Math.abs(pstState[1] || 0)}</b> workdays <b>{pstState[1] < 0 ? 'Late' : 'Early'}</b>
        </p>
        
        {radState &&
          <p className='nospace vmarginquarter cap centreText contrast'
            ><n-fa1>
              <i className='fas fa-radiation-alt fa-fw fa-lg darkOrangeT gapR'></i>
            </n-fa1>{Pref.variant} {Pref.radioactive} <b>{radState}</b>
          </p>
        }
        
      </span>
      
      <span className='overscroll'>
        <div className='centreRow'>
        
          <label htmlFor='oNum' className='breath'>{Pref.xBatch} number<br />
          <input
            type='text'
            id='oNum'
            list='nextbatch'
            pattern='[00000-99999]*'
            maxLength='5'
            minLength='5'
            inputMode='numeric'
            placeholder={nxtNum || '21356'}
            autoFocus={true}
            required
            autoComplete={onFire()}
          /></label>
          
          <datalist id='nextbatch'>
            {nxtNum ? <option value={nxtNum}>{nxtNum}</option> : null}
          </datalist>
        
          <label htmlFor='soNum' className='breath'>{Pref.salesOrder} number<br />
          <input
            type='text'
            id='soNum'
            className='numberSet indenText'
            pattern='[A-Za-z0-9 \._\-]*'
            maxLength='32'
            minLength='1'
            placeholder='ab00ot70b'
            required
          /></label>
      
        </div>
      </span>
      
      <span className='overscroll'>
      
        <div className='centreRow'>
          <label htmlFor='quant' className='breath'>Quantity<br />
          <input
            type='text'
            id='quant'
            pattern='[00000-99999]*'
            maxLength='5'
            minLength='1'
            inputMode='numeric'
            placeholder='10000'
            required 
          /></label>
          
          <label className='breath stdInW'>Serialize<br />
            <label htmlFor='srlz' className='beside'>
            <input
              type='checkbox'
              id='srlz'
              className='indenText inlineCheckbox'
              defaultChecked={false}
            /><i>Use {Pref.itemSerial} numbers</i></label>
          </label>
          
        </div>
      </span>
      
      <span className='overscroll'>
        <div className='centreRow'>
        
          <label htmlFor='sDate' className='breath'>{Pref.salesOrder} {Pref.start}<br />
          <input
            type='date'
            id='sDate'
            className='numberSet'
            max={moment().format('YYYY-MM-DD')}
            defaultValue={moment().format('YYYY-MM-DD')}
            pattern='[0-9]{4}-[0-9]{2}-[0-9]{2}'
            required 
          /></label>

          <label htmlFor='hourNum' className='breath stdInW'>{Pref.timeBudget} (in hours)<br />
          <input
            type='number'
            id='hourNum'
            title={`update quoted time budget\n in hours to 2 decimal places`}
            className='numberSet indenText miniIn18'
            pattern="^\d*(\.\d{0,2})?$"
            maxLength='7'
            minLength='1'
            max='10000'
            min='0.01'
            step=".01"
            inputMode='numeric'
            placeholder='54.07'
            onChange={(e)=>temptimeSet(e.target.value)}
          /></label>
        
        </div>
      </span>
      
      <span>
 
        <div className='centreRow'>
          
          <label htmlFor='eDate' className='breath'>{Pref.salesOrder} {Pref.end}<br />
          <input
            type='date'
            id='eDate'
            className='numberSet'
            min={moment().format('YYYY-MM-DD')}
            pattern='[0-9]{4}-[0-9]{2}-[0-9]{2}'
            onChange={(e)=>endDateSet(e.target.value)}
            required
          /></label>
        </div>
        
        <div className='vmarginquarter'>
          <p className='nomargin nospace clean contrast centreText'
            >Nearest ship day is <b>{shipAim}</b>. There are <b>{loadState || 0}</b> incomplete {Pref.xBatchs} scheduled for this ship date.</p>
          
          {!temptime ? null :
           <p className='nomargin nospace clean contrast centreText'
            >Absolute soonest complete <b>{moment().addWorkingTime(Number(temptime), 'hours').format("ddd, MMM Do, h:mm a")}</b></p>
          }
        </div>
      </span>
      
      <div className='vmargin'>
        <button
          type='submit'
          className='action nSolid'
        >Create</button>
      </div>
    </form>
    </ModelNative>
  );
};

export default BatchCreate;