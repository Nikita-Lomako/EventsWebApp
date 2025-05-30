using EventsWebApp.Core.Models;
using System;

namespace EventsWebApp.Core.IRepositories
{
    public interface IParticipantRepository
    {
        Task<ICollection<Participant>> GetAllAsync();
        Task<Participant?> GetAsync(int id);
        Task<ICollection<Participant>> GetByEventIdAsync(int eventId);
        Task<ICollection<Participant>> GetByUserIdAsync(string userId);
        Task CreateAsync(Participant participant);
        Task RemoveAsync(Participant participant);
        Task SaveAsync();
        Task<bool> ExistsAsync(int id);
        Task<bool> IsUserRegisteredForEventAsync(string userId, int eventId);
    }
} 