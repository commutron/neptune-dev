import React from 'react';
import Pref from '/client/global/pref.js';
import AppSetSimple from '/client/components/forms/AppSetSimple';

const TagSlide = ({app})=> {
  
  return (
    <div className='space3v'>
      <h2 className='cap'>{Pref.tag} options:</h2>
      <i>available reusable {Pref.tag}s</i>
      <AppSetSimple
        title={Pref.tag}
        action='addTagOp'
        rndmKey={Math.random().toString(36).substr(2, 5)} />
        <ul>
          {app.tagOption && app.tagOption.map( (entry, index)=>{
            return ( <li key={index}><i>{entry}</i></li> );
          })}
        </ul>
    </div>
  );
};

export default TagSlide;