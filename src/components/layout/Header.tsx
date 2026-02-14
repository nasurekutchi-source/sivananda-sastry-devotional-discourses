'use client';

// Header no longer needed - brand and search are in sidebar.
// Keeping file as empty component for compatibility.
interface HeaderProps {
  onMenuToggle: () => void;
}

export function Header({ onMenuToggle: _onMenuToggle }: HeaderProps) {
  return null;
}
