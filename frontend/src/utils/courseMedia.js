// Helpers to keep course thumbnails consistent across the app.
// We handle:
// - empty thumbnail values
// - the old default "no-photo.jpg" value
// - relative filenames (assumed to live under backend /uploads)
// - broken images (onError fallback)

const DEFAULT_FALLBACK =
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60';

const FALLBACKS_BY_CATEGORY = {
  'Technology & IT':
    'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=800&auto=format&fit=crop&q=60',
  'Business & Management':
    'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&auto=format&fit=crop&q=60',
  'Creative & Design':
    'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800&auto=format&fit=crop&q=60',
  'Health & Wellness':
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=60',
  'Personal Development':
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=60',
  'Science & Research':
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=60',
};

export function getFallbackThumbnail(course) {
  const byCategory = course?.category ? FALLBACKS_BY_CATEGORY[course.category] : null;
  return byCategory || DEFAULT_FALLBACK;
}

function getBackendOrigin() {
  // VITE_API_URL defaults to http://localhost:5000/api (see services/api.js)
  const apiUrl = import.meta?.env?.VITE_API_URL || 'http://localhost:5000/api';
  return apiUrl.replace(/\/api\/?$/i, '');
}

export function resolveCourseThumbnail(course) {
  const raw = course?.thumbnail;

  if (!raw || typeof raw !== 'string') return getFallbackThumbnail(course);

  const thumbnail = raw.trim();
  if (!thumbnail || thumbnail.toLowerCase() === 'no-photo.jpg') {
    return getFallbackThumbnail(course);
  }

  if (/^https?:\/\//i.test(thumbnail)) return thumbnail;

  // If it's a relative path or filename, assume it's served from the backend.
  const origin = getBackendOrigin();
  const cleaned = thumbnail.replace(/^\/+/, '');
  return `${origin}/uploads/${cleaned}`;
}

export function applyThumbnailFallback(e, course) {
  // Prevent infinite loop if fallback also fails.
  e.currentTarget.onerror = null;
  e.currentTarget.src = getFallbackThumbnail(course);
}
