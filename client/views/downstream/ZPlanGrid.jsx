import React, { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment-business-time';
import 'moment-timezone';
import Pref from '/client/global/pref.js';
import { CalcSpin } from '/client/components/tinyUi/Spin.jsx';
import PrintThis from '/client/components/tinyUi/PrintThis';
// import { min2hr, avgOfArray } from '/client/utility/Convert.js';
import ReportCrossTable from '/client/components/tables/ReportCrossTable'; 

import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import 'chartjs-adapter-moment';

ChartJS.register(
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend
);

const ZPlanGrid = ({ traceDT, app, isDebug })=> {
  
  const [arrayData, arrayDataSet] = useState(false);
  
  const goback = 7;
  
  function getData() {
    
    const cycles = 180 + goback;
    const bracket = 'day';
    const nowLocal = moment();
    const backDate = moment().clone().subtract(goback, 'days');
    
    let colArray = [];
    let headRow = [""];
    for(let w = 0; w < cycles; w++) {
      
      const loop = backDate.clone().add(w, bracket);
     
      colArray.push(loop);
      headRow.push(loop.format('DD/MM'));
    }
    isDebug && console.log(colArray);
    
    let rowArray = [headRow];
    for(let pt of traceDT) {

      const batch = `${pt.batch} ${pt.onFloor ? "(R)" : ''}${pt.hold ? "{H}" : ''}${pt.isActive.hasNone ? "" : "[A]"}`;
      isDebug && console.log(pt);

      // const e2t = pt.est2tide || 0;
      
      const q2t = pt.quote2tide || 0;
      
      // const e2i = pt.est2item || 0;
      // const e2iTxt = `production curve est.: ${min2hr(e2i)} hours`;
      // const e2tTxt = `past performance est.: ${min2hr(e2t)} hours`;
      
      // const onTime = !pt.estSoonest ? null : new Date(pt.shipAim) > new Date(pt.estSoonest);
      // const ontmTxt = onTime ? 'Predicted On Time' : onTime === false ? 'Predicted Late' : 'Prediction Unavailable';
      // const soonTxt = `Earliest Complete: ~${moment(pt.estSoonest).format("ddd, MMM Do, h:mm a")}`;

      // if start now
      const doneby = pt.estSoonest || nowLocal;
      const shipby = moment(pt.shipAim);
      const dueby = pt.salesEnd;
      
      const startby = shipby.clone().subtractWorkingTime(q2t, 'minutes').format();
      
      isDebug && console.log({batch, startby, shipby, dueby});
      
      let row_run = [batch];
      for(let d of colArray) {
        const isShip = d.isSame(shipby, 'day') ? 'S ' : '';
        const isFull = d.isSame(dueby, 'day') ? 'F ' : '';
        const isEarly = d.isBetween(nowLocal, doneby, 'day', '[]' ) ? 'I ' : '';
        const isLater = d.isBetween(startby, shipby, 'day', '[)' ) ? 'Q ' : '';
        const isExtra = d.isBetween(shipby, dueby, 'day', '(]' ) ? 'B ' : '';
        
        row_run.push( isShip + isFull + isEarly + isLater + isExtra );
      }
      
      rowArray.push(row_run);
    }
    
    arrayDataSet(rowArray);

/* from server
      Meteor.call('reportOnCompleted', yearNum, weekNum, (err, rtn)=>{
  	    err && console.log(err);
  	    let cronoTimes = !rtn ? [] : 
  	          rtn.sort((x1, x2)=> x1[3] < x2[3] ? -1 : x1[3] > x2[3] ? 1 : 0 );
        cronoTimes.unshift([
          Pref.xBatch, 'description', 
          'sales order', 'quantity', 'nonCon rate',
          'fulfill due', 'ship due', 'moved fulfill', 'complete', 
          'fullfiled', 'shipped', 'quote',
        ]);     
        setWeekData(cronoTimes);
  	  });
    }
    */
  }
  
  // useEffect( ()=>{
  //   Meteor.setTimeout(()=>getData(),2000);
  // }, []);
    
  return(
    <div className='space2v'>
        
      <div className='rowWrapR med line2x noPrint'>
        <PrintThis />
      </div>
      
      {/*arrayData === false ?
          <div>
            <p className='centreText'>Constructing...</p>
            <CalcSpin />
          </div>
        :   
        <ReportCrossTable 
          title='??'
          dateString=''
          rows={arrayData}
          extraClass=''
          colHl={goback + 1}
        />
      
      
      <p className='vmargin'>
        <dd>onFloor = R</dd>
        <dd>onHold = H</dd>
        <dd>isActive = A</dd>
        <dd>isShip = shipby = S</dd>
        <dd>isFull = dueby = F</dd>
        <dd>isEarly = now to doneby = I</dd>
        <dd>isLater = startby to shipby = Q</dd>
        <dd>isExtra = ship to fulfill = B</dd>
      </p>
       */}
       
       <TestBarCH
       
       />
    </div>
  );
};
  
export default ZPlanGrid;

const TestBarCH = ({ strdata, multidata, title, fillColor, area, intgr })=> {
  
  const [ data, dataSet ] = useState({datasets:[]});
  
  // let strt = moment();
  // const nxt = (i)=> new Date( strt.clone().add(i, 'days').format() ).getTime();
  
  // const nxt = (i)=> ( ( d => new Date(d.setDate(d.getDate()-i)) )(new Date) ).getTime();
  
  // const start = nxt(1);
  // const end = nxt(10);
  
  // console.log({start, end});
  
  
  var dates = [new Date("2019-12-24"), new Date("2019-12-26"), new Date("2019-12-30"), new Date("2020-1-2"), new Date("2020-1-4"), new Date("2020-1-9"), new Date("2020-1-10") ];

  const mockdata = dates.map((d, i) => i == 0 ? null : [dates[i - 1], d]).slice(1);
               
  
  const options = {
    responsive: true,
    indexAxis: 'y',
    // grouped: false,
    scales: {
      x: {
        type: 'time',
        time: {
          // unit: 'day',
          tooltipFormat: 'MMM D YYYY',
          displayFormats: {
            day: 'MMM D YYYY'
          }
        },
        // ticks: {            
        //   min: mockmin, 
        //   max: mockmax,
        // },
        labels: dates
      },
      y: {
        type: 'category',
      }
    },
    
    
    // plugins: {
    //   legend: {
    //     display: false
    //   },
    //   title: {
    //     display: true,
    //     text: title || '',
    //   },
    // },
  };

  useEffect( ()=> {
    // dataSet({datasets:[]});
    const gen = mockdata;
        
    
    dataSet({
      labels: ['25453', '25353', '25004', '25158'],
      datasets: [{
        // barPercentage: 1,
        // barThickness: 6,
        maxBarThickness: 30,
        minBarLength: 10,
        backgroundColor: 'oklab(0.65 -0.06 -0.12)',
        label: 'SMT',
        data: gen
    },
    {
        maxBarThickness: 30,
        minBarLength: 10,
        backgroundColor: 'oklab(0.75 -0.16 0.08)',
        label: 'Thru-hole',
        data: gen
    }]});
    //   dataSet({
    //     datasets: multidata.map( (d)=>{ 
    //       return {
    //         label: d.data_name,
    //         data: d.data_array,
    //         backgroundColor: d.data_color,
    //         borderColor: d.data_color,
    //         fill: area !== undefined ? area : true,
    //         borderWidth: 5,
    //         pointRadius: 5
    //       };
    //     })
    //   });
   
  }, [strdata, multidata]);
    
  return(
    <div>
      <div className='chart50vContain centreRow'>
        <Bar options={options} data={data} />
      </div>
    </div>
  );
};