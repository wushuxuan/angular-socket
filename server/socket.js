module.exports = {
  connect: function (io, PORT) {
    var rooms = ["room1", "room2", "room3", "room4"]; //list of available rooms
    var socketRoom = []; //list of socket.id and joined rooms
    var socketRoomnum = [];

    const chat = io.of("/chat");

    chat.on("connection", (socket) => {
      console.log("socket链接成功");
      socket.on("message", (message) => {
        console.log("socket发送消息:" + JSON.stringify(message));
        console.log("socket.id:");
        console.log(socket.id);
        console.log("socketRoom:");
        console.log(socketRoom);
        for (i = 0; i < socketRoom.length; i++) {
          //check each if current socket id has joined a room
          if (socketRoom[i][0] == socket.id) {
            //emit back to the room
            chat.to(socketRoom[i][1]).emit("message", message);
          }
        }
      });

      //return number of users is a room only to that room
      socket.on("numusers", (room) => {
        var usercount = 0;

        for (i = 0; i < socketRoomnum.length; i++) {
          if (socketRoomnum[i][0] == room) {
            usercount = socketRoomnum[i][1];
          }
        }

        //send back the count as a numuser event.
        chat.in(room).emit("numusers", usercount);
      });

      //join a room
      socket.on("joinRoom", (room) => {
        // if (rooms.includes(room)) {
        socket.join(room, () => {
          //check not already in a room
          var inroomSocketarray = false;

          for (i = 0; i < socketRoom.length; i++) {
            //track who is in each room
            if (socketRoom[i][0] == socket.id) {
              socketRoom[i][1] = room;
              inroom = true;
            }
          }
          if (inroomSocketarray == false) {
            socketRoom.push([socket.id, room]);
            var hasroomnum = false;
            for (let j = 0; j < socketRoomnum.length; j++) {
              if (socketRoomnum[j][0] == room) {
                socketRoomnum[j][1] = socketRoomnum[j][1] + 1;
                hasroomnum = true;
              }
            }

            if (hasroomnum == false) {
              socketRoomnum.push([room, 1]);
            }
          }
          chat.in(room).emit("notice", "A new user has joined");
        });
        return chat.in(room).emit("joined", room);
        // }
      });

      //leave a room
      socket.on("leaveRoom", (room) => {
        for (let i = 0; i < socketRoom.length; i++) {
          if (socketRoom[i][0] == socket.id) {
            socketRoom.splice(i, 1);
            socket.leave(room);
            chat.to(room).emit("notice", "A user has left");
          }
        }

        for (let j = 0; j < socketRoomnum.length; j++) {
          if (socketRoomnum[j][0] == room) {
            socketRoomnum[j][1] = socketRoomnum[j][1] - 1;
            if (socketRoomnum[j][1] == 0) {
              socketRoomnum.splice(j, 1);
            }
          }
        }
      });

      //event to disconnect from the socket
      socket.on("disconnect", () => {
        chat.emit("disconnect");
        for (let i = 0; i < socketRoom.length; i++) {
          if (socketRoom[i][0] == socket.id) {
            socketRoom.splice(i, 1);
          }
        }
        for (let j = 0; j < socketRoomnum.length; j++) {
          if (socketRoomnum[j][0] == socket.room) {
            socketRoomnum[j][1] = socketRoomnum[j][1] - 1;
          }
        }
      });
    });
  },
};
