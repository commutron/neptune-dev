import React from 'react';
import './style.css';
import { toast } from 'react-toastify';

const ReportStatsTable = ({ title, dateString, rows, extraClass })=> {
  
  function exportTable() {
    const filename = title.split(" ").join("_");
    const outputLines = rows.join('\n');
    
    toast(
      <a href={`data:text/plain;charset=UTF-8,${outputLines}`}
        download={`${filename}_${dateString}.csv`}
      >Download {title} for {dateString} to your computer as a comma-delimited CSV file</a>
      , {autoClose: false, closeOnClick: false, theme: 'light'}
    );
    
  }

  if(rows === false) {
    return(
      <div></div>
    );
  }

  return(
    <div className='printTable'>
        
        <div className={`space wide ${extraClass}`}>
          
          <div className='comfort middle'>
            <h3 className='cap'>
              <n-print>{dateString} </n-print>{title}
            </h3>
            <button
              className='chartTableAction noPrint'
              title='Download Table'
              onClick={()=>exportTable()}
              disabled={rows.length < 1}
            ><i className='fas fa-download fa-fw'></i></button>
          </div>
          
          <table className='reportReceipt wide'>
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
                          <td>{etr[1]}</td>
                          {entry[2] && <td>{entry[2]}</td>}
                          {entry[3] && <td>{entry[3]}</td>}
                        </tr>
                    )})}
                  </tbody>
                );
              }else if(index === 0 && entry[0] === '' ) {
                return(
                  <thead key={index}>
                    <tr>
                      <th>{entry[0]}</th>
                      <th>{entry[1]}</th>
                      {entry[2] && <th>{entry[2]}</th>}
                      {entry[3] && <th>{entry[3]}</th>}
                    </tr>
                  </thead>
                );
              }else{
                return(
                  <tbody key={index}>
                    <tr>
                      <td>{entry[0]}</td>
                      <td>{entry[1]}</td>
                      {entry[2] && <td>{entry[2]}</td>}
                      {entry[3] && <td>{entry[3]}</td>}
                    </tr>
                  </tbody>
            )}})}
          </table>
         
            
        </div>
        
    </div>
  );
};

export default ReportStatsTable;

