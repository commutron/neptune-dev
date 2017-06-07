import React, {Component} from 'react';
import Pref from '/client/global/pref.js';
import Alert from '/client/global/alert.js';

export default class ShortButton extends Component {

	 constructor() {
    super();
    this.state = {
      show: false
    };
    this.handleClick = this.handleClick.bind(this);
  }

    handleClick() {
      this.setState({ show: !this.state.show });
    }

    handleSh(event) {
      event.preventDefault();
      this.go.disabled = true;
      const batchId = this.props.id;
      const part = this.pNum.value.trim().toLowerCase();
      const qu = this.qNum.value;
      const comm = this.comm.value.trim().toLowerCase();

      const exist = this.props.short.find(x => x.partNum === part);
        if(exist) {
          Bert.alert({
            title: 'Duplicate',
            message: Pref.missingPart + ' has already been recorded',
            type: 'carrot',
            style: 'fixed-bottom',
            icon: 'fa-ban'});
        }else{
          Meteor.call('addShort', batchId, part, qu, comm, (error, reply)=>{
            if(error)
              console.log(error);
            if(reply) {
              Bert.alert(Alert.success);
              this.pNum.value='';
              this.qNum.value='';
              this.setState({ show: !this.state.show });
            }else{
              Bert.alert(Alert.danger);
            }
          });
        }
    }


  render () {
    
    const unlock = Roles.userIsInRole(Meteor.userId(), 'run') ? true : false;

    return (
      <div>
        { !this.state.show ?
          <div className='centre'>
					  <button className='action yellow wide cap' onClick={this.handleClick}>{Pref.missingPart}</button>
				  </div>
          :
          <div className='actionBox yellow'>
            <button className='action clear rAlign' onClick={this.handleClick}>{Pref.close}</button>
              <br />
              <br />
              <form className='centre' onSubmit={this.handleSh.bind(this)}>
                <p><label htmlFor='shumber'>Part Number</label><br />
                  <input
                    type='text'
                    id='shumber'
                    ref={(i)=> this.pNum = i}
                    placeholder='110072'
                    autoFocus='true'
                    required />
                </p>
                <p><label htmlFor='shuantity'>Quantity</label><br />
                  <input
                    type='number'
                    id='shuantity'
                    ref={(i)=> this.qNum = i}
                    max='100000'
                    min='1'
                    inputMode='numeric'
                    placeholder='10'
                    required />
                </p>
                <p><label htmlFor='cmmnt'>Comment</label><br />
                  <input
                    type='text'
                    id='cmnt'
                    ref={(i)=> this.comm = i}
                    placeholder='other information' />
                </p>
                <br />
                <p><button
                  type='submit'
                  ref={(i)=> this.go = i}
                  disabled={!unlock}
                  className='action clear'>{Pref.post}</button>
                </p>
              </form>
              <br />
            </div>
        }
      </div>
    );
  }
}