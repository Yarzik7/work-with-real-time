import React, { useState, useEffect } from "react";
import axios from "axios";

const EventSourcing = () => {
  const [messages, setMessages] = useState([]);
  const [yourNewMessage, setYourNewMessage] = useState("");

  useEffect(() => {
    const onSubscribe = async () => {
      const eventSource = new EventSource("http://localhost:5000/connect");
      eventSource.onmessage = (e) => {
        const message = JSON.parse(e.data);
        setMessages((prev) => [message, ...prev]);
      };
    };

    onSubscribe();
  }, []);

  const onValueChange = (e) => {
    setYourNewMessage(e.target.value);
  };

  const onSubmitMessage = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/new-message", {
      id: Date.now(),
      message: yourNewMessage,
    });
  };

  return (
    <div>
      <div>
        <form onSubmit={onSubmitMessage}>
          <input type="text" value={yourNewMessage} onChange={onValueChange} />
          <button type="submit">Send</button>
        </form>

        <ul>
          {messages.map((message, idx) => (
            <li key={idx}>{message.message}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EventSourcing;
