import React, { useState, useEffect } from 'react';

const SlidesNested = ({ 
  menuTitle, menu, 
  disable, disableAll, extraClass, 
  topPage, defaultSlide,
  textStyle,
  children
})=> {
  
  const df = defaultSlide === undefined ? menuTitle ? false : 0 : defaultSlide;

  const [ filter, setFilter ] = useState( false );
  const [ section, setSection ] = useState( df );
  
  useEffect( ()=>{
    setSection( df );
  }, [defaultSlide]);
  
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
      <div className='slidesNestedMenu forceScrollStyle noPrint'>

        <input 
          key={'1a1'} 
          type='search'
          id='txtFltr'
          className='slideNestedSearch'
          placeholder='search'
          autoFocus={true}
          onChange={(e)=>setFilter(e.target.value)} />
        
        {menuTitle &&
          <button
            key={'0x0'}
            onClick={()=>setSection(false)}
            className={
              show === false ? 
                'slideNestedLand cap slideOn' : 
                'slideNestedLand cap'
            }
            disabled={dA[0]}
          ><div className='wide centreText'><b>{menuTitle}</b></div></button>}
          
        {menu.map( (entry, index)=>{
          const showThing = !filter || entry[0].includes(filter) ? true : false;
          let clss =  show === index ? 
                      'slideNestedMenuButton slideOn' : 
                      'slideNestedMenuButton';
          if(showThing) {
            return(
              <button
                key={index}
                onClick={()=>setSection(index)}
                className={`${clss} ${entry[1]}`}
                disabled={dA[index+1]}
              ><b className={textStyle || 'cap'}>{entry[0]}</b></button>
            );
          }else{
            return <hr key={index} />;
          }
        })}
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