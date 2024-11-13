using GraphQL.api.Input;
using GraphQL.api.Models;
using MongoDB.Bson;
using MongoDB.Driver;

public class Mutation
{
    private readonly IMongoDatabase _database;

    public Mutation(IMongoDatabase database)
    {
        _database = database;
    }

    [UseMutationConvention]
    public async Task<transfers> CreateTransfers(TransferInput input)
    {
        var collection = _database.GetCollection<transfers>("transfers");
        var client = new clients
        {
            id = Guid.NewGuid().ToString(),
            name = input.Client.name,
            email = input.Client.email,
            phone = input.Client.phone,
            
        };

        var newTransfer = new transfers
        {
            id = Guid.NewGuid().ToString(),
            from = input.from,
            to = input.to,
            dateTime = input.dateTime,
            isCompleted = input.isCompleted,
            status = input.status,
            options = input.options,
            client = client 
        };
        await collection.InsertOneAsync(newTransfer);

        return newTransfer;
    }

    [UseMutationConvention]
    public async Task<transfers> UpdateTransferTime(string transferId, DateTime newTime)
    {
        var collection = _database.GetCollection<transfers>("transfers");

        // Find the transfer by ID
        var filter = Builders<transfers>.Filter.Eq(t => t.id, transferId);
        var transfer = await collection.Find(filter).FirstOrDefaultAsync();

        if (transfer == null)
        {
            throw new Exception("Transfer not found");
        }

        // Update the time portion of the dateTime while preserving the date portion
        transfer.dateTime = new DateTime(
            transfer.dateTime.Year,
            transfer.dateTime.Month,
            transfer.dateTime.Day,
            newTime.Hour,
            newTime.Minute,
            newTime.Second,
            transfer.dateTime.Kind
        );

        // Update the document in the database
        await collection.ReplaceOneAsync(filter, transfer);

        return transfer;
    }
}
