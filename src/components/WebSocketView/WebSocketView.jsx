import { useState, useRef } from "react";

const WebSocketView = () => {
  const [messages, setMessages] = useState([]);
  const [yourNewMessage, setYourNewMessage] = useState("");
  const [username, setUsername] = useState("");
  const [connected, setConnected] = useState(false);
  const socket = useRef();

  function onConnect() {
    socket.current = new WebSocket("ws://localhost:5000");

    socket.current.onopen = () => {
      setConnected(true);
      const message = {
        event: "connection",
        id: Date.now(),
        username,
      };
      socket.current.send(JSON.stringify(message));
      console.log("The connection is established");
    };

    socket.current.onmessage = (e) => {
      const parsedMessage = JSON.parse(e.data);
      setMessages((prev) => [parsedMessage, ...prev]);
    };
    socket.current.onclose = () => {};
    socket.current.onerror = () => {};
  }

  const onMessageChange = (e) => {
    setYourNewMessage(e.target.value);
  };

  const onUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const onSubmitMessage = async (e) => {
    e.preventDefault();
    const message = {
      id: Date.now(),
      username,
      message: yourNewMessage,
      event: "message",
    };
    socket.current.send(JSON.stringify(message));
    setYourNewMessage("");
  };

  if (!connected) {
    return (
      <div>
        <div>
          <input
            name="username"
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={onUsernameChange}
          />
          <button onClick={onConnect}>Enter</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div>
        <form onSubmit={onSubmitMessage}>
          <input
            name="message"
            type="text"
            value={yourNewMessage}
            onChange={onMessageChange}
          />
          <button type="submit">Send</button>
        </form>

        <ul>
          {messages.map((message, idx) => (
            <li key={idx}>
              {message.event === "connection" ? (
                <p>{`User ${message.username} was connected`}</p>
              ) : (
                <p>{`${message.username}: ${message.message}`}</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WebSocketView;
