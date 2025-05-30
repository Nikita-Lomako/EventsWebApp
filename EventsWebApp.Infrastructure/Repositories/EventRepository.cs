using EventsWebApp.Core.IRepositories;
using EventsWebApp.Core.Models;
using EventsWebApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace EventsWebApp.Infrastructure.Repositories
{
    public class EventRepository : IEventRepository
    {
        private readonly AppDbContext _db;

        public EventRepository(AppDbContext db)
        {
            _db = db;
        }

        public async Task<IEnumerable<Event>> GetAllAsync()
        {
            return await _db.Events
                .Include(e => e.Participants)
                .ToListAsync();
        }

        public async Task<Event?> GetByIdAsync(int id)
        {
            return await _db.Events
                .Include(e => e.Participants)
                .FirstOrDefaultAsync(e => e.Id == id);
        }

        public async Task<Event?> GetByTitleAsync(string title)
        {
            return await _db.Events
                .Include(e => e.Participants)
                .FirstOrDefaultAsync(e => e.Title == title);
        }

        public async Task<IEnumerable<Event>> GetByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            return await _db.Events
                .Include(e => e.Participants)
                .Where(e => e.DateTime >= startDate && e.DateTime <= endDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Event>> GetByLocationAsync(string location)
        {
            return await _db.Events
                .Include(e => e.Participants)
                .Where(e => e.Venue.Contains(location))
                .ToListAsync();
        }

        public async Task<IEnumerable<Event>> GetByCategoryAsync(string category)
        {
            return await _db.Events
                .Include(e => e.Participants)
                .Where(e => e.Category == category)
                .ToListAsync();
        }

        public async Task<Event> CreateAsync(Event entity)
        {
            await _db.Events.AddAsync(entity);
            await _db.SaveChangesAsync();
            return entity;
        }

        public async Task<Event> UpdateAsync(Event entity)
        {
            _db.Events.Update(entity);
            await _db.SaveChangesAsync();
            return entity;
        }

        public async Task RemoveAsync(Event entity)
        {
            _db.Events.Remove(entity);
            await _db.SaveChangesAsync();
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _db.Events.AnyAsync(e => e.Id == id);
        }

        public async Task<int> GetParticipantsCountAsync(int eventId)
        {
            return await _db.Participants
                .CountAsync(p => p.EventId == eventId);
        }
    }
} 