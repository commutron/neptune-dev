import React, {Component} from 'react';
import SlideDownWrap from '/client/components/tinyUi/SlideDownWrap.jsx';

import JumpFind from '../../../components/smallUi/JumpFind.jsx';

export default class ItemsList extends Component	{
  
  filter() {
    const data = this.props.batchData;
    let ipList = [];
    let scList = [];
      data.items.map( (entry)=>{
        // check if item is done
        if(entry.finishedAt === false) {
          ipList.push(entry.serial);
        }else{
          // check for scrap items
          for(let v of entry.history) {
            v.type === 'scrap' ? scList.push(entry.serial) : null;
          }
        }
      });
     return [ipList, scList];
  }

  render() {
    
    const b = this.props.batchData;
    
    const filter = this.filter();
    const active = filter[0];
    const scrap = filter[1];

    return (
      <SlideDownWrap>
        <div className='card centre'>
        {this.props.listTitle ? <h2 className='up'>{b.batch}</h2> : null}
            { b.items.map( (entry, index)=> {
            let style = active.includes(entry.serial) ? 'action clear wide greenT' : 
                        scrap.includes(entry.serial) ? 'action clear wide redT' : 
                        'action clear wide';
              return (
                <JumpFind
                  key={index} 
                  title={entry.serial} 
                  sub='' 
                  sty={style}
                />
              );
            })}
  			</div>
			</SlideDownWrap>
    );
  }
}