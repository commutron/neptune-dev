import React, {Component} from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import ProgPie from '/client/components/charts/ProgPie.jsx';

const OrgWIP = ({ wip })=> {

  let wipHot = false;
  let wipCold = false;

  if(!wip) {
    null;
  }else{
    wipHot = wip.filter( x => x.active === true);
    wipHot.sort((b1, b2)=> {
                  if (b1.batch < b2.batch) { return 1 }
                  if (b1.batch > b2.batch) { return -1 }
                  return 0;
                });
    wipCold = wip.filter( x => x.active === false);
    wipCold.sort((b1, b2)=> {
                  if (b1.batch < b2.batch) { return 1 }
                  if (b1.batch > b2.batch) { return -1 }
                  return 0;
                });
  }
  
  if(!wipHot || !wipCold) {
    return (
      <div className='space'>
        <i className='fas fa-circle-o-notch fa-spin fa-3x'></i>
        <span className='sr-only'>Loading...</span>
      </div>
    );
  }
  
  return (
    <div className='wipCol'>
      {wipHot.map( (entry)=>{
        let hotrndmKey = Math.random().toString(36).substr(2, 5);
        return(
          <StatusRow key={hotrndmKey} entry={entry} active={true} />
        )})}
      {wipCold.map( (entry)=>{
        let coldrndmKey = Math.random().toString(36).substr(2, 5);
        return(
          <StatusRow key={coldrndmKey} entry={entry} active={false} />
        )})}
    </div>
  );
};

export class StatusRow extends Component	{
  
  constructor() {
    super();
    this.state = {
      countCalc: 'item'
    };
  }
  
  render() {
    
    const dt = this.props.entry;
    
    const late = moment(dt.endGoal).isBefore(moment().now);
    const clss = this.props.active ? 'popBlue' : '';
    const totalAll = dt.totalR + dt.totalA;
    const totalUnits = dt.totalRU + dt.totalAU;
    
    const calcItem = this.state.countCalc === 'item' ? true : false;
    
    let rndmKey = Math.random().toString(36).substr(2, 5);

    return(
      <section className={clss}>
        <div className='wellSpacedLine blackFade'>
          <span className='big'>{dt.batch}</span>
          <span className='up'>{dt.group} {dt.widget} v.{dt.version}</span>
          <span className='capFL'>{Pref.item}s: {totalAll}</span>
          {totalUnits > totalAll ? <span className='cap'>{Pref.unit}: {totalUnits}</span> : null}
          {dt.totalA > 0 ? <span>Reg: {dt.totalR}, Alt: {dt.totalA}</span> : null}
          {dt.scrap > 0 ? <span className='redT'>Scraps: {dt.scrap}</span> : null}
          {dt.rma > 0 ? <span className='redT'>RMAs: {dt.rma}</span> : null}
        </div>
        {dt.totalR + dt.totalA < 1 ?
          <div className='yellowT wide centreText'>No {Pref.item}s created</div>
        : dt.stepsReg.length > 0 ?
          <div className='fillHeight'>
            <StatusCell steps={dt.stepsReg} total={dt.totalR} unitTotal={dt.totalRU} calc={calcItem} />
            {dt.stepsAlt.length > 0 ?
              <div>
                <hr className='fade'/>
                <span className='small cap'>
                  <i className='fas fa-asterisk fa-lg'></i>
                  <i>{Pref.buildFlowAlt}</i>
                </span>
                <div>
                  <StatusCell steps={dt.stepsAlt} total={dt.totalA} unitTotal={dt.totalAU} calc={calcItem} />
                </div>
              </div>
            :null}
          </div>
        :
          <div className='yellowT wide centreText'>No {Pref.flow} chosen</div>
        }
        {dt.finished ?
          <div className='wide greenT centreText'>
            <i>Finished {moment(dt.finishedAt).calendar()}</i>
          </div>
        : null}
        {totalUnits > totalAll ?
          <div className='functionalFooter numBoxRadio blackFade'>
            <span className='radioLabelPair'>
              <input
                type='radio'
                id={rndmKey + 'calcI'}
                name={rndmKey + 'calc'}
                onChange={()=> this.setState({countCalc: 'item'})}
                defaultChecked />
              <label htmlFor={rndmKey + 'calcI'}>Boards</label>
            </span>
            <span className='radioLabelPair'>
              <input
                type='radio'
                id={rndmKey + 'calcU'}
                name={rndmKey + 'calc'}
                onChange={()=> this.setState({countCalc: 'unit'})} />
              <label htmlFor={rndmKey + 'calcU'}>Units</label>
            </span>
          </div>
        : null}
        {late ?
          <i
            title='Late'
            className='fas fa-exclamation-triangle fa-2x yellowT bottomRightFloat'>
          </i>
        :null}
      </section>
    );
  }
}

const StatusCell = ({ steps, total, unitTotal, calc })=> (
  <div className='centreRow'>
    {steps.map( (entry)=>{
      let rndmKey = Math.random().toString(36).substr(2, 5);
      const title = entry.type === 'finish' ||
                    entry.type === 'test' ?
                    entry.step :
                    entry.step + ' ' + entry.type;
      let count = calc ? entry.itemCount : entry.unitCount;
      let totalCount = calc ? total : unitTotal;
      return(
        <ProgPie
          key={rndmKey}
          title={title}
          count={count}
          total={totalCount} />
      );
    })}
  </div>
);

export default OrgWIP;