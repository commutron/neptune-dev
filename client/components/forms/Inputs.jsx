import React, {Component} from 'react';

export class Text extends Component	{
  // test for micro components but getting the refs doesn't work
  render() {
    return(
      <input
        type='text'
        id={this.props.iD}
        name={this.props.namE}
        placeholder={this.props.placE}
        defaultValue={this.props.defaulT}
        
      />
      );
  }
}

export class Submit extends Component	{
  render() {
    return(
      <label htmlFor={this.props.name}><br />
        <button
          type='submit'
          id={this.props.name}
          className={this.props.type + ' clearGreen'}
          disabled={this.props.disabled}
        >{this.props.name}
        </button>
      </label>
      );
  }
}