import endpoints

from protorpc import messages
from protorpc import message_types
from protorpc import remote
from google.appengine.ext import ndb

class PointModel(ndb.Model):
    x = ndb.IntegerProperty()
    y = ndb.IntegerProperty()

class RivetModel(ndb.Model):
    image = ndb.StringProperty()
    name = ndb.StringProperty()
    voidZones = ndb.LocalStructuredProperty(PointModel, repeated=True)
    tags = ndb.StringProperty(repeated=True)

    @classmethod
    def fromMessage(rivetMessage):
        return RivetModel(image=rivetMessage.image, name=rivetMessage.name, voidZones=[], tags=rivetMessage.tags)

    def fillFromMessage(self, msg):
        self.image = msg.image
        self.name = msg.name
        self.voidZones = [PointModel(x=z.x, y=z.y) for z in msg.voidZones]
        self.tags = msg.tags

    def toMessage(self):
        return Rivet(
                rivetId=self.key.urlsafe(), 
                image=self.image, 
                name=self.name, 
                voidZones=[Point(x=p.x, y=p.y) for p in self.voidZones], 
                tags=self.tags)

class Point(messages.Message):
    x = messages.IntegerField(1, required=True)
    y = messages.IntegerField(2, required=True)

class Rivet(messages.Message):
    rivetId = messages.StringField(1)
    image  = messages.StringField(2, required=True)
    name = messages.StringField(3)
    voidZones = messages.MessageField(Point, 4, repeated=True)
    tags = messages.StringField(5, repeated=True)

class RivetCollection(messages.Message):
    name = messages.StringField(1)
    rivets = messages.MessageField(Rivet, 2, repeated=True)

class RivetCollections(messages.Message):
    collections = messages.MessageField(RivetCollection, 1, repeated=True)

class RivetRequest(messages.Message):
    key = messages.StringField(1);

@endpoints.api(name='rivet',version='v1',
               description='Rivet Management API')
class RivetApi(remote.Service):


    '''
        List rivets
    '''
    @endpoints.method(message_types.VoidMessage, RivetCollections,
                      path='Rivet', http_method='GET',
                      name='rivets.list')
    def rivet_list(self, unused_request):
        models = RivetModel.query().fetch(9999)

        rivetArray = [r.toMessage() for r in models]
	return RivetCollections(collections=[RivetCollection(name='', rivets=rivetArray)])
        

    '''
        insert rivet
    '''
    @endpoints.method(Rivet, Rivet,
                        path='Rivet', http_method='POST',
                        name='rivet.add')
    def rivet_add(self, request):
        theTags = [t.strip() for t in request.tags]
        theVoidZones = [PointModel(x=z.x, y=z.y) for z in request.voidZones]
        if request.rivetId is not None:
            modelKey = ndb.Key(urlsafe=request.rivetId)
            model = modelKey.get()
            model.fillFromMessage(request)
        else:
            model = RivetModel(image=request.image, name=request.name, voidZones=theVoidZones, tags=theTags)
        
        model.put()
        return request

    '''
        get rivet
    '''
    @endpoints.method(RivetRequest, Rivet,
                        path='Rivets', http_method='GET',
                        name='get')
    def rivet_get(self, request):
        modelKey = ndb.Key(urlsafe=request.key)
        model = modelKey.get()
        return model.toMessage()
    
	'''
		delete rivet
	'''
    @endpoints.method(RivetRequest, message_types.VoidMessage,
                        path='Rivets', http_method='DELETE',
                        name='delete')
    def rivet_delete(self, request):
        modelKey = ndb.Key(urlsafe=request.key)
        model = modelKey.delete()
        return message_types.VoidMessage()


application= endpoints.api_server([RivetApi])

