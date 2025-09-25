namespace Server.Models
{
    public class CheckoutItemDto
    {
        public string? Name { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
    }
}
