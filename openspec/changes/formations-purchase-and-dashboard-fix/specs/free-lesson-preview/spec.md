## ADDED Requirements

### Requirement: Free lessons are accessible without enrollment
The system SHALL allow unauthenticated or non-enrolled users to view lessons marked as `isFree: true` directly from the formation detail page.

#### Scenario: Unenrolled user clicks a free lesson
- **WHEN** user clicks on a lesson marked `isFree` in the curriculum section of the formation detail page
- **THEN** the system opens a lesson preview modal/page showing the lesson content (video, text, or audio) without requiring enrollment

#### Scenario: Unenrolled user clicks a paid lesson
- **WHEN** user clicks on a lesson NOT marked `isFree`
- **THEN** the system shows a paywall prompt asking the user to purchase the formation

### Requirement: Free lesson API endpoint
The system SHALL provide a `GET /api/formations/[id]/free-lesson/[lessonId]` endpoint that returns lesson content only if the lesson's `isFree` field is `true`.

#### Scenario: API returns content for free lesson
- **WHEN** a GET request is made with a valid formationId and lessonId where `isFree === true`
- **THEN** the API returns the lesson content (videoUrl, content, type, title, duration)

#### Scenario: API rejects request for paid lesson
- **WHEN** a GET request is made with a lessonId where `isFree === false`
- **THEN** the API returns 403 with error message "Cette leçon nécessite un achat"

### Requirement: Preview badge on free lessons
The formation detail page SHALL display a "Gratuit - Aperçu" badge on free lessons with a play icon, distinguishing them from locked lessons.

#### Scenario: Curriculum displays free lessons with preview affordance
- **WHEN** the formation detail page renders the curriculum for a non-enrolled user
- **THEN** free lessons show a clickable play icon and "Aperçu" badge, while paid lessons show a lock icon
