import io from 'socket.io-client';
import IPV4 from '../apis/ipv4';

const SOCKET_URL = `https://${IPV4}`;

class ConnectSocket {
  initSocket = async userId => {
    try {
      if (userId) {
        this.socket = io(SOCKET_URL, {
          transports: ['websocket'],
          query: {
            userId: userId,
          },
        });
      }
      console.log('initsocket');

      this.socket.on('connect', () => {
        console.log('Connected to server');
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected to server');
      });

      this.socket.on('error', data => {
        console.log('socket error', data);
      });
    } catch (error) {
      console.log('initSocket error', error);
    }
  };

  emit(event, data = {}) {
    this.socket.emit(event, data);
  }

  on(event, callback) {
    this.socket.on(event, callback);
  }

  off(event) {
    this.socket.off(event);
  }

  close() {
    this.socket.close();
  }

  removeListener(event) {
    this.socket.removeListener(event);
  }
}

const connectSocket = new ConnectSocket();

export default connectSocket;
