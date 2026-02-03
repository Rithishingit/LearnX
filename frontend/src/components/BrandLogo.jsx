import React from 'react';

/**
 * LearnX brand lockup (icon + optional wordmark).
 * - theme="light" matches the light navbar (dark text)
 * - theme="dark" matches dark sections like the homepage footer (white text)
 */
const BrandLogo = ({
  showWordmark = true,
  theme = 'light',
  iconSize = 40,
  className = '',
  wordmarkClassName = '',
  iconWrapClassName = '',
}) => {
  const xTextClass = theme === 'dark' ? 'text-white' : 'text-gray-900';

  return (
    <div className={`flex items-center gap-3 ${className}`.trim()}>
      <div
        className={
          `relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl shadow-lg transition-all overflow-hidden ${iconWrapClassName}`.trim()
        }
        style={{ width: iconSize, height: iconSize }}
        aria-hidden="true"
      >
        {/* Stylish L */}
        <svg viewBox="0 0 40 40" className="w-full h-full">
          <defs>
            <linearGradient id="learnxLGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="100%" stopColor="#e0e7ff" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          <path
            d="M12 8 L12 26 Q12 30 16 30 L28 30"
            stroke="url(#learnxLGradient)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <circle cx="28" cy="12" r="3" fill="url(#learnxLGradient)" opacity="0.85" />
        </svg>
      </div>

      {showWordmark && (
        <div className={`flex items-baseline gap-0.5 ${wordmarkClassName}`.trim()}>
          <span className="text-2xl font-black bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-tight">
            Learn
          </span>
          <span className={`text-2xl font-black tracking-tight ${xTextClass}`}>X</span>
        </div>
      )}
    </div>
  );
};

export default BrandLogo;
