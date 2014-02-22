import endpoints

from protorpc import messages
from protorpc import message_types
from protorpc import remote


class Point(messages.Message):
    x = messages.IntegerField(1, required=True)
    y = messages.IntegerField(2, required=True)

class RivetMessage(messages.Message):
    rivetId = messages.StringField(1)
    image  = messages.StringField(2, required=True)
    voidZones = messages.MessageField(Point, 3, repeated=True)

class RivetCollection(messages.Message):
    name = messages.StringField(1)
    rivets = messages.MessageField(RivetMessage, 2, repeated=True)

class RivetCollections(messages.Message):
    collections = messages.MessageField(RivetCollection, 1, repeated=True)

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
        rivetArray = []
        rivetArray.append(
            RivetMessage(rivetId="1", image="images/rivets/number_1.png", 
                            voidZones = [Point(x=1, y=1), Point(x=-1, y=-1)]))
        rivetArray.append(
            RivetMessage(rivetId="1", image="images/rivets/number_2.png",
                            voidZones = [Point(x=1, y=1), Point(x=-1, y=-1)]))
        rivetArray.append(
            RivetMessage(rivetId="1", image="images/rivets/number_3.png",
                            voidZones = [Point(x=1, y=1), Point(x=-1, y=-1)]))
        rivetArray.append(
            RivetMessage(rivetId="1", image="images/rivets/number_4.png",
                            voidZones = [Point(x=1, y=1), Point(x=-1, y=-1)]))
        
        rc1 = RivetCollection(name='Spitznieten', rivets = rivetArray)
        rc2 = RivetCollection(name='Motivnieten', rivets = rivetArray)
        rc3 = RivetCollection(name='Strassnieten', rivets= rivetArray)
        rc4 = RivetCollection(name='Andere', rivets = [])
        return RivetCollections(collections=[rc1, rc2, rc3, rc4])

    '''
        insert rivet
    '''
    @endpoints.method(RivetMessage, RivetMessage,
                        path='Rivet', http_method='POST',
                        name='rivet.add')
    def rivet_add(self, request):
        pass
    
application = endpoints.api_server([RivetApi])

