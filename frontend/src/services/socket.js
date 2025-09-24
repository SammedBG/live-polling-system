import io from "socket.io-client"

class SocketService {
  constructor() {
    this.socket = null
  }

  connect() {
    // Use environment variable or default to localhost for development
    const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"
    this.socket = io(backendUrl)
    return this.socket
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  getSocket() {
    return this.socket
  }
}

export default new SocketService()
