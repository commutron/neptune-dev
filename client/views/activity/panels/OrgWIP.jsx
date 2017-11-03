import React, {Component} from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import ProgPie from '/client/components/charts/ProgPie.jsx';

export default class OrgWIP extends Component	{

  render() {
    
    let wip = this.props.wip;
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
          <i className='fa fa-circle-o-notch fa-spin fa-3x' aria-hidden='true'></i>
          <span className='sr-only'>Loading...</span>
        </div>
      );
    }
    
    return (
      <div className='wipCol'>
        {wipHot.map( (entry, index)=>{
          return(
            <StatusRow key={index} entry={entry} active={true} />
          )})}
        {wipCold.map( (entry, index)=>{
          return(
            <StatusRow key={index} entry={entry} active={false} />
          )})}
      </div>
    );
  }
}

export class StatusRow extends Component	{
  
  render() {
    
    const dt = this.props.entry;
    const clss = this.props.active ? 'popBlue' : '';
    const totalAll = dt.totalR + dt.totalA;

    return(
      <section className={clss}>
        <div className='wellSpacedLine blackFade'>
          <span className='big'>{dt.batch}</span>
          <span className='up'>{dt.group} {dt.widget} v.{dt.version}</span>
          <span className='capFL'>{Pref.item}s: {totalAll}</span>
          {dt.totalU > totalAll ? <span className='cap'>{Pref.unit}: {dt.totalU}</span> : null}
          {dt.totalA > 0 ? <span>Reg: {dt.totalR}, Alt: {dt.totalA}</span> : null}
          {dt.scrap > 0 ? <span className='redT'>Scraps: {dt.scrap}</span> : null}
          {dt.rma > 0 ? <span className='redT'>RMAs: {dt.rma}</span> : null}
        </div>
        <div>
          {dt.totalR + dt.totalA < 1 ?
            <span className='yellowT wide centreText'>No {Pref.item}s created</span>
          : dt.stepsReg.length > 0 ?
            <StatusCell steps={dt.stepsReg} total={dt.totalR} />
          :
            <span className='yellowT wide centreText'>No {Pref.flow} chosen</span>
          }
        </div>
        {dt.stepsAlt.length > 0 ?
          <div>
            <hr className='fade'/>
            <span className='small cap'>
              <i className='fa fa-asterisk fa-lg' aria-hidden='true'></i>
              <i>{Pref.buildFlowAlt}</i>
            </span>
            <div>
              <StatusCell steps={dt.stepsAlt} total={dt.totalA} />
            </div>
          </div>
        :null}
        {dt.finished ?
          <div className='wide greenT centreText'>
            <i>Finished {moment(dt.finishedAt).calendar()}</i>
          </div>
        : null}
      </section>
    );
  }
}


export class StatusCell extends Component	{
  
  render() {
    return(
      <div className='centreRow'>
        {this.props.steps.map( (entry)=>{
          let rndmKey = Math.random().toString(36).substr(2, 5);
          const title = entry.type === 'finish' ||
                        entry.type === 'test' ?
                        entry.step :
                        entry.step + ' ' + entry.type;
          return(
            <ProgPie
              key={rndmKey}
              title={title}
              count={entry.count}
              total={this.props.total} />
        )})}
      </div>
    );
  }
}