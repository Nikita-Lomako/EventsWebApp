using Microsoft.AspNetCore.Http;

namespace EventsWebApp.Core.Services
{
    public interface IImageService
    {
        Task<string> SaveImageFromUrlAsync(string imageUrl);
        bool IsValidImageUrl(string url);
    }
} 