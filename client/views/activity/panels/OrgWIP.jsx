import React, {Component} from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import ProgPie from '/client/components/charts/ProgPie.jsx';

export default class OrgWIP extends Component	{
  
  constructor() {
    super();
    this.state = {
      wip: false,
    };
  }
  
  relevant() {
    const b = this.props.b;
    const now = moment();
    const thisWeek = (fin)=> { return ( moment(fin).isSame(now, 'week') ) };
    const live = b.filter( x => x.finishedAt === false || thisWeek(x.finishedAt) === true );
    
    Meteor.call('WIPProgress', live, (error, reply)=> {
      error ? console.log(error) : null;
      this.setState({'wip': reply});
    });
  }

  render() {
    
    let wip = this.state.wip;
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
        <div>
          loading...
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
  componentDidMount() {
    this.relevant();
  }
}



export class StatusRow extends Component	{
  
  render() {
    
    let dt = this.props.entry;
    
    const countsR = Array.from(dt.stepsReg, x => x.count);
    const titlesR = Array.from(dt.stepsReg, x => ({step: x.step, type: x.type}));
    const countsA = Array.from(dt.stepsAlt, x => x.count);
    const titlesA = Array.from(dt.stepsAlt, x => ({step: x.step, type: x.type}));
    
    const clss = this.props.active ? 'popExcesive' : '';

    return(
      <section className={clss}>
        <div className='wellSpacedLine blackFade'>
          <span className='big'>{dt.batch}</span>
          <span className='up'>{dt.group} {dt.widget} v.{dt.version}</span>
          <span>Total {Pref.item}s: {dt.totalR + dt.totalA}</span>
          {dt.totalA > 0 ? <span>Reg: {dt.totalR}, Alt: {dt.totalA}</span> : null}
          {dt.scrap > 0 ? <span className='redT'>Scraps: {dt.scrap}</span> : null}
          {dt.rma > 0 ? <span className='redT'>RMAs: {dt.rma}</span> : null}
          {dt.finished ?
            <span className='greenT'>Finished {moment(dt.finishedAt).calendar()}</span>
          : null}
        </div>
        <div>
          {dt.totalR + dt.totalA < 1 ?
            <span className='yellowT wide centreText'>No {Pref.item}s created</span>
          : titlesR.length > 0 ?
            <StatusCell steps={titlesR} counts={countsR} total={dt.totalR} />
          :
            <span className='yellowT wide centreText'>No {Pref.flow} chosen</span>
          }
        </div>
        {titlesA.length > 0 ?
          <div>
            <hr className='fade'/>
            <span className='small cap'>
              <i className='fa fa-asterisk fa-lg' aria-hidden='true'></i>
              <i>{Pref.buildFlowAlt}</i>
            </span>
            <div>
              <StatusCell steps={titlesA} counts={countsA} total={dt.totalA} />
            </div>
          </div>
        :null}
      </section>
    );
  }
}


export class StatusCell extends Component	{
  
  render() {
    return(
      <div className='centreRow'>
        {this.props.steps.map( (entry, index)=>{
          const title = entry.type === 'finish' ||
                        entry.type === 'test' ?
                        entry.step :
                        entry.step + ' ' + entry.type;
          return(
            <ProgPie
              key={index}
              title={title}
              count={this.props.counts[index]}
              total={this.props.total} />
        )})}
      </div>
    );
  }
}