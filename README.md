# Google Calendar Clone

A high-fidelity fullstack clone of Google Calendar built with Next.js, TypeScript, Prisma, and Tailwind CSS. This application replicates the core functionality of Google Calendar with smooth interactions, animations, and a visually consistent user experience.

## 🚀 Features

### Core Functionality
- **Multiple View Types**: Monthly, weekly, and daily calendar views
- **Event Management**: Create, edit, and delete events with full CRUD operations
- **Event Details**: Rich event information including title, description, location, time, and color coding
- **Interactive UI**: Click on dates to create events, click on events to edit them
- **Smooth Animations**: Modal transitions, hover effects, and smooth calendar navigation

### Advanced Features
- **Event Overlap Detection**: Detects overlapping events and handles display accordingly
- **Color Coding**: 8 predefined colors matching Google Calendar's palette
- **Responsive Design**: Works seamlessly across different screen sizes
- **Time Validation**: Ensures end times are always after start times
- **Database Persistence**: All events are stored in SQLite database using Prisma ORM

## 🏗️ Architecture

### Technology Stack

**Frontend:**
- **Next.js 14** - React framework with App Router for server-side rendering and routing
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework for styling
- **date-fns** - Modern date utility library for date manipulation
- **React Hooks** - State management and side effects

**Backend:**
- **Next.js API Routes** - Serverless API endpoints
- **Prisma ORM** - Type-safe database access
- **SQLite** - Lightweight relational database

### Project Structure

```
├── app/
│   ├── api/
│   │   └── events/
│   │       ├── route.ts          # GET, POST endpoints
│   │       └── [id]/route.ts     # GET, PUT, DELETE endpoints
│   ├── globals.css               # Global styles and animations
│   ├── layout.tsx                # Root layout with metadata
│   └── page.tsx                  # Main calendar page
├── components/
│   ├── Calendar.tsx              # Calendar component with all views
│   └── EventModal.tsx           # Event creation/editing modal
├── lib/
│   ├── prisma.ts                # Prisma client singleton
│   └── utils.ts                 # Utility functions for dates, overlaps, etc.
├── prisma/
│   └── schema.prisma            # Database schema
└── types/
    └── index.ts                 # TypeScript type definitions
```

## 📦 Setup and Installation

### Prerequisites

- Node.js 18+ and npm/yarn
- Git

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Scaler-Assigment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   # Generate Prisma Client
   npm run prisma:generate

   # Run database migrations
   npm run prisma:migrate
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open the application**
   - Navigate to `http://localhost:3000` in your browser

### Database Management

