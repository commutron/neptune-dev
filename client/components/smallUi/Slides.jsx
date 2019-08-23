import React, { useState } from 'react';

const Slides = (props)=> {
  
  const [ section, setSection ] = useState(0);
  
  const handleClick = (clk)=> {
    setSection(clk);
  };
  
  const menu = props.menu;
  let show = section;
    
  return (
    <div className='slidesLayout'>
      <div className='slidesMenu'>
        {menu.map( (entry, index)=>{
          let clss =  show === index ? 'slideMenuButton slideOn' : 'slideMenuButton slideOff';
          return (
            <button
              key={index}
              onClick={()=>handleClick(index)}
              className={clss}
            >{entry}</button>
        )})}
      </div>
      <div className='slidesSlide'>

        {props.children[show]}
      
      </div>
    </div>
  );
};

export default Slides;