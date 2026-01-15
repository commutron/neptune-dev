import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Pref from '/public/pref.js';
import { toast } from 'react-toastify';

import ModelMedium from '/client/layouts/Models/ModelMedium';
import { min2hr, toCap } from '/client/utility/Convert';

const QuoteTimeBudget = ({ bID, bQuantity, qtBudget, qtCycles, lockOut, app })=> {
  
  const access = Roles.userIsInRole(Meteor.userId(), ['sales', 'edit']);
  
  return(
    <ModelMedium
      button={Pref.timeBudget}
      title={Pref.timeBudget}
      color='blueT'
      icon='fa-hourglass-half gapR'
      lgIcon={true}
      inline={true}
      lock={!access}>
      <QuoteTimeBudgetForm
        bID={bID}
        bQuantity={bQuantity}
        qtBudget={qtBudget}
        qtCycles={qtCycles}
        app={app}
        auth={access}
        lockOut={lockOut}
      />
    </ModelMedium>
  );
};

export default QuoteTimeBudget;

const QuoteTimeBudgetForm = ({ bID, bQuantity, qtBudget, qtCycles, app, auth, lockOut })=> {
  
  const [ totalState, totalSet ] = useState(qtBudget || 0);
  
  const [ qtSumState, qtSumSet ] = useState(0);
  
  useEffect( ()=>{
    let totalQT = 0;
    for( let qtC of qtCycles) {
      let qtApp = app.qtTasks.find( q => q.qtKey === qtC[0] );
      let scaled = qtApp.fixed ? qtC[1] : ( qtC[1] * bQuantity );
      totalQT += scaled;
    }
    qtSumSet(totalQT);
  }, []);
  
  const inputHours = (val) => {
    const inHours = parseFloat(val);
    const inMinutes = isNaN(inHours) ? 0 : moment.duration(inHours, 'hours').asMinutes();
    totalSet(inMinutes);
  };

  const setTimeInHours = (e)=> {
    e.preventDefault();
    if(auth) {
      Meteor.call('pushBatchXTimeBudget', bID, totalState, (err, re)=>{
        err && console.log(err);
        if(re) {
          toast.success('Saved');
        }else{
          toast.error('Server Error');
        }
      });
    }else{ toast.error('NO Permission'); }
  };
  
  const aT = !auth ? Pref.norole : '';
  const lT = lockOut ? `${toCap(Pref.xBatch, true)} is locked` : '';

  return(
    <div className='centre'>
      {auth && !lockOut ? null : <p>{aT} {lT}</p>}
      <h3>{toCap(Pref.timeBudget, true)} Total</h3>
      <p>Quote times from the process flow total:</p>
      <p className='inlineForm'>
        <label className='gapL min6 max100'
        >Hours<br /><i className='numberSet liteToolOff beside'>{min2hr(qtSumState)}</i>
        </label>
        <label className='gapL min6 max100'
        >Minutes<br /><i className='numberSet liteToolOff beside'>{qtSumState}</i>
        </label>
      </p>
      <hr />
      <h4>Set total in hours, to 2 decimal places</h4>
      <form id='totalqtb' onSubmit={(e)=>setTimeInHours(e)}>
        <p className='inlineForm centreRow'>
          <label>Hours<br />
          <input
            type='number'
            id='globalHourNum'
            className='numberSet miniIn12'
            pattern="^\d*(\.\d{0,2})?$"
            maxLength='7'
            minLength='1'
            max='10000'
            min='0.01'
            step=".01"
            inputMode='numeric'
            defaultValue={moment.duration(qtBudget, 'minutes').asHours()}
            disabled={!auth || lockOut}
            onInput={(e)=>inputHours(e.target.value)}
            required
          /></label>
          <label className='gapL min6'
          >Minutes<br /><i className='numberSet liteToolOff beside'>{totalState}</i>
          </label>
        </p>
        <p>
          <button
            type='submit'
            // formMethod='dialog'
            id='goQTB'
            className='action nSolid numberSet minIn7 vmargin'
            disabled={!auth || lockOut}
          >Update Total {toCap(Pref.timeBudget, true)}</button>
        </p>
      </form>
    </div>
  );
};
