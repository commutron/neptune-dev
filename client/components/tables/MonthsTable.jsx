import React, { Fragment } from 'react';
import './style.css';
import { toast } from 'react-toastify';

const MonthsTable = ({ 
  title, data, total, stat, statTotal, statPer,
  date, extraClass 
})=> {
  
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

  if(data === false) {
    return null;
  }

  return(
    <div className='printTable'>
        
      <div className={`space w100 ${extraClass}`}>
        
        <div className='comfort middle'>
          <button
            className='chartTableAction'
            title='Download Table'
            onClick={()=>exportTable()}
            // disabled={rows.length < 1}
            disabled={true}
          ><i className='fas fa-download fa-fw'></i></button>
        </div>
          
          <table className='monthsTable'>
            
            <tbody>
              <tr>
                <th colSpan='26' className='bold noBorder big'>{date} {title}</th>
              </tr>
              
              
              <tr>
                <th></th>
                {['January','February','March','April',
                  'May','June','July','August',
                  'September','October','November','December']
                  .map( (m, index)=>(
                    <th colSpan='2' key={index}>{m}</th>
                ))}
                <th>Year</th>
              </tr>
              
              <tr className='miniThead'>
                <th></th>
                {data.map( (a, adex)=>(
                  <Fragment key={adex}>
                    <th>On Time</th><th>Shipped</th>
                  </Fragment>
                ))}
                <td></td>
              </tr>
              
              <WeekRows data={data} w={0} stat={stat} />
              
              <WeekRows data={data} w={1} stat={stat} />
              
              <WeekRows data={data} w={2} stat={stat} />
              
              <WeekRows data={data} w={3} stat={stat} />
              
              <WeekRows data={data} w={4} stat={stat} />
              
              <tr>
                <th>Totals</th>
                {data.map( (tt, ttdex)=>(
                  <Fragment key={ttdex}>
                    <td><b>{tt[statTotal]}</b></td><td><b>{tt.totalIsDone}</b></td>
                  </Fragment>
                ))}
                <td></td>
              </tr>
              
              <tr className='botThead'>
                <th></th>
                {data.map( (tt, ttdex)=>(
                  <td colSpan='2' key={ttdex}>{tt[statPer] || '0.00'}%</td>
                ))}
                <td>{total}%</td>
              </tr>
             
            </tbody>
               
          </table>
         
            
        </div>
        
    </div>
  );
};

export default MonthsTable;


const WeekRows = ({ data, w, stat })=> (
  <tr>
    <th className='leftThead'>Week {w+1}</th>
    {data.map( (e)=> {
      if(e.monthSet[w]) {
        return(
          <Fragment key={e.monthNum}>
            <td>{e.monthSet[w][stat]}</td><td>{e.monthSet[w].isDone}</td>
          </Fragment>
        );
      }else{
        return(
          <Fragment key={e.monthNum}>
            <td></td><td></td>
          </Fragment>
        );
      }
    })}
    <td></td>
  </tr>
);
