# Vibe~ App - File Map

A complete guide to all files in this project and what they do.

---

## 📁 Root Files

| File | Purpose |
|------|---------|
| `index.html` | Main HTML entry point |
| `vite.config.ts` | Vite build configuration |
| `tailwind.config.ts` | Tailwind CSS theme & design tokens |
| `eslint.config.js` | Code linting rules |

---

## 🎨 Styling

| File | Purpose |
|------|---------|
| `src/index.css` | **Main CSS file** - All colors, fonts, animations, gradients |
| `src/App.css` | Additional app-wide styles |

---

## 📄 Pages (Main Screens)

| File | What It Shows |
|------|---------------|
| `src/pages/Index.tsx` | **Home/Swipe Screen** - Main swiping interface |
| `src/pages/Chat.tsx` | **Individual Chat** - Message conversation view |
| `src/pages/Chats.tsx` | **Chat List** - All your conversations |
| `src/pages/Profile.tsx` | **Your Profile** - View/edit your profile |
| `src/pages/Settings.tsx` | **Settings** - All app settings & preferences |
| `src/pages/Confessions.tsx` | **Confessions** - Anonymous confessions feed |
| `src/pages/NotFound.tsx` | **404 Page** - Page not found |

---

## 🧩 Components (UI Pieces)

### Navigation & Layout
| File | Purpose |
|------|---------|
| `src/components/Header.tsx` | Top navigation bar with logo & icons |
| `src/components/BottomNav.tsx` | Bottom tab navigation |
| `src/components/NavLink.tsx` | Navigation link component |

### Profile & Cards
| File | Purpose |
|------|---------|
| `src/components/ProfileCard.tsx` | Large profile card (swipe view) |
| `src/components/ProfileBubble.tsx` | Small circular profile avatar |
| `src/components/ProfileModal.tsx` | Full profile detail popup |
| `src/components/ProfileBoostModal.tsx` | Boost your profile popup |
| `src/components/EditProfileModal.tsx` | Edit profile form popup |

### Chat Components
| File | Purpose |
|------|---------|
| `src/components/ChatListItem.tsx` | Single chat in the list |
| `src/components/ChatOptionsModal.tsx` | Chat menu (mute, block, etc.) |

### Swipe & Matching
| File | Purpose |
|------|---------|
| `src/components/SwipeActions.tsx` | Like/Dislike/SuperLike buttons |
| `src/components/MatchModal.tsx` | "It's a Match!" popup |
| `src/components/MoodMatchModal.tsx` | Match by mood feature |
| `src/components/SuperLikeModal.tsx` | Super like confirmation |

### Rewards & Premium
| File | Purpose |
|------|---------|
| `src/components/GemsBadge.tsx` | Gem counter display |
| `src/components/DailyRewardsModal.tsx` | Daily login rewards |
| `src/components/UnlockModal.tsx` | Unlock premium features |

### Other Modals
| File | Purpose |
|------|---------|
| `src/components/NotificationsModal.tsx` | Notifications list |
| `src/components/SafetyCenterModal.tsx` | Safety & privacy info |

### Effects
| File | Purpose |
|------|---------|
| `src/components/Confetti.tsx` | Celebration animation |

---

## 🎛️ UI Components (Shadcn/Radix)

Located in `src/components/ui/` - These are reusable UI building blocks:

| File | Purpose |
|------|---------|
| `button.tsx` | Button styles & variants |
| `card.tsx` | Card container |
| `dialog.tsx` | Modal/popup base |
| `drawer.tsx` | Bottom drawer |
| `input.tsx` | Text input field |
| `switch.tsx` | Toggle switch |
| `toast.tsx` | Toast notifications |
| `tabs.tsx` | Tab navigation |
| `avatar.tsx` | Profile image |
| `badge.tsx` | Small label/tag |
| `slider.tsx` | Range slider |
| `select.tsx` | Dropdown select |
| `checkbox.tsx` | Checkbox input |
| `progress.tsx` | Progress bar |
| `skeleton.tsx` | Loading placeholder |
| `scroll-area.tsx` | Scrollable container |
| `separator.tsx` | Divider line |
| `tooltip.tsx` | Hover tooltip |
| `dropdown-menu.tsx` | Dropdown menu |
| `popover.tsx` | Popup content |
| `accordion.tsx` | Expandable sections |
| `alert.tsx` | Alert message |
| `form.tsx` | Form wrapper |
| `label.tsx` | Form label |
| `textarea.tsx` | Multi-line input |

---

## 🧠 State Management (Contexts)

| File | Purpose |
|------|---------|
| `src/contexts/SettingsContext.tsx` | **App Settings** - Notifications, sounds, dark mode, privacy |
| `src/contexts/GemsContext.tsx` | **Gems & Rewards** - Currency, streaks, daily rewards |
| `src/contexts/ChatContext.tsx` | **Chat State** - Messages, matches |

---

## 📊 Data & Types

| File | Purpose |
|------|---------|
| `src/data/profiles.ts` | Sample profile data |
| `src/types/profile.ts` | TypeScript type definitions |

---

## 🔧 Utilities & Hooks

| File | Purpose |
|------|---------|
| `src/lib/utils.ts` | Helper functions (cn for classnames) |
| `src/lib/sounds.ts` | Sound effects manager |
| `src/hooks/use-mobile.tsx` | Detect mobile device |
| `src/hooks/use-toast.ts` | Toast notification hook |

---

## 🖼️ Assets

| File | Purpose |
|------|---------|
| `src/assets/profile-1.jpg` | Sample profile image 1 |
| `src/assets/profile-2.jpg` | Sample profile image 2 |
| `src/assets/profile-3.jpg` | Sample profile image 3 |
| `src/assets/profile-4.jpg` | Sample profile image 4 |
| `public/favicon.svg` | Browser tab icon |
| `public/robots.txt` | Search engine settings |

---

## 🚀 App Entry Points

| File | Purpose |
|------|---------|
| `src/main.tsx` | React app bootstrap |
| `src/App.tsx` | **Main App** - Routes & providers setup |

---

## 🎨 How to Change Things

### Change Colors/Theme
Edit `src/index.css` - Look for `:root` section

### Change a Screen
Edit files in `src/pages/`

### Change Navigation
Edit `src/components/BottomNav.tsx` or `src/components/Header.tsx`

### Change Settings Options
Edit `src/pages/Settings.tsx` and `src/contexts/SettingsContext.tsx`

### Add New Feature
1. Create component in `src/components/`
2. Add route in `src/App.tsx` if it's a new page
3. Add navigation link if needed
