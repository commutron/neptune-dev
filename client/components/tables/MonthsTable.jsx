import React, { Fragment } from 'react';
import './style.css';
// import { toast } from 'react-toastify';

const MonthsTable = ({ 
  title, donetitle, date, data, total, 
  yrStatTotal, yrDoneTotal,
  stat, statTotal, statPer,
  app, extraClass, miss 
})=> {
  
  /*function exportTable() {
    const filename = title.split(" ").join("_");
    const outputLines = rows.join('\n');
    
    toast(
      <a href={`data:text/plain;charset=UTF-8,${outputLines}`}
        download={`${filename}_${dateString}.csv`}
      >Download {title} for {dateString} to your computer as a comma-delimited CSV file</a>
      , {autoClose: false, closeOnClick: false}
    );
    
  }*/

  if(data === false) {
    return null;
  }

  return(
    <div className='printTable'>
        
      <div className={`space w100 ${extraClass || ''}`}>
        
        {/*<div className='comfort middle'>
          <button
            className='chartTableAction'
            title='Download Table'
            onClick={()=>exportTable()}
            // disabled={rows.length < 1}
          ><i className='fas fa-download fa-fw'></i></button>
        </div>*/}
          
          <table className='monthsTable'>
            
            <tbody>
              <tr>
                <th colSpan='27' className='bold noBorder big'>{date} {title}</th>
              </tr>
              
              <tr>
                <th></th>
                {['January','February','March','April',
                  'May','June','July','August',
                  'September','October','November','December']
                  .map( (m, index)=>(
                    <th colSpan='2' key={index}>{m}</th>
                ))}
                <th colSpan='2'>Year</th>
              </tr>
              
              <tr className='miniThead'>
                <th></th>
                {data.map( (a, adex)=>(
                  <Fragment key={adex}>
                    <th>{title}</th><th>{donetitle}</th>
                  </Fragment>
                ))}
                <td colSpan='2'></td>
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
                <td><b>{yrStatTotal}</b></td>
                <td><b>{yrDoneTotal}</b></td>
              </tr>
              
              <TotalsRow data={data} statPer={statPer} total={total} app={app} />
             
            </tbody>
               
          </table>
          
          {miss && 
            <p className='indent3'><n-sm>
              <i className='redT'>Red</i> = 
              Technically missed its standard ship day but was completed by its Sales Fulfill date.
            </n-sm></p>
          }
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
            <td className={e.monthSet[w].missed ? 'redT' : ''}
              >{e.monthSet[w][stat]}
            </td>
            <td>{e.monthSet[w].isDone}</td>
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
    <td colSpan='2'></td>
  </tr>
);

const TotalsRow = ({ data, statPer, total, app })=> {
  
  const sTy = !app.onScale ? '' :
              total >= app.onScale.high ? 'greenGlow' :
              total <= app.onScale.low ? 'redGlow' :
              'yellowGlow';
  return(
    <tr className='botThead'>
      <th></th>
      {data.map( (tt, ttdex)=>{
        const tots = tt[statPer];
        const sty = !app.onScale ? '' :
                    tots >= app.onScale.high ? 'greenGlow' :
                    tots <= app.onScale.low ? 'redGlow' :
                    'yellowGlow';
        return(
          <td 
            colSpan='2' 
            key={ttdex}
            className={`bold ${sty}`}
          >{tt[statPer] || '0.00'}%</td>
      )})}
      <td colSpan='2' className={`bold ${sTy}`}>{total}%</td>
    </tr>
  );
};
