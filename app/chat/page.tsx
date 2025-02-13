"use client";
import { GoogleGenerativeAI } from "@google/generative-ai";
import React, { useEffect, useRef, useState } from "react";
import { CiLocationArrow1 } from "react-icons/ci";

const AllCharacters = [
  "Naruto",
  "Madara",
  "Itachi",
  "Jiraiya",
  "Sasuke",
  "Tsunade",
  "Orochimaru",
  "Hinata",
  "Sakura",
  "Kakashi",
  "Hashirama",
];
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_API_KEY!);

function Chatbot() {
  const [loading, setLoading] = useState<boolean>(false);
  const [character, setCharacter] = useState<string>("Naruto");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [chatArr, setChatArr] = useState<{ role: string; text: string }[]>([]);
  const [text, setText] = useState<string>("");
  const [firstChat, setFirstChat] = useState<boolean>(true);

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: `
    You are ${character} from Naruto. Respond strictly as ${character}, using their personality, tone, and experiences. 
    - Only answer from ${character}'s perspective. Avoid general Naruto knowledge unless directly related to ${character}.
    - Stay in character. Do not mention being an AI or break the fourth wall.
    - Use specific examples from ${character}'s life (e.g., relationships, battles, beliefs) to make responses authentic.
    - Reflect ${character}'s emotions and motivations in your tone.
    `,
  });

  const handleText = async () => {
    if (!text.trim()) return;

    // Add user input to chat history
    const updatedChatArr = [...chatArr, { role: "user", text }];
    setChatArr(updatedChatArr);
    setText("");
    setLoading(true);

    // Generate a response using the conversation history
    const history = updatedChatArr
      .map((chat) => `${chat.role}: ${chat.text}`)
      .join("\n");
    const prompt = `${history}\n${character}:`;
    console.log(prompt);
    const result = await model.generateContent(prompt);
    const res = await result.response.text();

    // Add model response to chat history
    setChatArr((arr) => [...arr, { role: character, text: res }]);
    setFirstChat(false);
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleText();
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current?.scrollIntoView();
    }
  }, [chatArr]);

  return (
    <div className="bg-zinc-800 w-full min-h-screen text-white font-darumadrop relative flex justify-center items-center flex-col">
      <div className="w-full mb-16">
        <div className="text-3xl mb-8 text-center">
          Chatting with {character}
        </div>
        <div className="flex justify-between items-center flex-col pb-32">
          {chatArr.map((chat, i) => (
            <div
              key={i}
              className={`bg-zinc-700 rounded-md text-xl w-2/3 mx-auto p-2 mb-8 ${
                chat.role === "user" ? "text-right" : "text-left text-gray-300"
              }`}
            >
              {chat.text}
            </div>
          ))}
          {loading && (
            <div
              className={`bg-zinc-700 rounded-md text-xl w-2/3 mx-auto p-2 flex justify-start items-center mb-8 h-8 text-left text-gray-300`}
            >
              <div className="w-3 h-3 ml-3 rounded-full border-t-2 border-b-2 animate-spin"></div>
            </div>
          )}
          <div ref={containerRef}></div>
        </div>

        <div
          className={`bg-zinc-700 rounded-xl w-2/3 mx-auto p-3 ${
            !firstChat
              ? "fixed bottom-10 left-1/2 transform -translate-x-1/2"
              : ""
          }`}
        >
          <input
            className="w-full text-xl bg-zinc-700 outline-none"
            type="text"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
          />
          <div className="flex text-zinc-400 justify-between mt-4 items-center">
            <div className="flex justify-center items-center">
              <select
                className="bg-zinc-700 outline-none"
                defaultValue={character}
                onChange={(e) => {
                  setChatArr([]);
                  setCharacter(e.target.value);
                }}
              >
                {AllCharacters.map((char, i) => (
                  <option key={i} value={char}>
                    {char}
                  </option>
                ))}
              </select>
            </div>
            <div
              className={`flex justify-center items-center rounded-full  text-2xl cursor-pointer ${
                text && "bg-white text-black"
              }`}
            >
              <button onClick={handleText}>
                <CiLocationArrow1 className="" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
