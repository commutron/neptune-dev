import React, { useState } from 'react';
import moment from 'moment';
import 'moment-timezone';
import 'moment-business-time';
import { toast } from 'react-toastify';

export const TimesEdit = ({ setFunc, idpre, defaultObj })=> {
  
  const [ edit, editSet ] = useState(false);
  
  if(edit) {
    return(
      <TimeEditForm
        setFunc={setFunc}
        idpre={idpre}
        defaultObj={defaultObj}
        closeFunc={()=>editSet(false)}
      />
    );
  }
  
  return(
    <button
      onClick={(e)=>editSet(true)}
      className='miniAction med'
    >Edit</button>
  );
};

export default TimesEdit;

  
const TimeEditForm = ({ setFunc, idpre, defaultObj, closeFunc })=> {
  
  function testVal(input) {
    regextm = RegExp(/^(\d{2}\:\d{2}\:\d{2})$/);
    
    if(input === '') {
      return [ null, true ];
    }else{
      const array = input.split(',');
      const pairs = array.length%2 == 0 ? true : false;
      const formt = array.every( x => regextm.test(x) === true );
      return [ array, pairs && formt ];
    }
  }
  
  function handleTime(e) {
    e.preventDefault();
    
    const zro = testVal( this['0'+idpre].value.trim() );
    const one = testVal( this['1'+idpre].value.trim() );
    const two = testVal( this['2'+idpre].value.trim() );
    const thr = testVal( this['3'+idpre].value.trim() );
    const fur = testVal( this['4'+idpre].value.trim() );
    const fiv = testVal( this['5'+idpre].value.trim() );
    const six = testVal( this['6'+idpre].value.trim() );
    
    const checkVals = [zro, one, two, thr, fur, fiv, six];
    const allgood = checkVals.every( x => x[1] === true );
    
    if(!allgood) {
      toast.warning('Incorrect Format');
    }else{
      const saveArray = Array.from(checkVals, z => z[0] );
      
      Meteor.call(setFunc, saveArray, (err)=>{
        if(err) {
          console.log(err);
          toast.error(err.reason || 'server rejected');
        }else{
          toast.success('Saved');
          closeFunc();
        }
      });
    }
  }
  
  const t = defaultObj;
  
  return(
    <form onSubmit={(e)=>handleTime(e)} className='pop space1v'>
      <ArrayText id={'0'+idpre} dayNum={0} val={t[0]} />
      <ArrayText id={'1'+idpre} dayNum={1} val={t[1]} />
      <ArrayText id={'2'+idpre} dayNum={2} val={t[2]} />
      <ArrayText id={'3'+idpre} dayNum={3} val={t[3]} />
      <ArrayText id={'4'+idpre} dayNum={4} val={t[4]} />
      <ArrayText id={'5'+idpre} dayNum={5} val={t[5]} />
      <ArrayText id={'6'+idpre} dayNum={6} val={t[6]} />
      
      <p>Times must be in pairs, separated by commas, without spaces,<br />
      in 24-hour time and including seconds<br />
      <em>07:00:00,11:45:00,12:30:00,16:30:00</em>
      </p>
      <p>
        <button 
          type='submit'
          className='action blackSolid'
        >Save</button>
        <button
          type='reset'
          onClick={(e)=>closeFunc()}
          className='smallAction med gapL'
        >Cancel</button>
      </p>
    </form>
  );
};

const ArrayText = ({ id, dayNum, val })=> (
  <span className='beside comfort vmarginquarter'>
    <b>{dayNum} {moment().day(dayNum).format('dddd')}</b>
    <textarea
      id={id}
      rows='1'
      className='letterSpaced'
      style={{ minHeight: '2rem', minWidth: '25rem'}}
      defaultValue={val && val.toString()}
    ></textarea>
  </span>
);