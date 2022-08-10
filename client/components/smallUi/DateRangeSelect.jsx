import React from 'react';
import moment from 'moment';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/airbnb.css';

const DateRangeSelect = ({ setFrom, setTo })=> {
  
  function sendUp(e) {
    setFrom( moment(e[0]).format('YYYY-MM-DD') );
    if(e[1]) {
      setTo( moment(e[1]).format('YYYY-MM-DD') );
    }
  }
  
  return(
    <span className='centreRow rowWrap gapL'>
      <Flatpickr
        id='startRange'
        title='From'
        className='dbbleWide'
        onChange={(e)=>sendUp(e)}
        required
        options={{
          mode: "range",
          dateFormat: "Y-m-d",
          altInput: true,
          altFormat: "F J Y",
          weekNumbers: true,
        }}
      />
    </span>
  );
};
      
export default DateRangeSelect;