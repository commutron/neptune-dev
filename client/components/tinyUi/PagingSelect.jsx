import React from 'react';


const PagingSelect = ({ multiArray, isSet, doChange })=> (
  <div className='centreRow vmargin'>
    {multiArray.map( (pg, ix)=>(
      <button
        key={ix}
        onClick={()=>doChange(ix)}
        className={
          `smallAction gap clearBlack 
          ${isSet == ix ? '' : 'borderWhite'}`
        }
      >{ix+1}</button>
    ))}
  </div>
);

export default PagingSelect;