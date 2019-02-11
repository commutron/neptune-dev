import React, {Component} from 'react';
import moment from 'moment';



const BatchDetails = ({b, bC})=> {


  return(
    <div className='overGridScroll'>
      {b.map( (entry, index)=>{
        
        return(
          <div key={`${entry._id}fixed${index}`}>
                <span>not goin anywhere</span>
                <span>heres hoping</span>
                <span>goes as far as it needs to</span>
                <span>and some more</span>
                <span>still going</span>
                <span>this one too</span>
                <span>sick of typing yet</span>
                <span>one more</span>
                <span>last one</span>
                <span>really the last one</span>
          </div>
              
      )})}
    </div>
  
  );
};

export default BatchDetails;