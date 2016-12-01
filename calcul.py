from socketIO_client import SocketIO, BaseNamespace
import numpy as np
import numpy.random as npr
import sys


class Main():
    def __init__(self, parent = None):
        self.clientId = sys.argv[1]
        self.param = int(sys.argv[2])
        self.socketIO = SocketIO('localhost', 8080, BaseNamespace, params={"clientId" : self.clientId })
        self.namespace = self.socketIO.define(BaseNamespace, '/calc')
        self.namespace.on('change_param', self.change_param)

    def change_param(self, *args):
        self.param = int(args[0])

    def run(self):
        while 1:
            x = npr.uniform(low=-200.0,high=200.0,size=self.param)
            y = npr.uniform(low=-200.0,high=200.0,size=self.param)
            x_buff = bytearray(x.tobytes())
            y_buff = bytearray(y.tobytes())
            self.namespace.emit('data', { 
                "clientId" : self.clientId,
                "x" : x_buff,
                "y" : y_buff
            });
            self.socketIO.wait(seconds=1)


if __name__ =="__main__":
    m = Main()
    m.run()