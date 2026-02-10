import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { getAuthToken } from "./use-auth";

const WS_EVENTS = {
  JOIN_PROJECT: 'join_project',
  TASK_CREATED: 'task_created',
  TASK_UPDATED: 'task_updated',
  TASK_DELETED: 'task_deleted',
} as const;

export function useSocket(projectId: string) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!projectId) return;

    const token = getAuthToken();
    const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    
    const newSocket = io(socketUrl, {
      auth: { token },
      path: "/socket.io",
    });

    newSocket.on("connect", () => {
      console.log("[CLIENT] Socket connected");
      setIsConnected(true);
      newSocket.emit(WS_EVENTS.JOIN_PROJECT, projectId);
    });

    newSocket.on("disconnect", () => {
      console.log("[CLIENT] Socket disconnected");
      setIsConnected(false);
    });

    newSocket.on(WS_EVENTS.TASK_CREATED, (task) => {
      console.log("[CLIENT] Task created event:", task);
      queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'tasks'] });
    });

    newSocket.on(WS_EVENTS.TASK_UPDATED, (task) => {
      console.log("[CLIENT] Task updated event:", task);
      queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'tasks'] });
    });

    newSocket.on(WS_EVENTS.TASK_DELETED, ({ id }) => {
      console.log("[CLIENT] Task deleted event:", id);
      queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'tasks'] });
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [projectId, queryClient]);

  return { socket, isConnected };
}
