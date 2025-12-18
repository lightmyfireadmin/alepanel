# Login Page UI Mockup

## Visual Layout

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                     ◄ Back Button                       │
│                                                         │
│              ╔═══════════════════════════╗              │
│              ║                           ║              │
│              ║     [alecia Logo]         ║              │
│              ║                           ║              │
│              ║  🛡️  Administration        ║              │
│              ║                           ║              │
│              ║  Connectez-vous pour      ║              │
│              ║  accéder au tableau       ║              │
│              ║  de bord                  ║              │
│              ║                           ║              │
│              ║  ┌─────────────────────┐  ║              │
│              ║  │ Utilisateur         │  ║              │
│              ║  └─────────────────────┘  ║              │
│              ║  ┌─────────────────────┐  ║              │
│              ║  │ 👤 Christophe    ▼ │  ║  <- Dropdown │
│              ║  └─────────────────────┘  ║     with     │
│              ║                           ║    avatar    │
│              ║  ┌─────────────────────┐  ║              │
│              ║  │ Mot de passe        │  ║              │
│              ║  └─────────────────────┘  ║              │
│              ║  ┌─────────────────────┐  ║              │
│              ║  │ ••••••••            │  ║              │
│              ║  └─────────────────────┘  ║              │
│              ║                           ║              │
│              ║  ┌─────────────────────┐  ║              │
│              ║  │  Se connecter       │  ║              │
│              ║  └─────────────────────┘  ║              │
│              ║                           ║              │
│              ╚═══════════════════════════╝              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Dropdown Expanded View

```
┌─────────────────────────────────┐
│ Utilisateur                     │
└─────────────────────────────────┘
┌─────────────────────────────────┐
│ 👤 Christophe              ✓   │  <- Selected (with checkmark)
└─────────────────────────────────┘
```

## Key Features

### 1. User Dropdown
- **Component**: Radix UI Select component
- **Display**: Avatar (circular profile photo) + First name
- **Default**: "Christophe" is pre-selected
- **Avatar Source**: `/assets/Equipe_Alecia/CB_1_-_cropped_-_alt_p800.jpg`

### 2. Avatar Display
```tsx
<div className="flex items-center gap-3">
  <Avatar className="size-6">
    <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
    <AvatarFallback className="text-xs">
      {currentUser.name.charAt(0)}
    </AvatarFallback>
  </Avatar>
  <span>{currentUser.name}</span>
</div>
```

### 3. Dropdown Options
Each option in the dropdown shows:
- 24px × 24px circular avatar
- User's first name
- Check icon when selected

### 4. Form Behavior
```typescript
// When user submits form
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Get email from selected user
  const email = currentUser.email; // "christophe.berthon@alecia.fr"
  
  // Sign in with credentials
  const result = await signIn("credentials", {
    email,
    password,
    redirect: false,
  });
  
  // Handle result...
};
```

## Color Scheme
- Background: `var(--background)` with gradient decorations
- Card: `var(--card)` with `var(--border)` border
- Input fields: `var(--input)` background
- Text: `var(--foreground)` and `var(--foreground-muted)`
- Accent: `var(--accent)` for focus states and icons
- Button: `.btn-gold` class (golden styling)

## Responsive Design
- Full-screen background with centered card
- Max width: 28rem (448px)
- Padding: 1rem (16px) on mobile
- All elements scale appropriately

## Before vs After

### Before (Email Input)
```tsx
<Input
  id="email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="admin@alecia.fr"
  required
/>
```

### After (User Dropdown)
```tsx
<Select value={selectedUser} onValueChange={setSelectedUser}>
  <SelectTrigger>
    <SelectValue>
      <div className="flex items-center gap-3">
        <Avatar className="size-6">
          <AvatarImage src={currentUser.avatar} />
          <AvatarFallback>
            {currentUser.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <span>{currentUser.name}</span>
      </div>
    </SelectValue>
  </SelectTrigger>
  <SelectContent>
    {ADMIN_USERS.map((user) => (
      <SelectItem key={user.id} value={user.id}>
        <div className="flex items-center gap-3">
          <Avatar className="size-6">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span>{user.name}</span>
        </div>
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

## Implementation Notes

1. **User-Friendly**: First names are easier to recognize than email addresses
2. **Visual Recognition**: Avatars help identify users quickly
3. **Consistency**: Uses existing team page photos for avatars
4. **Security**: No change to authentication - password still required
5. **Extensible**: Easy to add more admin users to the dropdown
6. **Accessible**: Properly labeled select component with keyboard navigation
