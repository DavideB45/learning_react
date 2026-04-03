import { ActionIcon, Container, Card, Box, ScrollArea, Group, Textarea, Flex } from "@mantine/core"
import { useState, useRef, useEffect } from "react"
import ReactMarkdown, { Components } from "react-markdown"
import TitleTile from "../components/TitleTile"
import { IconSend } from "@tabler/icons-react"

function Message({ children, isUser }) {
	return (
		<Container>
			{children}
		</Container>
	)
}

function MessageContent({ children, isUser }) {
  return (
    <Card padding={0} radius='lg' maw="80%" ml={isUser ? 'auto' : 0} mb='sm' mt='sm'>
    <Box
      bg={isUser ? 'green.6' : 'gray.1'}  p="md"
      style={{ color: isUser ? 'white' : 'var(--mantine-color-gray-9)',}}
    >
      {children}
    </Box>
    </Card>
  )
}

export function ChatToBaby({name, onClick}) {
  const viewport = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "user",
      content: "Hello! Can you help me with a coding question?",
    },
    {
      id: 2,
      role: "assistant",
      content:
        "Of course! I'd be happy to help with your coding question. What would you like to know?",
    },
    {
      id: 3,
      role: "user",
      content: "How do I create a responsive layout with CSS Grid?",
    },
    {
      id: 4,
      role: "assistant",
      content:
        "Creating a responsive layout with CSS Grid is straightforward. Here's a basic example:\n\n```css\n.container {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n  gap: 1rem;\n}\n```\n\nThis creates a grid where:\n- Columns automatically fit as many as possible\n- Each column is at least 250px wide\n- Columns expand to fill available space\n- There's a 1rem gap between items\n\nWould you like me to explain more about how this works?",
    },
  ])

  const addMessage = () => {
    setMessages([
      ...messages,
      {
        id: messages.length + 1,
        role:
          messages[messages.length - 1].role === "user" ? "assistant" : "user",
        content:
          messages[messages.length - 1].role === "user"
            ? "That's a great question! Let me explain further. CSS Grid is a powerful layout system that allows for two-dimensional layouts. The `minmax()` function is particularly useful as it sets a minimum and maximum size for grid tracks."
            : "Thanks for the explanation! Could you tell me more about grid areas?",
      },
    ])
  }

  useEffect(
    () => viewport.current.scrollTo({ top: viewport.current.scrollHeight, behavior: 'smooth' }),
    [messages]
  )
  return (
	<Card
		  shadow="sm" padding="lg" radius="md" withBorder
		  style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
		>
      <TitleTile text={name} onClick={onClick} />
      <ScrollArea viewportRef={viewport} style={{ flex: 1, minHeight: 0 }}>
          {messages.map((message) => {
            const isAssistant = message.role === "assistant"

            return (
              <Message key={message.id} isUser={!isAssistant} padding='md'>
                  {isAssistant ? (
                    <MessageContent isUser={!isAssistant}>
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </MessageContent>
                  ) : (
                    <MessageContent isUser={!isAssistant}>
                      {message.content}
                    </MessageContent>
                  )}
              </Message>
            )
          })}
      </ScrollArea>

      {/* Add message / footer */}
      <Flex gap='md' align="flex-end">
        <Textarea
          placeholder="Message..."
          autoFocus minRows={2} maxRows={6} radius="md" autosize
          style={{ flex:1 }}
          size="lg"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              addMessage();
            }
          }}
        />
        <ActionIcon size="36" radius="md" onClick={addMessage}>
          <IconSend size={20} />
        </ActionIcon>
      </Flex>
	</Card>
  )
}