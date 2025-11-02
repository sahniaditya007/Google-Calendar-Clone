# Quick Start Guide

## Initial Setup (First Time Only)

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Initialize database**
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open browser**
   - Visit `http://localhost:3000`

## Daily Development

Just run:
```bash
npm run dev
```

## Database Management

- **View/edit data**: `npm run prisma:studio`
- **Reset database**: Delete `prisma/dev.db` and run `npm run prisma:migrate`

## Testing the Application

1. **Create an event**: Click "Create" button or click on any date
2. **Edit an event**: Click on any event in the calendar
3. **Navigate**: Use arrow buttons or "Today" button
4. **Switch views**: Use Month/Week/Day tabs
5. **Delete event**: Open event and click "Delete"

## Troubleshooting

**Database not found?**
- Run `npm run prisma:migrate` to create it

**Prisma Client errors?**
- Run `npm run prisma:generate`

**Port already in use?**
- Change port: `PORT=3001 npm run dev`

