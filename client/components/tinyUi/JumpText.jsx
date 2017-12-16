import React from 'react';

function handle(value) {
  Session.set('now', value);
  let findBox = document.getElementById('find');
  findBox ? findBox.focus() : null;
}

const JumpText = ({ title, link, sty })=> {
  let cssStyle = sty ? 'jump ' + sty : 'jump';
  return (
    <button
      className={cssStyle}
      onClick={()=>handle(link)}
      value={link}
      >{title}
    </button>
  );
};

export default JumpText;