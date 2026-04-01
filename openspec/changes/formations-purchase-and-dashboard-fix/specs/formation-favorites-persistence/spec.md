## ADDED Requirements

### Requirement: FormationFavorite Prisma model
The database SHALL have a `FormationFavorite` model with `userId`, `formationId`, and `createdAt` fields, with a unique constraint on `(userId, formationId)`.

#### Scenario: Migration creates FormationFavorite table
- **WHEN** `prisma migrate dev` is run
- **THEN** the `FormationFavorite` table is created with proper indexes and foreign keys to `User` and `Formation`

### Requirement: Favorites API persists to database
The `GET/POST/DELETE /api/apprenant/favoris` endpoints SHALL read/write from the `FormationFavorite` Prisma model for authenticated users.

#### Scenario: Adding a favorite persists to database
- **WHEN** an authenticated user sends POST to `/api/apprenant/favoris` with `{ formationId }`
- **THEN** a `FormationFavorite` record is created and the response returns `{ success: true }`

#### Scenario: Removing a favorite deletes from database
- **WHEN** an authenticated user sends DELETE to `/api/apprenant/favoris` with `{ formationId }`
- **THEN** the `FormationFavorite` record is deleted and the response returns `{ success: true }`

#### Scenario: Listing favorites returns database records
- **WHEN** an authenticated user sends GET to `/api/apprenant/favoris`
- **THEN** the API returns an array of formationIds from `FormationFavorite` table

### Requirement: localStorage fallback for unauthenticated users
The favorites system SHALL continue using localStorage for users who are not logged in.

#### Scenario: Unauthenticated user adds favorite
- **WHEN** a non-logged-in user clicks the heart icon on a formation
- **THEN** the favorite is saved in localStorage only
