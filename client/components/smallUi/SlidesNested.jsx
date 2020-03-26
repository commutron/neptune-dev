import React, { useState } from 'react';

const SlidesNested = ({ 
  menuTitle, menu, 
  disable, disableAll, extraClass, 
  topPage, defaultSlide,
  textStyle,
  children
})=> {
  
  const df = defaultSlide === undefined ? menuTitle ? false : 0 : defaultSlide;

  const [ section, setSection ] = useState( df );

  let show = section;
  let dA = [];
  
  if(Array.isArray(disable)) {
    dA = disable;
  }else if(disableAll) {
    for(let i = 0; i <= children.length; i++) {
      dA.push(true);
    }
  }else{null}
  
  return(
    <div className='slidesNestedLayout'>
      <div className='slidesNestedMenu noPrint'>
        {menuTitle &&
          <button
            key={'0x0'}
            onClick={()=>setSection(false)}
            className={
              show === false ? 
                'slideNestedMenuButton cap slideOn' : 
                'slideNestedMenuButton cap slideOff'
            }
            disabled={dA[0]}
          ><div className='wide centreText'><b>{menuTitle}</b></div></button>}
          
        {menu.map( (entry, index)=>{
          let clss =  show === index ? 
                      'slideNestedMenuButton slideOn' : 
                      'slideNestedMenuButton slideOff';
          return (
            <button
              key={index}
              onClick={()=>setSection(index)}
              className={`${clss} ${textStyle || 'cap'}`}
              disabled={dA[index+1]}
            ><b>{entry}</b></button>
        )})}
      </div>
      <section className={`slidesNestedSlide forceScrollStyle ${extraClass || ''}`}>
        
        {show === false ?
          topPage
        :
          children[show]
        }
      
      </section>
    </div>
  );
};

export default SlidesNested;