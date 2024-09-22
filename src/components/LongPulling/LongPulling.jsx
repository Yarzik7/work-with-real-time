import React, { useState, useEffect } from "react";
import axios from "axios";

const LongPulling = () => {
  const [messages, setMessages] = useState([]);
  const [yourNewMessage, setYourNewMessage] = useState("");

  useEffect(() => {
    const onSubscribe = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/get-message");
        setMessages((prev) => [data, ...prev]);
        await onSubscribe();
      } catch (e) {
        setTimeout(() => onSubscribe(), 500);
      }
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

export default LongPulling;
