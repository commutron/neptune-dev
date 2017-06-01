import React, {Component} from 'react';

// requires Data
// oData

///////////////////////// THIS HAS NO BEEN UPDATED FOR THE NEWEST DATA STRUCTURE \\\\\\\\\\\\\\\\\\


export default class StatsUpdate extends Component	{

  //// Manual Post Stats \\\\
  //// For Backup and Testing - Shouldn't be needed in final production \\\\

  finish() {
    // Order Data
    const o = this.props.oData;
    // top level properties
    const order = o.batch;
    const year = order.slice(0, -3);
    const prod = o.wIdget;
    const cust = o.group;

    // const t = stData.history.find(x => x.order === topOrder);

    // get simple counts
    const lf = o.rohs; // lead free boolean
    const lfI = lf ? 1 : 0; // for updating totals
    const st = o.route.length; // route steps
    const br = o.items.length; // boards
    const sc = o.scrap; // scrapped
    const sh = o.short.length; // shortages

    // get Non-Conformance counts
    const ncT = o.nonCon.length; // total nonCons

    let ncM = 0; //missing
    let ncW = 0; //wrong
    let ncB = 0; //bridge
    let ncP = 0; //place
    let ncS = 0; //solder
    let ncO = 0; //other

    // map nonCons and increment
    o.nonCon.map( (entry)=>{
      if(entry.group === 1) {
        ncM++
      }else if(entry.group === 2) {
        ncW++
      }else if(entry.group === 3) {
        ncB++
      }else if(entry.group === 4) {
        ncP++
      }else if(entry.group === 5) {
        ncS++
      }else{
        ncO++
      }
    })

     //
    // will need RETURNED
   //

    // for testing
      console.log('leadfree ' + lf + ' so ' + lfI);
      console.log('steps ' + st);
      console.log('boards ' + br);
      console.log('scraps ' + sc);
      console.log('shortage ' + sh);
      console.log('noncon total ' + ncT);
      console.log('noncon miss ' + ncM);
      console.log('noncon wrong ' + ncW);
      console.log('noncon bridge ' + ncB);
      console.log('noncon place ' + ncP);
      console.log('noncon solder ' + ncS);
      console.log('noncon other ' + ncO);

    // check for existing report for this Order
    const stData = Statsdb.findOne({year: year});
    const report = stData.history.find(x => x.order === order);
      if(!report) {
        // increment the yearly totals
        const topOrder = year + '000';
          Meteor.call('plusTotals', year, topOrder, lfI, st, br, ncT, ncM, ncW, ncB, ncP, ncS, ncO, sh);
        // add report
          Meteor.call('addReport', year, order, prod, cust, lf, st, br, ncT, ncM, ncW, ncB, ncP, ncS, ncO, sh);
      }else{
        /// this is a contingency, if the report is created before the order finishes or is finished more than once

        // get the differences
        let vlfI = 0;
        let vst = st - report.steps;
        let vbr = br - report.items;
        let vncT = ncT - report.ncTotal;
        let vncM = ncM - report.ncMiss;
        let vncW = ncW - report.ncWrong;
        let vncB = ncB - report.ncBridge;
        let vncP = ncP - report.ncPlace;
        let vncS = ncS - report.ncSolder;
        let vncO = ncO - report.ncOther;
        let vsc = sc - report.scraps;
        let vsh = sh - report.shorts;

        // increment the yearly totals
        Meteor.call('plusTotals', year, topOrder, vlfI, vst, vbr, vncT, vncM, vncW, vncB, vncP, vncS, vncO, vsc, vsh);
        /// update report
        Meteor.call('updateReport', year, order, lf, st, br, ncT, ncM, ncW, ncB, ncP, ncS, ncO, sc, sh);
      }

    // finish and deactivate the Batch
      const batchId = o._id;
      Meteor.call('finishBatch', batchId);

  }

  render() {

    return (
      <button className='action clear wide greenT' onClick={this.finish.bind(this)}>Finish</button>
    )
  }
}