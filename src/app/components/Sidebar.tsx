import React from 'react';
import { RiLogoutBoxRLine } from 'react-icons/Ri';

const Sidebar = () => {
  return (
    <div className="bg-custom-blue h-full overflow-y-auto px-5 flex flex-col">
      <div className=" flex-grow ">
        <div className="flex justify-evenly items-center border mt-2 rounded-md cursor-pointer hover:bg-blue-800 duration-200">
          <span className="text-white p-4 text-2xl">+</span>
          <h1 className=" text-white text-xl font-semibold p-4">New Chat</h1>
        </div>
        <ul>
          <li className="cursor-pointer border-b p-4 text-slate-100 hover:bg-blue-700 duration-200">
            Room-1
          </li>
          <li className="cursor-pointer border-b p-4 text-slate-100 hover:bg-blue-700 duration-200">
            Room-2
          </li>
        </ul>
      </div>
      <div className=" flex items-center mb-2 cursor-pointer p-4 hover:bg-slate-700 duration-150 justify-evenly text-slate-100">
        <RiLogoutBoxRLine/>
        <span>ログアウト</span>
      </div>
    </div>
  );
};

export default Sidebar;
