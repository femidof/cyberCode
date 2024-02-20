"use client";
import { start } from "@/action/start";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { Socket, io } from "socket.io-client";
import { Button } from "@/components/ui/button";
// import { Editor } from './Editor';
// import { File, RemoteFile, Type } from './external/editor/utils/file-manager';

// import { Output } from './Output';
// import { TerminalComponent as Terminal } from './Terminal';

export default function CodingPage({ params }: { params: { slug: string } }) {
  const [podCreated, setPodCreated] = useState(false);
  const replId = params.slug;

  useEffect(() => {
    if (replId) {
      start(uuidv4(), replId)
        .then(() => setPodCreated(true))
        .catch((err) => console.error(err));
    }
  }, [replId]);

  if (!podCreated) {
    return (
      <>
        <div className="container flex flex-col w-full justify-center items-center text-4xl space-y-6">Booting...</div>
      </>
    );
  }
  return <CodingPagePostPodCreation replId={replId} />;
}

interface CodingPagePostPodCreationProp {
  replId: string;
}

export const CodingPagePostPodCreation = ({
  replId,
}: CodingPagePostPodCreationProp) => {
  function useSocket(replId: string) {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
      const newSocket = io(`ws://${replId}.peetcode.com`);
      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }, [replId]);

    return socket;
  }

  const [loaded, setLoaded] = useState(false);
  const socket = useSocket(replId);
  // const [fileStructure, setFileStructure] = useState<RemoteFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [showOutput, setShowOutput] = useState(false);

  useEffect(() => {
    if (socket) {
      // socket.on('loaded', ({ rootContent }: { rootContent: RemoteFile[]}) => {
      //     setLoaded(true);
      //     setFileStructure(rootContent);
      // });
    }
  }, [socket]);

  // const onSelect = (file: File) => {
  //   if (file.type === Type.DIRECTORY) {
  //       socket?.emit("fetchDir", file.path, (data: RemoteFile[]) => {
  //           setFileStructure(prev => {
  //               const allFiles = [...prev, ...data];
  //               return allFiles.filter((file, index, self) =>
  //                   index === self.findIndex(f => f.path === file.path)
  //               );
  //           });
  //       });
  //   } else {
  //       socket?.emit("fetchContent", { path: file.path }, (data: string) => {
  //           file.content = data;
  //           setSelectedFile(file);
  //       });
  //   }
  // };

  if (!loaded) {
    return (
      <div className="container flex flex-col justify-center items-center text-4xl space-y-6 w-[400px]">
        Loading...
      </div>
    );
  }
  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-end justify-items-end p-10">
        <Button onClick={() => setShowOutput(!showOutput)}>See output</Button>
      </div>
      <div className=""></div>
    </div>
  );
};
