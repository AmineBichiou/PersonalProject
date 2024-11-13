using MongoDB.Driver;
using MongoDB.Bson;
using System;
using System.Threading.Tasks;

namespace GraphQL.api.Models
{

    public class clients
    {
        public string id { get; set; }
        public string name { get; set; }
        public string email { get; set; }
        public int phone { get; set; }
    }
}