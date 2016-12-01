from socketIO_client import SocketIO
import numpy as np
import numpy.random as npr


class Main():
    def __init__(self, parent = None):
        self.socketIO = SocketIO('localhost', 8081)

    def run(self):
        while 1:
            positions = npr.uniform(low=0.0,high=10.0,size=3)
            buff = bytearray(positions.tobytes())
            self.socketIO.emit('data', 
                { "data" : buff });
            self.socketIO.wait(seconds=0.1)


if __name__ =="__main__":
    m = Main()
    m.run()