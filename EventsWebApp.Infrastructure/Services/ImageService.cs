using EventsWebApp.Core.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using System.Net.Http;
using System.Net.Http.Headers;

namespace EventsWebApp.Infrastructure.Services
{
    public class ImageService : IImageService
    {
        private readonly IHostEnvironment _environment;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly string[] _allowedExtensions = { ".jpg", ".jpeg", ".png", ".gif" };

        public ImageService(IHostEnvironment environment, IHttpClientFactory httpClientFactory)
        {
            _environment = environment;
            _httpClientFactory = httpClientFactory;
        }

        public async Task<string> SaveImageFromUrlAsync(string imageUrl)
        {
            if (string.IsNullOrEmpty(imageUrl))
                return string.Empty;

            if (!IsValidImageUrl(imageUrl))
                throw new ArgumentException("Invalid image URL");

            var extension = Path.GetExtension(imageUrl).ToLowerInvariant();
            if (!_allowedExtensions.Contains(extension))
                throw new ArgumentException("Invalid file type. Only .jpg, .jpeg, .png, and .gif files are allowed.");

            var fileName = $"{Guid.NewGuid()}{extension}";
            var uploadsFolder = Path.Combine(_environment.ContentRootPath, "uploads");
            
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var client = _httpClientFactory.CreateClient())
            {
                var response = await client.GetAsync(imageUrl);
                response.EnsureSuccessStatusCode();

                using (var stream = await response.Content.ReadAsStreamAsync())
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await stream.CopyToAsync(fileStream);
                }
            }

            return $"/uploads/{fileName}";
        }

        public bool IsValidImageUrl(string url)
        {
            if (string.IsNullOrEmpty(url))
                return false;

            return Uri.TryCreate(url, UriKind.Absolute, out var uriResult)
                && (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps)
                && _allowedExtensions.Contains(Path.GetExtension(uriResult.AbsolutePath).ToLowerInvariant());
        }
    }
} 