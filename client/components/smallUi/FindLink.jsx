import React from 'react';

function handle(value) {
  Session.set('now', value);
}

const FindLink = ({ title, sub, sty })=> {
  let cssStyle = sty || 'jump';
  return (
    <button
      className={cssStyle}
      onClick={()=>handle(title)}
      value={title}
      >{title}{sub}
    </button>
  );
};

export default FindLink;