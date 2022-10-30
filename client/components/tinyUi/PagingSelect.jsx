import React from 'react';


const PagingSelect = ({ multiArray, isSet, doChange })=> (
  <div className='centreRow vmargin'>
    <button
      onClick={()=>doChange(isSet-1)}
      className='smallAction gap blackHover borderWhite transparent'
      disabled={isSet < 1}
    >❮</button>
    {multiArray.map( (pg, ix)=>{
      if(multiArray.length > 20 && 
        ix > 2 && 
        ix < multiArray.length-3 &&
        ( ix - isSet > 2 || isSet - ix > 2 )
        ) {
        if(ix % 2 == ( ix > isSet ? 0 : 1)) {
          return(
            <i>.</i>
          );
        }else{
          null;
        }
      }else{
        return(
          <button
            key={ix}
            onClick={()=>doChange(ix)}
            className={
              `smallAction gap blackHover transparent
              ${isSet == ix ? '' : 'borderWhite'}`
            }
          >{ix+1}</button>
        );
      }
    })}
    <button
      onClick={()=>doChange(isSet+1)}
      className='smallAction gap blackHover borderWhite transparent'
      disabled={isSet === multiArray.length-1 || multiArray.length === 0}
    >❯</button>
  </div>
);

export default PagingSelect;