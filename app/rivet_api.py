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

class PlacedRivetModel(ndb.Model):
    x = ndb.IntegerProperty()
    y = ndb.IntegerProperty()
    rivetKey = ndb.KeyProperty(kind=RivetModel)

    @classmethod
    def fromMessage(cls, pr):
        return PlacedRivetModel(x=pr.x, y=pr.y, rivetKey=ndb.Key(urlsafe=pr.rivetId))

    def toMessage(self):
        return PlacedRivet(rivetId=self.rivetKey.urlsafe(), x=self.x, y=self.y)


class CollarModel(ndb.Model):
    name = ndb.StringProperty()
    height = ndb.IntegerProperty()
    partWidth = ndb.IntegerProperty()
    rivets = ndb.LocalStructuredProperty(PlacedRivetModel, repeated=True)

    @classmethod
    def fromMessage(cls, c):
        convertedRivets = [PlacedRivetModel.fromMessage(pr) for pr in c.rivets]
        return CollarModel(name=c.name, height=c.height, partWidth=c.partWidth, rivets=convertedRivets)   

    def fillFromMessage(self, c):
        self.name = c.name
        self.height = c.height
        self.partWidth = c.partWidth
        self.rivets =[PlacedRivetModel.fromMessage(pr) for pr in c.rivets]

    def toMessage(self):
        placedRivets = [pr.toMessage() for pr in self.rivets]
        return Collar(name = self.name, key=self.key.urlsafe(), height=self.height, partWidth=self.partWidth, rivets=placedRivets)

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

class IdRequest(messages.Message):
    key = messages.StringField(1);

class PlacedRivet(messages.Message):
    rivetId = messages.StringField(1)
    x = messages.IntegerField(2, required=True)
    y = messages.IntegerField(3, required=True)

class Collar(messages.Message):
    name = messages.StringField(1)
    key = messages.StringField(2)
    rivets = messages.MessageField(PlacedRivet, 3, repeated=True)
    height = messages.IntegerField(4, required=True)
    ''' the width of one of the two parts (left + right) '''
    partWidth = messages.IntegerField(5, required=True)

class Collars(messages.Message):
    collars = messages.MessageField(Collar, 1, repeated=True)

class SizeParameter(messages.Message):
    title = messages.StringField(1)
    value = messages.IntegerField(2)

class CollarSize(messages.Message):
    widthParameters = messages.MessageField(SizeParameter,1,repeated=True)
    heightParameters = messages.MessageField(SizeParameter, 2, repeated=True)

@endpoints.api(name='rivet',version='v1',
               description='Rivet Management API')
class RivetApi(remote.Service):

    '''
       get possible collar size paramters 
    '''
    @endpoints.method(message_types.VoidMessage, CollarSize,
                path="get_collar_sizes", http_method="GET",
                name="collar.getsizes")
    def collar_getsizes(self, request):
        return CollarSize(
                    widthParameters = [ SizeParameter(title="20cm - 25cm", value = 12),
                                        SizeParameter(title="24cm - 34cm", value = 20),
                                        SizeParameter(title="32cm - 40cm", value = 25),
                                        SizeParameter(title="38cm - 50cm", value = 30)],
                    heightParameters = [SizeParameter(title="3 cm", value = 1),
                                        SizeParameter(title="6 cm", value = 3),
                                        SizeParameter(title="9 cm", value = 5)])
    

    '''
        get collar
    '''
    @endpoints.method(IdRequest, Collar,
                path="get_collar", http_method="GET",
                name='collar.get')
    def collar_get(self, request):
        model = ndb.Key(urlsafe=request.key).get()
        return model.toMessage()

    '''
        list collars
    '''
    @endpoints.method(message_types.VoidMessage, Collars,
                path="list_collar", http_method='GET',
                name='collar.list')
    def collar_list(self, request):
        models = CollarModel.query().fetch(9999)
        collarArray = [c.toMessage() for c in models]
        return Collars(collars = collarArray)

    '''
        save collar
    '''
    @endpoints.method(Collar, IdRequest,
                    path="collar", http_method="GET",
                    name='collar.save')
    def collar_save(self, request):
        if request.key is not None:
            modelKey = ndb.Key(urlsafe=request.key)
            model = modelKey.get()
            model.fillFromMessage(request)
        else:
            model = CollarModel.fromMessage(request)

        model.put()
        return IdRequest(key = model.key.urlsafe())
    

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
    @endpoints.method(IdRequest, Rivet,
                        path='Rivets', http_method='GET',
                        name='get')
    def rivet_get(self, request):
        modelKey = ndb.Key(urlsafe=request.key)
        model = modelKey.get()
        return model.toMessage()
    
	'''
		delete rivet
	'''
    @endpoints.method(IdRequest, message_types.VoidMessage,
                        path='Rivets', http_method='DELETE',
                        name='delete')
    def rivet_delete(self, request):
        modelKey = ndb.Key(urlsafe=request.key)
        model = modelKey.delete()
        return message_types.VoidMessage()


application= endpoints.api_server([RivetApi])

