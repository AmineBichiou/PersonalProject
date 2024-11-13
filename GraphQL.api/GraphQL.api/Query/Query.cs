


using GraphQL.api.Models;
using HotChocolate.Data;
using MongoDB.Driver;
using System.Linq.Expressions;
public class Query
{
    private readonly IMongoDatabase _database;

    public Query(IMongoDatabase database)
    {
        _database = database;
    }

    // Asynchronous query fetching all items from the collection
    [UsePaging]
    [UseFiltering]
    [UseSorting]
    public async Task<IQueryable<clients>> GetClients()
    {
        var collection = _database.GetCollection<clients>("clients");
        return collection.AsQueryable();
    }
    /*public async Task<IQueryable<transfers>> GetTransfers()
    {
        var collection = _database.GetCollection<transfers>("transfers");
        return collection.AsQueryable();
    }*/
     [UsePaging]
     [UseFiltering]
     [UseSorting]
     public async Task<IQueryable<transfers>> GetTransfers(DateTime? date)
     {
         var collection = _database.GetCollection<transfers>("transfers");
         Expression<Func<transfers, bool>> filter = transfer =>
             (!date.HasValue ||
             (transfer.dateTime.Date == date.Value.Date));
         return collection.AsQueryable().Where(filter);
     }


}
