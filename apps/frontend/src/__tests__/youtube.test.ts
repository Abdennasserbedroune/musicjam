import { extractYouTubeVideoId, isValidYouTubeUrl } from '@/utils/youtube';

describe('YouTube Utils', () => {
  describe('extractYouTubeVideoId', () => {
    it('should extract video ID from watch URL', () => {
      const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
      expect(extractYouTubeVideoId(url)).toBe('dQw4w9WgXcQ');
    });

    it('should extract video ID from short URL', () => {
      const url = 'https://youtu.be/dQw4w9WgXcQ';
      expect(extractYouTubeVideoId(url)).toBe('dQw4w9WgXcQ');
    });

    it('should extract video ID from embed URL', () => {
      const url = 'https://www.youtube.com/embed/dQw4w9WgXcQ';
      expect(extractYouTubeVideoId(url)).toBe('dQw4w9WgXcQ');
    });

    it('should extract video ID from v/ URL', () => {
      const url = 'https://www.youtube.com/v/dQw4w9WgXcQ';
      expect(extractYouTubeVideoId(url)).toBe('dQw4w9WgXcQ');
    });

    it('should return null for invalid URL', () => {
      const url = 'https://example.com/video';
      expect(extractYouTubeVideoId(url)).toBeNull();
    });

    it('should return null for empty string', () => {
      expect(extractYouTubeVideoId('')).toBeNull();
    });
  });

  describe('isValidYouTubeUrl', () => {
    it('should return true for valid YouTube URLs', () => {
      expect(
        isValidYouTubeUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
      ).toBe(true);
      expect(isValidYouTubeUrl('https://youtu.be/dQw4w9WgXcQ')).toBe(true);
    });

    it('should return false for invalid URLs', () => {
      expect(isValidYouTubeUrl('https://example.com')).toBe(false);
      expect(isValidYouTubeUrl('')).toBe(false);
    });
  });
});
