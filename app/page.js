'use client';

import { Box, Stack, TextField, Button, Typography } from "@mui/material";
import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  const firstMessage = "Hi there! I'm the Jaden Wong's AI resume. How can I help?";

  const sendMessage = async () => {
    if (message.trim() === "") return; // Prevent sending empty messages

    setHistory(prevHistory => [
      ...prevHistory,
      { role: "user", parts: [{ text: message }] }
    ]);
    setMessage('');

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([...history, { role: "user", parts: [{ text: message }] }])
      });

      const data = await response.json();
      setHistory(prevHistory => [
        ...prevHistory,
        { role: "model", parts: [{ text: data.text }] }
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent default behavior (e.g., adding a newline)
      sendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="#f5f5f5"
      p={2}
    >
      <Stack
        direction="column"
        width="80%"
        height="90%"
        maxHeight="90%"
        border="1px solid #ddd"
        borderRadius={4}
        spacing={2}
        bgcolor="white"
        boxShadow="0 2px 5px rgba(0,0,0,0.1)"
        p={2}
      >
        <Stack direction="column" spacing={2} overflow="auto" flexGrow={1}>
          <Box
            display="flex"
            justifyContent="center"
            bgcolor="#4a90e2"
            borderRadius={2}
            p={2}
            mb={2}
          >
            <Typography color="white" variant="h6">
              {firstMessage}
            </Typography>
          </Box>
          {history.map((textObject, index) => (
            <Box
              key={index}
              display="flex"
              flexDirection={textObject.role === 'user' ? 'row' : 'row-reverse'}
              mb={1}
            >
              <Box
                bgcolor={textObject.role === 'user' ? '#d1e7ff' : '#e2e3e5'}
                color="black"
                borderRadius={2}
                p={2}
                maxWidth="80%"
                wordBreak="break-word"
                boxShadow="0 2px 4px rgba(0,0,0,0.1)"
              >
                {textObject.parts[0].text}
              </Box>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <TextField
            label="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Type your message here"
            InputProps={{
              style: {
                borderRadius: 20,
              },
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={sendMessage}
            style={{ height: '100%' }}
          >
            Send
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
