'use client';

import {
  Timestamp,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
  addDoc,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { RiLogoutBoxRLine } from 'react-icons/Ri';
import { auth, db } from '../../../firebase';
import { useAppContext } from '@/context/AppContext';

type Room = {
  id: string;
  name: string;
  createdAt: Timestamp;
};

const Sidebar = () => {
  const { user, userId, setSelectedRoom } = useAppContext();
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    //ユーザーIDに応じてFirestoreからroomを取得してくる関数
    if (user) {
      const fetchRooms = async () => {
        const roomCollectionRef = collection(db, 'rooms');
        const q = query(
          roomCollectionRef,
          where('userid', '==', userId),
          orderBy('createdAt')
        );
        const unsubscribe = onSnapshot(q, snapshot => {
          //db内のデータの変更を監視
          const newRooms: Room[] = snapshot.docs.map(doc => ({
            id: doc.id,
            name: doc.data().name,
            createdAt: doc.data().createdAt,
          }));
          setRooms(newRooms);
        });
        return () => {
          unsubscribe();
        };
      };

      fetchRooms();
    }
  }, [userId]);

  const addNewRoom = async () => {
    //新しいルームを作成する関数
    const roomName = prompt('ルーム名を入力してください');
    if (roomName) {
      const newRoomRef = collection(db, 'rooms');
      await addDoc(newRoomRef, {
        name: roomName,
        userid: userId,
        createdAt: serverTimestamp(),
      });
    }
  };

  const selectRoom = (roomId: string) => {
    //ルームの切り替えを行う関数
    setSelectedRoom(roomId);
  };

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <div className="bg-custom-blue h-full overflow-y-auto px-5 flex flex-col">
      <div className=" flex-grow ">
        <div
          className="flex justify-evenly items-center border mt-2 rounded-md cursor-pointer hover:bg-blue-800 duration-200"
          onClick={addNewRoom}
        >
          <span className="text-white p-4 text-2xl">+</span>
          <h1 className=" text-white text-xl font-semibold p-4">New Chat</h1>
        </div>
        <ul>
          {rooms.map(room => (
            <li
              key={room.id}
              className="cursor-pointer border-b p-4 text-slate-100 hover:bg-blue-700 duration-200"
              onClick={() => selectRoom(room.id)}
            >
              {room.name}
            </li>
          ))}
        </ul>
      </div>
      {user && (
        <div className="mb-2 p-4 text-slate-100 font-medium">
          {user.email}
        </div>
      )}
      <div
        onClick={handleLogout}
        className=" flex items-center mb-2 cursor-pointer p-4 hover:bg-slate-700 duration-150 justify-evenly text-slate-100"
      >
        <RiLogoutBoxRLine />
        <span>ログアウト</span>
      </div>
    </div>
  );
};

export default Sidebar;