- **View database**: `npm run prisma:studio` (opens Prisma Studio at http://localhost:5555)
- **Reset database**: Delete `prisma/dev.db` and run `npm run prisma:migrate`

## 🎨 UI/UX Implementation

### Design Philosophy

The application follows Google Calendar's design language:
- **Color Palette**: Uses Google's Material Design colors
- **Typography**: Google Sans font family for consistency
- **Spacing**: Generous padding and margins matching Google Calendar
- **Interactions**: Hover states, transitions, and animations for smooth UX

### Animations and Transitions

1. **Modal Animations**
   - Fade-in backdrop (`fadeIn` animation)
   - Slide-up content (`slideUp` animation)
   - Smooth transitions using CSS animations

2. **Event Hover Effects**
   - Subtle lift on hover (`translateY(-1px)`)
   - Shadow enhancement for depth
   - Smooth color transitions

3. **Calendar Navigation**
   - Instant view switching with smooth date updates
   - Visual feedback on button clicks
   - Loading states during data fetching

### Interactive Elements

- **Date Cells**: Clickable cells that open event creation modal
- **Event Items**: Clickable events that open edit modal
- **Time Slots** (Week/Day view): Clickable time slots for quick event creation
- **Navigation Controls**: Previous/Next buttons with smooth transitions
- **View Switcher**: Tabs for switching between month/week/day views

## 💼 Business Logic

### Event Management

1. **Event Creation**
   - Validates required fields (title, start time, end time)
   - Ensures end time is after start time
   - Supports optional description and location
   - Allows color selection from predefined palette

2. **Event Updates**
   - Partial updates supported (only changed fields required)
   - Same validation as creation
   - Maintains event ID and timestamps

3. **Event Deletion**
   - Requires confirmation before deletion
   - Permanent deletion from database

### Edge Cases Handled

1. **Overlapping Events**
   - Detection algorithm groups events by day
   - Checks time overlaps within each day
   - Displays overlapping events appropriately in UI
   - Week/Day views show overlapping events side-by-side

2. **Time Validation**
   - Prevents events where end time ≤ start time
   - Handles timezone issues by using ISO strings
   - Validates date ranges for multi-day events

3. **Date Range Filtering**
   - Efficiently queries only relevant events for current view
   - Month view: Queries entire month
   - Week view: Queries 7-day range
   - Day view: Queries single day (00:00 - 23:59)

4. **Empty States**
   - Gracefully handles days/weeks with no events
   - Clean UI without breaking layout

5. **Multi-day Events**
   - Events spanning multiple days appear in all relevant day cells
   - Properly calculates duration and positioning

### Data Flow

1. **Fetching Events**
   - Client requests events for current view date range
   - API queries database with date filters
   - Results returned and displayed in calendar

2. **Creating Events**
   - Form submission validates data
   - API creates event in database
   - UI updates with new event (optimistic or refetch)

3. **Updating Events**
   - Edit modal pre-populates with event data
   - Changes validated before submission
   - Database updated, UI refreshed

## 🔧 API Endpoints

### `GET /api/events`
- **Query Parameters**: `start` (ISO date), `end` (ISO date)
- **Response**: Array of events within date range
- **Purpose**: Fetch events for calendar view

### `POST /api/events`
- **Body**: `{ title, description?, startTime, endTime, color?, location? }`
- **Response**: Created event object
- **Purpose**: Create new event

### `GET /api/events/[id]`
- **Response**: Single event object
- **Purpose**: Fetch specific event details

### `PUT /api/events/[id]`
- **Body**: Partial event object (only fields to update)
- **Response**: Updated event object
- **Purpose**: Update existing event

### `DELETE /api/events/[id]`
- **Response**: Success message
- **Purpose**: Delete event

## 🎯 Future Enhancements

### Short-term Improvements
1. **Recurring Events**
   - Daily, weekly, monthly, yearly recurrence patterns
   - Exception dates for recurring series
   - Edit single instance vs. entire series

2. **Event Reminders**
   - Email notifications
   - Browser notifications
   - Custom reminder times

3. **Event Sharing**
   - Share events with other users
   - Collaboration features
   - Permissions (view/edit)

4. **Search Functionality**
   - Search events by title, description, location
   - Filter by date range, color, etc.

5. **Export/Import**
   - Export to iCal format
   - Import from Google Calendar
   - CSV export for data analysis

### Long-term Enhancements
1. **Multi-user Support**
   - User authentication (NextAuth.js)
   - User profiles and preferences
   - Shared calendars

2. **Advanced Views**
   - Agenda view (list of upcoming events)
   - Year view
   - Custom date ranges

3. **Calendar Integration**
   - Sync with Google Calendar API
   - Outlook integration
   - Apple Calendar sync

4. **Mobile App**
   - React Native version
   - Push notifications
   - Offline support

5. **Performance Optimizations**
   - Virtual scrolling for large event lists
   - Event caching with React Query
   - Optimistic UI updates

6. **Accessibility**
   - ARIA labels and roles
   - Keyboard navigation
   - Screen reader support

7. **Internationalization**
   - Multi-language support
   - Timezone handling
   - Date format preferences

## 🐛 Known Limitations

- No user authentication (single-user system)
- SQLite database (not suitable for production at scale)
- No real-time synchronization
- Limited to single timezone
- No event attachments

## 📝 Development Notes

### Code Quality
- TypeScript for type safety
- ESLint for code linting
- Consistent code formatting
- Component-based architecture

### Testing Recommendations
- Unit tests for utility functions (date calculations, overlap detection)
- Integration tests for API endpoints
- E2E tests for user flows (create, edit, delete events)
- Visual regression tests for UI consistency

## 📄 License

This project is created as part of a coding assignment.

## 👨‍💻 Author

Built with attention to detail, focusing on creating a high-fidelity clone that closely matches Google Calendar's functionality and user experience.

---

**Note**: This application is built for demonstration purposes. For production use, consider implementing authentication, using a production-grade database (PostgreSQL), and adding proper error handling and logging.

