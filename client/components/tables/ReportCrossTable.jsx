import React from 'react';
import './style.css';
import { toast } from 'react-toastify';


const ReportCrossTable = ({ title, dateString, rows, extraClass, colHl })=> {
  
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
  
  if(!rows) {
    return(
      <div></div>
    );
  }

  return(
    <div className='printTable'>
      <div className={`space wide ${extraClass}`}>
        <div className='comfort beside'>
          <h3 className='cap'>
            <n-print>{dateString} </n-print>{title}
          </h3>
          <button
            className='chartTableAction noPrint'
            title='Download Table'
            onClick={()=>exportTable()}
            disabled={rows.length === 1}
          ><i className='fas fa-download fa-fw'></i></button>
        </div>
        <table className='reportTable compact wide cap'>
          <thead className='gray cap'>
            <tr>
              {rows[0]?.map( (sub, index)=>{
                if(sub === "") {
                  return <th key="000"></th>;
                }else{
                  return(
                    <th key={index+'header'} className={index === colHl ? 'contrast' : ''}>{sub}</th>
              )}})}
            </tr>
          </thead>
          <tbody>
            {rows.map( (entry, index)=>{
              if(index === 0) {
                null;
              }else{
                return(
                  <tr key={index+'dataRow'}>
                    {entry.map( (sub, ix)=>{
                      const rndm = Math.random().toString(36).substr(2, 5);
                      if(ix===0) {
                        return(
                          <th key={ix+rndm}>{sub}</th>
                        );
                      }else{
                        return(
                          <td key={ix+rndm} className={ix === colHl ? 'contrast' : ''}>
                            {sub}
                          </td>
                        );
                }})}
                  </tr>
                );
            }})}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportCrossTable;

