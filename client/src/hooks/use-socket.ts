import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { WS_EVENTS } from "@shared/schema";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { getToken } from "./use-auth";

export function useSocket(projectId: number) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!projectId) return;

    const token = getToken();
    const newSocket = io(window.location.origin, {
      auth: { token },
      path: "/socket.io",
    });

    newSocket.on("connect", () => {
      console.log("Socket connected");
      setIsConnected(true);
      newSocket.emit(WS_EVENTS.JOIN_PROJECT, projectId);
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    // Event listeners
    newSocket.on(WS_EVENTS.TASK_CREATED, (task) => {
      console.log("Task created event:", task);
      queryClient.invalidateQueries({ queryKey: [api.tasks.list.path, projectId] });
    });

    newSocket.on(WS_EVENTS.TASK_UPDATED, (task) => {
      console.log("Task updated event:", task);
      queryClient.invalidateQueries({ queryKey: [api.tasks.list.path, projectId] });
    });

    newSocket.on(WS_EVENTS.TASK_DELETED, ({ id }) => {
      console.log("Task deleted event:", id);
      queryClient.invalidateQueries({ queryKey: [api.tasks.list.path, projectId] });
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [projectId, queryClient]);

  return { socket, isConnected };
}
