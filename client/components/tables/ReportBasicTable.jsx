import React from 'react';
import './style.css';
import ExploreLinkBlock from '/client/components/tinyUi/ExploreLinkBlock.jsx';
import { toast } from 'react-toastify';

//import Alert from '/client/global/alert.js';

const ReportBasicTable = ({ title, dateString, rows })=> {
  
  function exportTable() {
    const filename = title.split(" ").join("_");
    const outputLines = rows.join('\n');
    
    toast(
      <a href={`data:text/plain;charset=UTF-8,${outputLines}`}
        download={`${filename}_${dateString}.csv`}
      >Download {title} for {dateString} to your computer as a comma-delimited CSV file</a>
      , {autoClose: false, closeOnClick: false}
    );
    
  }
  
  if(!rows) {
    return(
      <div></div>
    );
  }

  return(
    <div className='printTable'>
      <div className='wide'>
        <div className='comfort middle'>
          <h3 className='cap'>{title}</h3>
          <button
            className='chartTableAction'
            title='Download Table'
            onClick={()=>exportTable()}
            disabled={rows.length === 1}
          ><i className='fas fa-download fa-fw'></i></button>
        </div>
          <table className='reportTable wide cap'>
            <thead className='gray cap'>
              <tr>
              {rows[0].map( (sub, index)=>{
                return(
                  <th key={index+'header'}>{sub}</th>
              )})}
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
                            <td key={ix+rndm}>
                              <ExploreLinkBlock 
                                type='batch'
                                keyword={sub} />
                            </td>
                          );
                        }else{
                          return(
                            <td key={ix+rndm}>
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

export default ReportBasicTable;

