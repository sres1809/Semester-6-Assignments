import React from "react";
import "./Chat.css";
import RoomList from "./RoomList";
import Chatmessages from "./Chatmessages";
import socketClient  from "socket.io-client";
const SERVER = "http://127.0.0.1:8080";


let socket;


class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      current_room: "",
      message: "",
      image: null,
    }
    socket = socketClient (SERVER);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.filehandleChange = this.filehandleChange.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  

  callbackFunction = (childData) => {
    this.setState({current_room: childData})
  }

  componentDidMount() {
    this.setState({username: `${this.props.match.params.name}`});
    this.setState({current_room: ""});
    this.setState({message : ""});
    this.configureSocket();
  }

  configureSocket(){ 
    console.log("hello world!!!");
    socket.on('connect', () => {
        console.log(`I'm connected with the back-end`);
        socket.emit("hello", `${this.state.username}`);
    });


  }

  handleChange(event){ 
    this.setState({ 
      [event.target.name] : event.target.value 
    }) 
  }

  filehandleChange(event){ 
    this.setState({ image: event.target.files[0] });
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log("Sending message!!!");
    let dm = "No"
    if (`${this.state.current_room}`.split(" ").length > 1)
      dm = "Yes";
    else
      dm = "No";
      console.log(`The message sent is: ${this.state.username}  ${this.state.current_room}  ${this.state.message}`, dm)
    socket.emit("sendmessage", `${this.state.username}`, `${this.state.current_room}`, `${this.state.message}`, dm);
    this.setState({message : ""});
  }

  handleUpload(event) {
    event.preventDefault();
    let dm = "No"
      if (`${this.state.current_room}`.split(" ").length > 1)
        dm = "Yes";
      else
        dm = "No";
    let reader = new FileReader();
    if (!reader) return;
    reader.onload = (event) => {
      socket.emit("sendimage", `${this.state.username}`, `${this.state.current_room}`, event.target.result, dm);
      console.log(event.target.result);
    }
    
    reader.readAsDataURL(this.state.image);
      console.log("Sending message!!!");    
        //console.log(`The message sent is: ${this.state.username}  ${this.state.current_room}  ${message}`, dm)
      //socket.emit("sendimage", `${this.state.username}`, `${this.state.current_room}`, `${message}`, dm);
    }


  render() {
    return (
      <div>
        <center><h1>{this.state.username}!!! Welcome to<div className="logo">AppChat</div></h1></center>
        <RoomList parentCallback = {this.callbackFunction} socket = {socket} namefromParent = {this.state.username}/>
        <div className="chatspace">
          <Chatmessages username = {this.state.username} socket = {socket}/>
        </div>
        <div className="sendbox">
        <label className="label">Type Message:   </label>
        <input
            className="typemessage"  
            name='message'
            value={this.state.message} 
            onChange={this.handleChange} 
          />
        <button className="sendbutton" type="submit" onClick={this.handleSubmit}>Send</button><br></br><br></br>

        <label className="label">Upload Image:   </label>
        <input
            type="file"   
            name="image" 
            onChange={this.filehandleChange}
          />
        <button className="sendbutton" type="submit" onClick={this.handleUpload}>Upload</button>
        </div>
        
      </div>
      
    );
  }
}
export default Chat;
