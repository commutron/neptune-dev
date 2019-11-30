import React from 'react';
import DateRangeSelect from '/client/components/smallUi/DateRangeSelect.jsx';

const ReportRequest = ({ 
        setFrom, setTo,
        ncCheck, setNC,
        typeCheck, setType,
        phaseCheck, setPhase 
})=> {

  return(
    <div>
      <form id='formR' className=''>
        
        <p>
          <DateRangeSelect
            setFrom={setFrom}
            setTo={setTo} />
        </p>
        <div className='centreRow'>
          <span>
            <input
              type='checkbox'
              id='inputNC'
              onChange={(e)=>setNC(inputNC.value)}
              checked={ncCheck} />
            <label htmlFor='inputNC'>Non-conformances</label>
          </span>
          <span>
            <input
              type='checkbox'
              id='inputType'
              onChange={(e)=>setType(inputType.value)}
              checked={typeCheck} />
            <label htmlFor='inputType'>Type Breakdown</label>
          </span>
          <span>
            <input
              type='checkbox'
              id='inputPhase'
              onChange={(e)=>setPhase(inputPhase.value)}
              checked={phaseCheck} />
            <label htmlFor='inputPhase'>Department Breakdown</label>
          </span>
        </div>
        
      </form>
    </div>
  );
};

export default ReportRequest;

