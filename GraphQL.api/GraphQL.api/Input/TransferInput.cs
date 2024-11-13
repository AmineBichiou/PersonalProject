namespace GraphQL.api.Input
{

    public class TransferInput
    {
        public string from { get; set; }
        public string to { get; set; }
        public DateTime dateTime { get; set; }
        public bool isCompleted { get; set; }
        public bool status { get; set; }
        public string options { get; set; }
        public ClientInput Client { get; set; }
    }
}
