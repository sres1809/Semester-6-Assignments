import React from "react";
import "./Chatmessages.css";
import ReactEmoji from "react-emoji";
import ScrollToBottom from 'react-scroll-to-bottom';



class Chatmessages extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            name : "",
            messages : []
    }
    this.rendermessage = this.rendermessage.bind(this);
    }

    

    componentDidMount() {
        this.setState({ name : this.props.username });
        console.log("UserName is: ", this.props.username);
        console.log("Name is: ", this.state.name);
        this.getmessages();
    }


    getmessages() {
        this.props.socket.on('sentmessage', (sender, receiver, body, type) => {
            console.log(`Sender: ${sender}, Receiver: ${receiver}, the message: ${body}`);
            let message = {
                sender : `${sender}`,
                receiver : `${receiver}`,
                body : `${body}`,
                type : `${type}`
            }
            this.setState({ 
                messages : [...this.state.messages, message]
              })
        });


        this.props.socket.on('sentimage', (sender, receiver, body, type) => {
            console.log(`Sender: ${sender}, Receiver: ${receiver}, the message: ${body}`);
            let message = {
                sender : `${sender}`,
                receiver : `${receiver}`,
                body : body,
                type : `${type}`
            }
            this.setState({ 
                messages : [...this.state.messages, message]
              })
        });
    }

    rendermessage(message) {
        console.log("Name: ", this.state.name, "Sender: ", message.sender);

        if (`${message.type}` === "image")
        {
            return <div className="ownmessage"><img style={{height:"150px"}} src={`${message.body}`} alt={`${message.body}`}/></div>
        }
        else
        {
            return <div className="textmessage">{ReactEmoji.emojify(message.body)}</div>
        }
    }

    showmessages() {
        console.log(this.state.messages);
        const messages1 = this.state.messages.map(message => (
            <div className="messages">
                <div>
                    Sender:{message.sender}   /   Receiver:{message.receiver} <div>{this.rendermessage(message)}</div><br></br>
                </div>   
            </div>   
        )); 
        return <ul>{messages1}</ul>
    }

    render() {
        return (
            <ScrollToBottom className="chatmessage">
                <h1>Messages---</h1>
                {this.showmessages()}                             
            </ScrollToBottom>
        )
    }
}


export default Chatmessages;