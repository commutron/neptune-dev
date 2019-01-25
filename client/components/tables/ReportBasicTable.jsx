import React from 'react';
//import Alert from '/client/global/alert.js';

const ReportBasicTable = ({ title, rows })=> {
  
  //console.log(rows);
  
  if(rows === false) {
    return(
      <div></div>
    );
  }

  return(
    <div className='printTable'>
        
        <div className='space wide max750'>
          <h3>{title}</h3>
          <table className='reportTable wide cap'>
            {rows.map( (entry, index)=>{
              if(entry[1] === false) {
                null;
              }else if(Array.isArray(entry[1]) === true) {
                return(
                  <tbody key={index}>
                    <tr>
                      <td className='bold noBorder'>{entry[0]}</td>
                      <td className='noBorder'></td>
                    </tr>
                    {entry[1].map( (etr)=>{
                      const rndm = Math.random().toString(36).substr(2, 5);
                      return(
                        <tr key={rndm}>
                          <td className='indent'>{etr[0]}</td>
                          <td className='leftBorder'>{etr[1]}</td>
                        </tr>
                    )})}
                  </tbody>
                );
              }else{
                return(
                  <tbody key={index}>
                    <tr>
                      <td>{entry[0]}</td>
                      <td className='leftBorder'>{entry[1]}</td>
                    </tr>
                  </tbody>
            )}})}
          </table>
         
            
        </div>
        
    </div>
  );
};

export default ReportBasicTable;

