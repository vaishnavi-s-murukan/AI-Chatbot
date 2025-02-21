import React from "react";
import { Box, Avatar, Typography } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function extractCodeFromString(message: string) {
  const regex = /```([\s\S]*?)```/g;
  const matches = [];
  let match;
  while ((match = regex.exec(message)) !== null) {
    matches.push(match[1]); // Extracts code block content
  }
  return matches.length ? matches : null;
}

function isCodeBlock(str: string) {
  return /^([\s\S]*[{};=\[\]#\/])/.test(str);
}

const ChatItem = ({
  content,
  role,
}: {
  content: string;
  role: "user" | "assistant";
}) => {
  const messageBlocks = extractCodeFromString(content);
  const auth = useAuth();
  const initials = auth?.user?.name
    ? auth.user.name
        .split(" ")
        .map((n) => n[0])
        .join("").toUpperCase()
    : "?";

  return role === "assistant" ? (
    <Box
      sx={{
        display: "flex",
        p: 2,
        bgcolor: "#004d5612",
        gap: 2,
        borderRadius: 2,
        my: 1,
      }}
    >
      <Avatar sx={{ ml: "0" }}>
        <img src="openai.png" alt="openai" width={"30px"} />
      </Avatar>
      <Box>
        {!messageBlocks ? (
          <Typography sx={{ fontSize: "20px" }}>{content}</Typography>
        ) : (
          messageBlocks.map((block, index) =>
            isCodeBlock(block) ? (
              <SyntaxHighlighter
                key={index}
                style={coldarkDark}
                language="javascript"
              >
                {block}
              </SyntaxHighlighter>
            ) : (
              <Typography key={index} sx={{ fontSize: "20px" }}>
                {block}
              </Typography>
            )
          )
        )}
      </Box>
    </Box>
  ) : (
    <Box
      sx={{
        display: "flex",
        p: 2,
        bgcolor: "#004d56",
        gap: 2,
        borderRadius: 2,
      }}
    >
      <Avatar sx={{ ml: "0", bgcolor: "black", color: "white" }}>
        {initials}
      </Avatar>
      <Box>
        {!messageBlocks ? (
          <Typography sx={{ fontSize: "20px" }}>{content}</Typography>
        ) : (
          messageBlocks.map((block, index) =>
            isCodeBlock(block) ? (
              <SyntaxHighlighter
                key={index}
                style={coldarkDark}
                language="javascript"
              >
                {block}
              </SyntaxHighlighter>
            ) : (
              <Typography key={index} sx={{ fontSize: "20px" }}>
                {block}
              </Typography>
            )
          )
        )}
      </Box>
    </Box>
  );
};

export default ChatItem;
