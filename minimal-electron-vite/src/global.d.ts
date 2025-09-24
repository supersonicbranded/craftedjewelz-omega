declare global {
  interface Window {
    crafted?: {
      ping: () => Promise<string>;
      ipcRenderer: {
        on: (channel: string, listener: (...args: any[]) => void) => void;
        removeAllListeners: (channel: string) => void;
        send: (channel: string, ...args: any[]) => void;
      };
    };
  }
}
export {};
