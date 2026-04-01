## ADDED Requirements

### Requirement: Accurate streak calculation
The enrollment stats API SHALL calculate the learning streak as consecutive days where the user completed at least one lesson, counting backwards from today.

#### Scenario: User with 3 consecutive days of activity
- **WHEN** the user completed lessons on today, yesterday, and the day before
- **THEN** the streak value is 3

#### Scenario: User with no lesson progress
- **WHEN** the user has no LessonProgress records
- **THEN** the streak value is 0 (not NaN or undefined)

### Requirement: Weekly hours based on actual activity
The enrollment stats API SHALL compute weekly learning hours from actual `LessonProgress.completedAt` timestamps grouped by day of the current week.

#### Scenario: User completed lessons on Monday and Wednesday
- **WHEN** the user completed 2 lessons (30min each) on Monday and 1 lesson (45min) on Wednesday
- **THEN** weeklyHours returns `[{day:"Lun", hours:1}, {day:"Mar", hours:0}, {day:"Mer", hours:0.75}, ...]`

### Requirement: Skill radar groups by formation category
The enrollment stats API SHALL group skills by formation category name (not by level), computing average progress per category.

#### Scenario: User enrolled in 2 "Développement Web" and 1 "Design" formations
- **WHEN** the API computes skillRadar
- **THEN** it returns `[{category:"Développement Web", value:65}, {category:"Design", value:40}]`

### Requirement: Weekly goal progress based on actual hours
The weekly goal progress SHALL be computed as `(actual hours this week / goal hours) * 100` with a default goal of 5 hours.

#### Scenario: User studied 3 hours this week
- **WHEN** the default goal is 5 hours and user studied 3 hours
- **THEN** weeklyGoalProgress is 60
