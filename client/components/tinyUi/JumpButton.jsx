import React from 'react';

// requires props
// title as text
// sub as text incuding any joiner
// sty as className text

function handle(value) {
  Session.set('now', value);
  let findBox = document.getElementById('lookup');
  findBox ? findBox.focus() : null;
}

const JumpButton = ({ title, sub, sty, inStyle })=> {
  let cssStyle = sty || 'action clear';
  let inlineStyle = inStyle ? { backgroundColor: 'rgba(255,255,255,0.1)' } : {};
  return (
    <button
      className={cssStyle}
      onClick={()=>handle(title)}
      value={title}
      style={inlineStyle}>
      <i className='up big'>{title}</i>
      <br />
      <i className='med'>{sub}</i>
    </button>
  );
};

export default JumpButton;