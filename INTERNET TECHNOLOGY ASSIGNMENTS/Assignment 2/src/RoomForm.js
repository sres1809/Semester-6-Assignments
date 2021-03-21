import React, { Component } from 'react'
import "./RoomForm.css"

  
class RoomForm extends Component{ 
  constructor(props){ 
    super(props) 
    this.state = { roomname:'' } 
    this.handleChange = this.handleChange.bind(this) 
    this.handleSubmit = this.handleSubmit.bind(this) 
  } 
  
  handleChange(event){ 
    this.setState({ 
      [event.target.name] : event.target.value 
    }) 
  } 
  
  handleSubmit(event){ 
    event.preventDefault() 
    this.props.create(this.state) 
      console.log(`The room joined is: ${this.state.roomname}`)
      let dm = "No"
      if (`${this.state.roomname}`.split(" ").length > 1)
        dm = "Yes";
      else
        dm = "No";
      this.props.socket.emit("joinroom", `${this.props.userdata}`, `${this.state.roomname}`, dm);
      this.setState({roomname : ""});
    };
  
  render(){ 
    return( 
      <form> 
        <div className="newrooms"> 
          <label className="label">Enter Roomname/Username: </label>
          <input  
            name='roomname'
            value={this.state.roomname} 
            onChange={this.handleChange} 
          /> 
          <br></br>
          <br></br>
          <button className="button" type="submit" onClick={this.handleSubmit}>Start chatting!</button> 
        </div> 
      </form> 
    ) 
  } 
} 
  
export default RoomForm;