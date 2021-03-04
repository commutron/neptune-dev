import React from 'react';

const StepRateDisplay = ({ step, gFirst, ngFirst, truncate })=> {
  
  const name = gFirst === true ? 'Good' :
                ngFirst === true ? 'No Good' :
                'Incomplete';
  const hidden = truncate && gFirst === true ? 'hide' : '';
  
  return(
    <p className={`cap smTxt ${hidden}`}>
      {gFirst === true ?
        <i><i className="fas fa-play-circle fa-fw fa-lg greenT"></i></i>
      : ngFirst === true ?
        <b><i className="far fa-play-circle fa-fw fa-lg yellowT"></i></b>
      : <em><i className="far fa-circle fa-fw fa-lg grayT"></i></em>
      }
      {step} first {name}
    </p>
  );
};

export default StepRateDisplay;