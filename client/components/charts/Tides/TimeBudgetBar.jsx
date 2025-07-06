import React from "react";

const TimeBudgetBar = ({ title, a, b, c })=> {
  
  const abc = a+b+c;
  const per = (val)=> Math.max(0, Math.ceil( ( val / abc ) * 100 ) );
  
  const dn = a == c ? 0 : per(a);
  const rmn = dn + per(b);
  const ovr = rmn + per(c);
  
  let bar = {
    width: '100%',
    height: '1.5vmax',
    backgroundImage: `linear-gradient(to right, rgb(52, 152, 219) 0% ${dn}%, var(--silverfade) ${dn}% ${rmn}%, rgb(241, 196, 15) ${rmn}% ${ovr}%`
  };
  
  return(
    <div title={title} className='noCopy'>
      <div className={`wide miniStack noCopy noTip ${abc === 0 ? 'empty' : ''}`}>
        <div style={bar}></div>
      </div>
    </div>
  );
};
  
export default TimeBudgetBar;