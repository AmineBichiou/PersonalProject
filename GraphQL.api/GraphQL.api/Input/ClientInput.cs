using MongoDB.Bson;

namespace GraphQL.api.Input
{
    public class ClientInput
    {
        public string name { get; set; }
        public string email { get; set; }
        public int phone { get; set; }   
       
    }
}
