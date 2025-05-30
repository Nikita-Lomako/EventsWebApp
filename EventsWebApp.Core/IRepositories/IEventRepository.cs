using EventsWebApp.Core.Models;

namespace EventsWebApp.Core.IRepositories
{
    public interface IEventRepository
    {
        Task<ICollection<Event>> GetAllAsync();
        Task<Event?> GetAsync(int id);
        Task<Event?> GetAsync(string title);
        Task<ICollection<Event>> GetByDateAsync(DateTime date);
        Task<ICollection<Event>> GetByLocationAsync(string location);
        Task<ICollection<Event>> GetByCategoryAsync(string category);
        Task CreateAsync(Event evt);
        Task UpdateAsync(Event evt);
        Task RemoveAsync(Event evt);
        Task SaveAsync();
        Task<bool> ExistsAsync(int id);
        Task<bool> ExistsAsync(string title);
        Task<int> GetParticipantsCountAsync(int eventId);
    }
} 