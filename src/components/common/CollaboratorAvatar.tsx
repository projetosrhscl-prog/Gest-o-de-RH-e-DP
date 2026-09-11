import React, { useState } from 'react';

interface CollaboratorAvatarProps {
  photoUrl?: string | null;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'custom';
  className?: string;
  roundedClass?: string;
  showBorder?: boolean;
  alt?: string;
}

const SIZE_MAP = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
  '2xl': 'w-24 h-24 text-2xl',
  custom: ''
};

// Generates consistent elegant background gradients based on collaborator name
function getInitialsColor(name: string): string {
  const colors = [
    'from-blue-600 to-indigo-700 text-white',
    'from-emerald-600 to-teal-700 text-white',
    'from-violet-600 to-purple-700 text-white',
    'from-amber-600 to-orange-700 text-white',
    'from-rose-600 to-pink-700 text-white',
    'from-cyan-600 to-blue-700 text-white',
    'from-slate-700 to-slate-900 text-white',
    'from-teal-600 to-emerald-800 text-white'
  ];
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function getInitials(name: string): string {
  if (!name) return 'SC';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const CollaboratorAvatar: React.FC<CollaboratorAvatarProps> = ({
  photoUrl,
  name,
  size = 'md',
  className = '',
  roundedClass = 'rounded-xl',
  showBorder = true,
  alt
}) => {
  const [imageError, setImageError] = useState(false);
  const sizeClasses = SIZE_MAP[size];
  const initials = getInitials(name);
  const gradient = getInitialsColor(name);

  // If valid photo exists and didn't fail
  const hasPhoto = Boolean(photoUrl && !imageError);

  return (
    <div
      className={`relative shrink-0 overflow-hidden select-none ${roundedClass} ${sizeClasses} ${
        showBorder ? 'border border-slate-200 shadow-2xs' : ''
      } ${className}`}
    >
      {hasPhoto ? (
        <img
          src={photoUrl!}
          alt={alt || name}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
          loading="lazy"
        />
      ) : (
        <div
          className={`w-full h-full bg-linear-to-br ${gradient} flex items-center justify-center font-bold tracking-tight shadow-inner`}
        >
          <span>{initials}</span>
        </div>
      )}
    </div>
  );
};
