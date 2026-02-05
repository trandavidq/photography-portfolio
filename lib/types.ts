// TypeScript interfaces for the photography website

export interface Gallery {
  id: string;
  title: string;
  year: number;
  location: string;
  coverImageId: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Image {
  id: string;
  galleryId: string;
  originalUrl: string;
  optimizedUrl: string;
  thumbnailUrl: string;
  caption?: string;
  width: number;
  height: number;
  sortOrder: number;
  createdAt: string;
}

export interface AuthSession {
  email: string;
  code: string;
  attempts: number;
  createdAt: string;
  expiresAt: number;
}

export interface SessionData {
  isAuthenticated: boolean;
  email: string;
  loginTime: number;
}

export interface UploadedImage {
  id: string;
  originalUrl: string;
  optimizedUrl: string;
  thumbnailUrl: string;
  width: number;
  height: number;
}
