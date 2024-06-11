import io from 'socket.io-client';
import IPV4 from '../apis/ipv4';

const SOCKET_URL = `https://${IPV4}`;

class ConnectSocket {
  socket = null;

  initSocket = (userId) => {
    return new Promise((resolve, reject) => {
      const user = JSON.parse(localStorage.getItem('user'));
      try {
        if (user._id) {
          this.socket = io(SOCKET_URL, {
            transports: ['websocket'],
            query: {
              userId: user._id,
            },
          });

          this.socket.on('connect', () => {
            console.log('Connected to server');
            resolve();
          });

          this.socket.on('disconnect', () => {
            console.log('Disconnected to server');
          });

          this.socket.on('error', data => {
            console.log('socket error', data);
            reject(data);
          });
        }
      } catch (error) {
        console.log('initSocket error', error);
        reject(error);
      }
    });
  };

  emit(event, data = {}) {
    if (!this.socket) {
      // throw new Error('Socket not initialized');
      //coneect
      this.initSocket();
    }
    this.socket.emit(event, data);
  }

  on(event, callback) {
    if (!this.socket) {
      this.initSocket();
      // throw new Error('Socket not initialized');
    }
    this.socket.on(event, callback);
  }

  off(event) {
    if (!this.socket) {
      this.initSocket();
      // throw new Error('Socket not initialized');
    }
    this.socket.off(event);
  }

  close() {
    if (!this.socket) {
      throw new Error('Socket not initialized');
    }
    this.socket.close();
  }

  removeListener(event) {
    if (!this.socket) {
      throw new Error('Socket not initialized');
    }
    this.socket.removeListener(event);
  }
}

const connectSocket = new ConnectSocket();

export default connectSocket;

// import io from 'socket.io-client';
// import IPV4 from '../apis/ipv4';

// const SOCKET_URL = `http://${IPV4}:3000`;



// class ConnectSocket {
//   initSocket = async userId => {
//     const user = JSON.parse(localStorage.getItem('user'));
//     try {
//       // if (userId) {
//       //   this.socket = io(SOCKET_URL, {
//       //     transports: ['websocket'],
//       //     query: {
//       //       userId: userId,
//       //     },
//       //   });
//       // }
//       if (user._id) {
//         this.socket = io(SOCKET_URL, {
//           transports: ['websocket'],
//           query: {
//             userId: user._id,
//           },
//         });
//       }
//       console.log('initsocket');

//       this.socket.on('connect', () => {
//         return true;
//         // console.log('Connected to server');
//       });

//       this.socket.on('disconnect', () => {
//         console.log('Disconnected to server');
//       });

//       this.socket.on('error', data => {
//         console.log('socket error', data);
//       });
//     } catch (error) {
//       console.log('initSocket error', error);
//     }
//   };

//   emit(event, data = {}) {
//     this.socket.emit(event, data);
//   }

//   on(event, callback) {
//     this.socket.on(event, callback);
//   }

//   off(event) {
//     this.socket.off(event);
//   }

//   close() {
//     this.socket.close();
//   }

//   removeListener(event) {
//     this.socket.removeListener(event);
//   }
// }

// const connectSocket = new ConnectSocket();

// export default connectSocket;