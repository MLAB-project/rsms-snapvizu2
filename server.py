import cherrypy
import time
import os

snapdir = os.getenv('SNAPVIZU2_SNAP_DIR') or '/tmp/snaps/'

class Snapvizu2(object):
    @cherrypy.expose
    def check(self, cut=None):
        if cut is None:
            cut = ""
        for _ in range(100):
            try:
                found = list(filter(lambda fn: fn > cut, os.listdir(snapdir)))
            except FileNotFoundError:
                found = []
            if found:
                return found[0]
            time.sleep(0.1)
        raise cherrypy.HTTPError(502, 'timed out')

config = {
    '/' : {
        'tools.staticdir.on' : True,
        'tools.staticdir.dir' : os.path.join(os.path.dirname(__file__), 'static'),
        'tools.staticdir.index': 'index.html'
    },
    '/snaps' : {
        'tools.staticdir.on' : True,
        'tools.staticdir.dir' : snapdir,
    },
    'global' : {
        'server.socket_host' : '0.0.0.0',
        'server.socket_port' : 81
    }
}

if __name__ == '__main__':
  cherrypy.quickstart(Snapvizu2(), '/', config)
