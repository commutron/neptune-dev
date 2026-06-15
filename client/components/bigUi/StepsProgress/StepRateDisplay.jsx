import React from 'react';

const StepRateDisplay = ({ step, subtitle, gFirst, ngFirst, truncate })=> {
  
  const name = gFirst === true ? 'GOOD' :
                ngFirst === true ? 'NO-GOOD' :
                'Incomplete';
  const hidden = truncate && gFirst === true ? 'hide' : '';
  
  return(
    <p className={`cap smTxt meterprogStack nomargin ${hidden}`}>
      <span className='comfort' style={{flexWrap: 'wrap-reverse'}}>
      <span className='colNoWrap' style={{letterSpacing: '1px'}}>
        <span>{step} first {name}</span>
        {!truncate && <i className='smaller'>{subtitle}</i>}
      </span>
      <span className='beside'>
      {gFirst === true ?
        <span className='fa-stack'>
          <i className="fas fa-certificate fa-stack-2x fa-fw greenT"></i>
          <i className="fas fa-check-double fa-stack-1x fa-lg fa-fw whiteT" data-fa-transform="right-1"></i>
        </span>
      : ngFirst === true ?
        <n-fa2 class='medBig'><i className="fa-solid fa-check-circle fa-fw fa-lg yellowT"></i></n-fa2>
      : <n-fa3 class='medBig'><i className="far fa-circle fa-fw fa-lg darkgrayT"></i></n-fa3>
      }
      </span>
      </span>
      
    </p>
  );
};

function areEqual(prevProps, nextProps) {
	if( prevProps !== nextProps	) {
  	return false;
	}else{
		return true;
	}
}
export default React.memo(StepRateDisplay, areEqual);