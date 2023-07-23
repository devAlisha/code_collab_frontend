
import React, { useEffect, useRef, useState } from "react";
import Client from "../components/Client";
import Editor from "../components/Editor";
import { initSocket } from "../socket";

import { useLocation, useNavigate, useParams, Navigate } from "react-router-dom"; 
import { toast } from "react-hot-toast";

function EditorPage() {
  const [clients, setClients] = useState([]);
  const socketRef = useRef(null);
  const location = useLocation();
  const reactNavigator = useNavigate();
  const { roomId } = useParams();
  const codeRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (err) => {
        handleError(err);
      });
      socketRef.current.on("connect_failed", (err) => {
        handleError(err);
      });

      function handleError(err) {
        console.log(err.message);
        toast.error(err.message);
        reactNavigator("/");
      }

      socketRef.current.emit("join-room", {
        roomId,
        username: location.state?.username,
      });

      socketRef.current.on("new-user", ({ clients, username, socketId }) => {
        if (username !== location.state?.username) {
          toast.success(`${username} joined room ${roomId}`);
        }
        setClients(clients);


        const currentCode = codeRef.current;
        socketRef.current.emit("code-sync", {
          code: currentCode,
          socketId,
        });
      });

      socketRef.current.on("user-disconnected", ({ socketId, username }) => {
        toast.error(`${username} left room ${roomId}`);
        setClients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
    };

    init();
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [roomId, location.state?.username]);

  if (!location.state) {
    return <Navigate to="/" />;
  }

  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID copied to clipboard");
    } catch (err) {
      toast.error("Failed to copy room ID to clipboard");
    }
  }

  async function leaveRoom() {
    reactNavigator("/");
  }

  return (
    <div className="mainWrap">
      <div className="aside">
        <div className="asideInner">
          <div className="logo">
            <img className="logoImage" src="/code-collab.png" alt="logo" />
          </div>
          <h3>Connected</h3>
          <div className="clientsList">
            {clients.map((client) => (
              <Client key={client.socketId} username={client.username} />
            ))}
          </div>
        </div>

        <button className="btn copyBtn" onClick={copyRoomId}>
          Copy ROOM ID
        </button>
        <button className="btn leaveBtn" onClick={leaveRoom}>
          Leave
        </button>
      </div>

      <div className="editorWrap">
        <Editor
          socketRef={socketRef}
          roomId={roomId}
          onCodeChange={(code) => {
            codeRef.current = code;
          }}
        />
      </div>
    </div>
  );
}

export default EditorPage;
