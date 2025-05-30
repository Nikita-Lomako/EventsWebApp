using EventsWebApp.Core.IRepositories;
using EventsWebApp.Core.Models;
using EventsWebApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace EventsWebApp.Infrastructure.Repositories
{
    public class ParticipantRepository : IParticipantRepository
    {
        private readonly AppDbContext _db;

        public ParticipantRepository(AppDbContext db)
        {
            _db = db;
        }

        public async Task<IEnumerable<Participant>> GetAllAsync()
        {
            return await _db.Participants
                .Include(p => p.Event)
                .ToListAsync();
        }

        public async Task<Participant?> GetByIdAsync(int id)
        {
            return await _db.Participants
                .Include(p => p.Event)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<IEnumerable<Participant>> GetByEventIdAsync(int eventId)
        {
            return await _db.Participants
                .Include(p => p.Event)
                .Where(p => p.EventId == eventId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Participant>> GetByUserIdAsync(string userId)
        {
            return await _db.Participants
                .Include(p => p.Event)
                .Where(p => p.UserId == userId)
                .ToListAsync();
        }

        public async Task<Participant> CreateAsync(Participant entity)
        {
            await _db.Participants.AddAsync(entity);
            await _db.SaveChangesAsync();
            return entity;
        }

        public async Task RemoveAsync(Participant entity)
        {
            _db.Participants.Remove(entity);
            await _db.SaveChangesAsync();
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _db.Participants.AnyAsync(p => p.Id == id);
        }

        public async Task<bool> IsUserRegisteredForEventAsync(string userId, int eventId)
        {
            return await _db.Participants
                .AnyAsync(p => p.UserId == userId && p.EventId == eventId);
        }
    }
} 