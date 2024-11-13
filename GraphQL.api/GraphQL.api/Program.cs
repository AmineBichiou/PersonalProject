using HotChocolate;
using HotChocolate.Data;
using HotChocolate.Data.MongoDb;
using MongoDB.Driver;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder =>
        {
            builder
                .AllowAnyOrigin() // Allow any origin (or specify your frontend URL)
                .AllowAnyMethod()
                .AllowAnyHeader();
        });
});
builder.Services.AddSingleton<IMongoClient>(sp =>
{
    var connectionString = "mongodb+srv://amine:Amine*20319318@amine.qukftes.mongodb.net/?retryWrites=true&w=majority&appName=Amine";
    var client = new MongoClient(connectionString);

    // Test the connection by attempting to retrieve a database list
    try
    {
        // Attempt to fetch the database names
        var databases = client.ListDatabaseNames().ToList();
        Console.WriteLine("Connected to MongoDB. Databases: " + string.Join(", ", databases));
    }
    catch (Exception ex)
    {
        // Log the error if connection fails
        Console.WriteLine("Failed to connect to MongoDB: " + ex.Message);
    }

    return client;
});

// Define your MongoDB Database
builder.Services.AddSingleton(sp =>
{
    var client = sp.GetRequiredService<IMongoClient>();
    return client.GetDatabase("taxi");
});

// Add Hot Chocolate GraphQL Server
builder.Services
    .AddGraphQLServer()
    .AddQueryType<Query>()
    .AddMutationType<Mutation>()
    .AddMongoDbFiltering()
    .AddMongoDbSorting()
    .AddMongoDbProjections()
    .BindRuntimeType<DateTime, HotChocolate.Types.DateTimeType>();

var app = builder.Build();
app.UseCors("AllowAll");

// Configure the HTTP request pipeline
app.UseRouting();

app.UseEndpoints(endpoints =>
{
    endpoints.MapGraphQL();
});

app.Run();
