# Supabase Setup for Swiss BJJ

This document provides instructions for setting up the Supabase backend for the Swiss BJJ project.

## Project Setup

1. Sign up for a Supabase account at [https://supabase.com/](https://supabase.com/) if you don't have one.
2. Create a new project with a name like "swiss-bjj" and choose a strong database password.
3. After the project is created, navigate to the project dashboard.
4. Get your API keys from the Settings > API section. These keys are already set in your `.env.local` file.

## Database Schema

### Events Table

Create the "Event" table with the following columns:

| Column Name   | Type      | Default Value      | Primary Key | Not Null | Description               |
| ------------- | --------- | ------------------ | ----------- | -------- | ------------------------- |
| id            | uuid      | uuid_generate_v4() | Yes         | Yes      | Unique identifier         |
| name          | text      |                    | No          | Yes      | Event name                |
| organizer     | text      |                    | No          | Yes      | Event organizer           |
| registerUntil | date      |                    | No          | Yes      | Registration deadline     |
| eventLink     | text      |                    | No          | Yes      | Registration link         |
| logoUrl       | text      |                    | No          | No       | URL to event logo         |
| canton        | text      |                    | No          | Yes      | Swiss canton code         |
| address       | text      |                    | No          | Yes      | Event address             |
| type          | text      |                    | No          | Yes      | Event type                |
| startDate     | date      |                    | No          | Yes      | Event start date          |
| endDate       | date      |                    | No          | Yes      | Event end date            |
| startTime     | text      |                    | No          | Yes      | Event start time          |
| endTime       | text      |                    | No          | Yes      | Event end time            |
| created_at    | timestamp | now()              | No          | Yes      | Record creation timestamp |

#### SQL for Creating the Events Table

```sql
CREATE TABLE "Event" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  organizer TEXT NOT NULL,
  "registerUntil" DATE NOT NULL,
  "eventLink" TEXT NOT NULL,
  "logoUrl" TEXT,
  canton TEXT NOT NULL,
  address TEXT NOT NULL,
  type TEXT NOT NULL,
  "startDate" DATE NOT NULL,
  "endDate" DATE NOT NULL,
  "startTime" TEXT NOT NULL,
  "endTime" TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
```

### Type Validation with RLS Policies

To enforce validation on the `type` field, create an enum type and add a check constraint:

```sql
CREATE TYPE event_type AS ENUM ('competition', 'womens', 'kids', 'open-mat', 'seminar');
ALTER TABLE "Event" ADD CONSTRAINT event_type_check CHECK (type::event_type IN ('competition', 'womens', 'kids', 'open-mat', 'seminar'));
```

### Row Level Security Policies

Set up Row Level Security (RLS) to control who can perform operations on your data:

1. Enable RLS for the Event table:

```sql
ALTER TABLE "Event" ENABLE ROW LEVEL SECURITY;
```

2. Create policies for authenticated users to read, create, update, and delete events:

```sql
-- Allow anyone to read events
CREATE POLICY "Anyone can read events" ON "Event"
  FOR SELECT
  USING (true);

-- Only authenticated users can create, update, or delete events
CREATE POLICY "Authenticated users can create events" ON "Event"
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update events" ON "Event"
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete events" ON "Event"
  FOR DELETE
  TO authenticated
  USING (true);
```

## Authentication Setup

Since you'll only have one admin user, you can create this user through the Supabase dashboard:

1. Go to Authentication > Users in the Supabase dashboard.
2. Click "Add User" and enter the email and password for your admin user.

## Integration with Next.js

Your application already has the necessary configuration files and components:

1. `.env.local` file with your Supabase URL and anon key
2. `lib/supabase.ts` client configuration
3. Admin page with authentication
4. Event management pages

## Testing Your Setup

After completing the above steps:

1. Run your Next.js application
2. Navigate to `/admin` and log in with your admin credentials
3. Try creating a new event
4. View the events on the public page at `/events`

## Troubleshooting

If you encounter any issues:

1. Check the browser console for error messages
2. Verify your API keys in the `.env.local` file
3. Review the Supabase project settings
4. Ensure your database schema matches the expected structure in the application

For more information, refer to the [Supabase documentation](https://supabase.com/docs).
