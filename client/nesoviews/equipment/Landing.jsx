// import React from 'react';
// import Pref from '/client/global/pref.js';

// import NumBox from '/client/components/tinyUi/NumBox';

// const Landing = ({ equipData, issues })=> {
  
//   return(
//     <div>
      
//       <div className='wide rowWrap'>
//         <span className='rowWrap gapsC'>
//           <NumBox
//             num={equipData.filter( e => e.online && !e.hibernate ).length}
//             name='Online'
//             color='greenT' 
//           />
//           <NumBox
//             num={equipData.filter( e => !e.online && !e.hibernate ).length}
//             name='Offline'
//             color='midnightBlueT' 
//           />
//           <NumBox
//             num={equipData.filter( e => e.hibernate ).length}
//             name={Pref.eqhib}
//             color='darkgrayT' 
//           />
//           <NumBox
//             num={issues || 0}
//             name={`WIP ${Pref.eqissue}`}
//             color='orangeT' 
//           />
//         </span>
        
//       </div>

//     </div>
//   );
// };

// export default Landing;