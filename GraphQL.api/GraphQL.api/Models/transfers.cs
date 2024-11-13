using MongoDB.Bson;

namespace GraphQL.api.Models
{
    public class transfers
    {
        public string id { get; set; }
        public clients client  { get; set; }  
        public string from { get; set; }
        public string to { get; set; }

        public DateTime dateTime { get; set; }
        public bool isCompleted { get; set; }
        public bool status { get; set; }
        public string options { get; set; }
    }
}
