import io, { type SocketOptions, Socket } from 'socket.io-client';

export class SocketApi {
  static socket: Socket | null = null;

  static createConnection(options?: SocketOptions) {
    if (!this.socket) {
      this.socket = io(import.meta.env.VITE_HOST, options);
    }
    return this.socket;
  }
}
