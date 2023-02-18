import React, { useState, useEffect } from 'react';

const Slides = ({ menu, slide, disable, extraClass, children })=> {
  
  const [ section, setSection ] = useState( slide || 0 );
  
  useEffect( ()=>{ section !== slide && setSection(slide || 0) }, [slide]);
  
  const handleClick = (clk)=> {
    setSection(clk);
    FlowRouter.setQueryParams({slide: encodeURIComponent(clk)});
  };

  const dA = Array.isArray(disable) ? disable : [];

  return(
    <div className='slidesLayout'>
      <div className='slidesMenu forceScrollStyle noPrint'>
        {menu.map( (entry, index)=>{
          let clss =  section == index ? 
                      'slideMenuButton cap slideOn' : 
                      'slideMenuButton cap slideOff';
          return(
            <button
              key={index}
              onClick={()=>handleClick(index)}
              className={clss}
              disabled={dA[index]}
            >{entry}</button>
        )})}
      </div>
      <div className={`slidesSlide forceScrollStyle ${extraClass || ''}`}>
        {Array.isArray(disable) && disable[section] ?
          <div className='centre'>
            <span className='fa-stack fa-5x fa-fw'>
              <i className="fa-solid fa-lock fa-stack-1x" data-fa-transform="grow-5"></i>
              <i className="fa-solid fa-eye fa-stack-2x cloudsT" data-fa-transform="shrink-12 down-2"></i>
            </span>
            <h3>Administrator or PeopleSuper Access Is Required</h3>
          </div>
          :
          children[section]
        }
      </div>
    </div>
  );
};

export default Slides;