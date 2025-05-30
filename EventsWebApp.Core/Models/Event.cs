using System.ComponentModel.DataAnnotations;

namespace EventsWebApp.Core.Models
{
    public class Event
    {
        public int Id { get; set; }
        
        [Required]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        public string Description { get; set; } = string.Empty;
        
        [Required]
        public DateTime DateTime { get; set; }
        
        [Required]
        public string Venue { get; set; } = string.Empty;
        
        [Required]
        public string Category { get; set; } = string.Empty;
        
        [Required]
        public int MaxParticipants { get; set; }
        
        public string? ImageUrl { get; set; }        
        
        public ICollection<Participant> Participants { get; set; } = new List<Participant>();
    }
} 