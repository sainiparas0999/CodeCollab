import express from "express";
import { Server } from "socket.io";
import {createServer, get} from "http"
import  cors from "cors" ;
// import ACTIONS from "./Action";
const app = express() ;
const port = 3000 ;

app.get("/" , (req , res) => {
    res.send("Hello webSocket")
})


const server = createServer(app)
const io = new Server(server , {
    cors:{
        origin:"https://code-collab-client.vercel.app/",
        methods:["Get" , "Post"] ,
        credentials: true ,
    }
})


app.use(
     cors({
        origin:"https://code-collab-client.vercel.app/",
        methods:["Get" , "Post"] ,
        credentials: true ,
    })
    );

  

    const ACTIONS = {
        JOIN: 'join',
        JOINED: 'joined',
        DISCONNECTED: 'disconnected',
        CODE_CHANGE: 'code-change',
        SYNC_CODE: 'sync-code',
        LEAVE: 'leave',
    };

const userSocketMap = {};
function getAllConnectedClients(roomId) {
    // Map
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
        (socketId) => {
            return {
                socketId,
                username: userSocketMap[socketId],
            };
        }
    );
}


io.on('connection', (socket) => {
    console.log('socket connected', socket.id);

    socket.on('join', ({ roomId, username }) => {
        console.log("username is :",username , " roomId :" , roomId);
         userSocketMap[socket.id]= username;
        socket.join(roomId);
        const clients = getAllConnectedClients(roomId);
         console.log(clients);
        clients.forEach(({ socketId }) => {
            io.to(socketId).emit(ACTIONS.JOINED, {
                clients,
                username,
                socketId: socket.id,
            });
        });
    });

    socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
        io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms];
        rooms.forEach((roomId) => {
            socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
                socketId: socket.id,
                username: userSocketMap[socket.id],
            });
        });
        delete userSocketMap[socket.id];
        socket.leave();
    });
});



server.listen( port , () => {
    console.log("App is running at :" , port)
})   