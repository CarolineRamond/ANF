from socketIO_client import SocketIO, BaseNamespace
import numpy as np
import numpy.random as npr
import sys


class Main():
    def __init__(self, parent = None):
        self.clientId = sys.argv[1]
        self.socketIO = SocketIO('localhost', 8080, BaseNamespace, params={"clientId" : self.clientId })
        self.namespace = self.socketIO.define(BaseNamespace, '/calc')
        self.param = 3
        self.namespace.on('change_param', self.change_param)

    def change_param(self, *args):
        self.param = int(args[0])

    def run(self):
        while 1:
            positions = npr.uniform(low=0.0,high=10.0,size=self.param)
            buff = bytearray(positions.tobytes())
            self.namespace.emit('data', 
                { "data" : buff, "clientId" : self.clientId });
            self.socketIO.wait(seconds=1)


if __name__ =="__main__":
    m = Main()
    m.run()