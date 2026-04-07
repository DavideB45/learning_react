import { ActionIcon, Container, Card, Box, ScrollArea, Group, Textarea, Flex } from "@mantine/core"
import { useState, useRef, useEffect } from "react"
import ReactMarkdown, { Components } from "react-markdown"
import TitleTile from "../components/TitleTile"
import { IconSend } from "@tabler/icons-react"
import * as ROSLIB from "roslib";

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
      bg={isUser ? 'yellow.6' : 'gray.1'}  p="md"
      style={{ color: isUser ? 'white' : 'var(--mantine-color-gray-9)',}}
    >
      {children}
    </Box>
    </Card>
  )
}

export function ChatToBaby({name, onClick, ros}) {
  const [input, setInput] = useState("");
  const [lastAnswer, setLastAnswer] = useState('')
  const [messages, setMessages] = useState([])
  const [isStreaming, setIsStreaming] = useState(false);
  const viewport = useRef(null);
  const [askService, setAskService] = useState(null);
  const [chunkListener, setChunkListener] = useState(null)

  useEffect(() => {
  
    if(!ros) return;
  
    var askService = new ROSLIB.Service({
      ros: ros,
      name: '/web_chat/ask_gemma',
      serviceType: 'simple_server/srv/SetString'
    })
    setAskService(askService)
    askService.callService({data:''}, (result) => {});

    const listener = new ROSLIB.Topic({
      ros: ros,
      name: '/web_chat/chunks',
      messageType: 'std_msgs/String'
    });
    listener.subscribe((message) => {
      const data = JSON.parse(message.data);
      setLastAnswer((prev) => prev + data.chunk);
      console.log(data)
      if (data.done) {
        setIsStreaming(false);
      }
    });
    setChunkListener(chunkListener)
  
    return () => {
      listener.unsubscribe();
    }
    }, [ros]);

  const addMessage = (userMessage) => {
    // TODO: disattivare la casella di testo (o la possibilità di fare invio)
    if (!userMessage.trim()) return;
    setIsStreaming(true);
    setMessages([
      ...messages,
      {
        id: messages.length + 1,
        role: "assistant",
        content: lastAnswer
      },
      {
        id: messages.length + 2,
        role: "user",
        content: userMessage
      }
    ])
    setLastAnswer("")

    askService.callService({ data: userMessage }, (result) => {
      if(! result.success) {
        setLastAnswer("There has been an error in the answer generation")
      }
    });
  }

  useEffect(
    () => viewport.current.scrollTo({ top: viewport.current.scrollHeight, behavior: 'smooth' }),
    [messages, lastAnswer]
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
                      message.content !== '' && <MessageContent isUser={!isAssistant}>
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
          {lastAnswer !== '' && (
            <Message key="streaming" isUser={false} padding='md'>
              <MessageContent isUser={false}>
                <ReactMarkdown>{lastAnswer}</ReactMarkdown>
              </MessageContent>
            </Message>
          )}
      </ScrollArea>

      {/* Add message / footer */}
      <Flex gap='md' align="flex-end">
        <Textarea
          placeholder="Message..."
          autoFocus minRows={2} maxRows={6} radius="md" autosize
          style={{ flex:1 }}
          size="lg"
          value={input}
          disabled={isStreaming}
          onChange={(e) => setInput(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              addMessage(input);
              setInput("");
            }
          }}
        />
        <ActionIcon size="36" radius="md" onClick={addMessage} disabled={isStreaming}>
          <IconSend size={20} />
        </ActionIcon>
      </Flex>
	</Card>
  )
}