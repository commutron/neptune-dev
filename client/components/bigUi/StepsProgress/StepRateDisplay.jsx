import React from 'react';

const StepRateDisplay = ({ step, subtitle, gFirst, ngFirst, truncate })=> {
  
  const name = gFirst === true ? 'Good' :
                ngFirst === true ? 'No Good' :
                'Incomplete';
  const hidden = truncate && gFirst === true ? 'hide' : '';
  
  return(
    <p className={`cap smTxt meterprogStack nomargin ${hidden}`}>
      {gFirst === true ?
        <n-fa1><i className="fas fa-check-circle fa-fw fa-lg greenT"></i></n-fa1>
      : ngFirst === true ?
        <n-fa2><i className="far fa-check-circle fa-fw fa-lg yellowT"></i></n-fa2>
      : <n-fa3><i className="far fa-circle fa-fw fa-lg grayT"></i></n-fa3>
      }
      {step} first {name}
      {!truncate && <br />}
      {!truncate && <i className='smaller'>{subtitle}</i>}
    </p>
  );
};

export default StepRateDisplay;