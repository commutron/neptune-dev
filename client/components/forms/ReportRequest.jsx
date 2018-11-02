import React from 'react';
import Alert from '/client/global/alert.js';
import DateRangeSelect from '/client/components/smallUi/DateRangeSelect.jsx';

const ReportRequest = ({ setFrom, setTo })=> {
  
  /*function setApp(e) {
    e.preventDefault();
    const act = action;
    const newSet = this[rndmKey + 'inputR'].value.trim();
    
    if(act) {
      Meteor.call(act, newSet, (error, reply)=>{
        error && console.log(error);
        if(reply) {
          this[rndmKey + 'input'].value = '';
        }else{
          Bert.alert(Alert.warning);
        }
      });
    }else{
      alert('action not found');
    }
  }*/
    
  return(
    <div>
      <form id='formR' className='inlineForm'>
        {/*
        <label htmlFor='inputOne'><br />
          <input
            type='text'
            id='inputOne'
            required
          />
        </label>
        <label htmlFor='inputR'><br />
          <input
            type='text'
            id='inputR'
            required
          />
        </label>
        */}
        
        <DateRangeSelect
          setFrom={setFrom}
          setTo={setTo} />
        
      </form>
    </div>
  );
};

export default ReportRequest;

