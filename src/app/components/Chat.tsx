'use client';

import React, { useEffect, useRef, useState } from 'react';
import { PiPaperPlaneTiltLight } from 'react-icons/Pi';
import { Timestamp, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../../../firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useAppContext } from '@/context/AppContext';
import OpenAI from 'openai';
import LoadingIcons from 'react-loading-icons';

type Massage = {
  text: string;
  sender: string;
  cratedAt: Timestamp;
};

const Chat = () => {
  const openAi = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
    dangerouslyAllowBrowser: true,
  });

  const { selectedRoom , selectedRoomName} = useAppContext();
  const [inputMassage, setInputMassage] = useState<string>('');
  const [messages, setMessages] = useState<Massage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const scrollDev = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedRoom) {
      const fetchMessages = async () => {
        const roomDocRef = doc(db, 'rooms', selectedRoom);
        const messageCollectionRef = collection(roomDocRef, 'messages');

        const q = query(messageCollectionRef, orderBy('createdAt'));

        const unsubscribe = onSnapshot(q, snapshot => {
          const newMassages = snapshot.docs.map(doc => doc.data() as Massage);
          setMessages(newMassages);
          return () => {
            unsubscribe();
          };
        });
      };
      fetchMessages();
    }
  }, [selectedRoom]);

  useEffect(() => {
    if(scrollDev.current) {
      const element = scrollDev.current;
      element.scrollTo({
        top:element.scrollHeight,
        behavior:'smooth'
      })
    }
  },[messages])

  //メッセージをFirestoreに保存
  const sendMessage = async () => {
    if (!inputMassage.trim()) return;
    const messageData = {
      text: inputMassage,
      sender: 'user',
      createdAt: serverTimestamp(),
    };
    const roomDocRef = doc(db, 'rooms', selectedRoom!);
    const messageCollectionRef = collection(roomDocRef, 'messages');
    await addDoc(messageCollectionRef, messageData);

    setInputMassage('')

    setIsLoading(true);

    //openAIからの返信
    const gptResponse = await openAi.chat.completions.create({
      messages: [{ role: 'user', content: inputMassage }],
      model: 'gpt-3.5-turbo',
    });
  
    setIsLoading(false);

    const botResponse = gptResponse.choices[0].message.content;
    await addDoc(messageCollectionRef, {
      text: botResponse,
      sender: 'bot',
      createdAt: serverTimestamp(),
    });
  };
  
  return (
    <div className=" bg-gray-500 h-full p-4 flex flex-col ">
      <h1 className=" text-2xl text-white font-semibold mb-4">{selectedRoomName}</h1>
      <div className="flex-grow overflow-y-auto mb-4" ref={scrollDev}>
        {messages.map((message, index) => (
          <div
          key={index}
          className={message.sender === 'user' ? 'text-right' : 'text-left'}
          >
            <div
              className={
                message.sender === 'user'
                ? ' bg-blue-500 inline-block rounded px-4 py-2 mb-2'
                : ' bg-green-500 inline-block rounded px-4 py-2 mb-2'
              }
            >
              <p className="text-white font-medium">{message.text}</p>
            </div>
          </div>
        ))}
        {isLoading && <LoadingIcons.SpinningCircles />}
      </div>
      <div className=" flex-shrink-0 relative">
        <input
          type="text"
          className="border rounded w-full pr-10 focus:outline-none p-2"
          placeholder="Send a message"
          onChange={e => setInputMassage(e.target.value)}
          value={inputMassage}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              sendMessage();
            }
          }}
        />
        <button
          className=" absolute inset-y-0 right-4 flex items-center"
          onClick={() => sendMessage()}
        >
          <PiPaperPlaneTiltLight />
        </button>
      </div>
    </div>
  );
};

export default Chat;
