import React from 'react';

  const sty = {
    display: 'block',
    padding: '0 5px',
    margin: '10px 5px',
    maxWidth: '200px'
  };
  const styBig = {
    display: 'block',
    padding: '10px',
    margin: '10px 5px',
  };
  const styInline = {
    display: 'inline-block',
    padding: '1px',
    margin: '5px 0px',
  };
  const bSty = {
    fontSize: '2em'
  };
  const mSty = {
    fontSize: '1.5em'
  };
  const sSty = {
    fontSize: '1em',
    textTransform: 'capitalize',
    fontVariant: 'small-caps',
    wordWrap: 'keep-all'
  };
 
const NumLine = ({ 
  num, name, title,
  color, big, inline, 
}) => (
  <div title={title} style={inline ? styInline : big ? styBig : sty}>
    <i style={bSty} className={color + ' numFont'}>{num}</i>
    <i style={sSty}> {name}</i>
  </div>
);

export default NumLine;


export const StatLine = ({ 
  num, name, title,
  color, big, inline, 
  preNum, preText, 
  postNum, postText
}) => (
  <div title={title} style={inline ? styInline : big ? styBig : sty}>
    {preNum && <i style={mSty} className={color + ' numFont'}>{preNum}</i>}
    {preText && <i style={sSty}> {preText}</i>}
    
    <div style={bSty} className={color + ' numFont'}>{num}</div>
    <i style={sSty}> {name}</i>
    
    {postNum && <i style={mSty} className={color + ' numFont'}>{postNum}</i>}
    {postText && <i style={sSty}> {postText}</i>}
  </div>
);