import React, { Fragment } from 'react';
import './style.css';

const MonthsTable = ({ 
  title, goodtitle, donetitle, date, data, yeartotal, 
  yrStatTotal, yrDoneTotal,
  stat, goal, statTotal, statGoal, statPer,
  app, extraClass, miss, subText
})=> {

  if(!data) {
    return null;
  }

  return(
    <div className='printTable'>
        
      <div className={`space w100 ${extraClass || ''}`}>
          
          <table className='monthsTable' style={{minWidth: '1500px', margin: '25px'}}>
            
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
                    <th>{goodtitle}</th><th>{donetitle}</th>
                  </Fragment>
                ))}
                <td colSpan='2'></td>
              </tr>
              
              <WeekRows data={data} w={0} stat={stat} goal={goal} miss={miss} />
              
              <WeekRows data={data} w={1} stat={stat} goal={goal} miss={miss} />
              
              <WeekRows data={data} w={2} stat={stat} goal={goal} miss={miss} />
              
              <WeekRows data={data} w={3} stat={stat} goal={goal} miss={miss} />
              
              <WeekRows data={data} w={4} stat={stat} goal={goal} miss={miss} />
              
              <WeekRows data={data} w={5} stat={stat} goal={goal} miss={miss} />
              
              <tr>
                <th>Totals</th>
                {data.map( (tt, ttdex)=>(
                  <Fragment key={ttdex}>
                    <td><b>{tt[statTotal]}</b></td><td><b>{tt[statGoal]}</b></td>
                  </Fragment>
                ))}
                <td><b>{yrStatTotal}</b></td>
                <td><b>{yrDoneTotal}</b></td>
              </tr>
              
              <TotalsRow data={data} statPer={statPer} yeartotal={yeartotal} app={app} />
             
            </tbody>
               
          </table>
          
          {miss && 
            <p className='indent3'><n-sm>
              <i className='redT'>Red</i> = 
              Technically missed its standard ship day but was completed by its Sales Fulfill date.
            </n-sm></p>
          }
          {subText &&
            <p className='indent3'>
              <n-sm>{subText}</n-sm>
            </p>
          }
        </div>
        
    </div>
  );
};

export default MonthsTable;


const WeekRows = ({ data, w, stat, goal, miss })=> (
  <tr>
    <th className='leftThead'>Week {w+1}</th>
    {data.map( (e)=> {
      if(e.monthSet[w]) {
        return(
          <Fragment key={e.monthNum}>
            <td className={miss && e.monthSet[w].missed ? 'redT' : ''}
              >{e.monthSet[w][stat]}
            </td>
            <td>{e.monthSet[w][goal]}</td>
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

const TotalsRow = ({ data, statPer, yeartotal, app })=> {
  
  const sTy = !app.onScale ? '' :
              yeartotal >= app.onScale.high ? 'greenGlow' :
              yeartotal <= app.onScale.low ? 'redGlow' :
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
      <td colSpan='2' className={`bold ${sTy}`}>{yeartotal}%</td>
    </tr>
  );
};
