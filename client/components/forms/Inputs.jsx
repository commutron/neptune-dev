import React from 'react';

export const Text = (props)=> (
  // test for micro components but getting the refs doesn't work
  <input
    type='text'
    id={props.iD}
    name={props.namE}
    placeholder={props.placE}
    defaultValue={props.defaulT}
    
  />
);

export const Submit = (props)=> (
  <label htmlFor={props.name}><br />
    <button
      type='submit'
      id={props.name}
      className={props.type + ' clearGreen'}
      disabled={props.disabled || false}
    >{props.name}
    </button>
  </label>
);