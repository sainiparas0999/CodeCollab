import React from "react";
import Avatar from "react-avatar"
export default function Client({userName}){
    return(
        <div className="flex flex-col font-bold ">
          <Avatar name={userName} size={40} round="14px"/>
          <p className="mt-[5px]">{userName}</p>
        </div>
    )
} 