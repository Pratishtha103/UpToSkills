# Design Document

## Overview

The student course enrollment feature implements a many-to-many relationship between students and courses using a junction table. This design enables students to enroll in multiple courses while allowing courses to have multiple enrolled students. The system integrates with the existing /programs route to handle enrollment requests.

## Architecture

The enrollment system follows the existing application architecture:

- **Database Layer**: New `enrollments` table with foreign key relationships
- **API Layer**: Integration with existing /programs route for enrollment processing
- **Data Validation**: Foreign key constraints and business logic validation

## Components and Interfaces

### Database Schema

**Enrollments Table Structure:**
```sql
CREATE TABLE enrollments (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  course_id INTEGER NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'active',
  UNIQUE(student_id, course_id)
);
```

**Key Design Decisions:**
- `id`: Auto-incrementing primary key for unique identification
- `student_id`: Foreign key to students table with CASCADE delete
- `course_id`: Foreign key to programs table (courses) with CASCADE delete  
- `enrolled_at`: Timestamp for enrollment tracking
- `status`: Enrollment status (active, completed, dropped, etc.)
- `UNIQUE(student_id, course_id)`: Prevents duplicate enrollments

### Integration Points

**Existing /programs Route Enhancement:**
- Extend current /programs endpoint to handle enrollment logic
- Validate student authentication before enrollment
- Process enrollment data alongside existing program application logic

**Database Integration:**
- Add enrollments table creation to `backend/scripts/initDB.js`
- Ensure proper table creation order (after students and programs tables)
- Include appropriate indexes for query performance

## Data Models

### Enrollment Model
```javascript
{
  id: number,
  student_id: number,
  course_id: number, 
  enrolled_at: timestamp,
  status: string
}
```

### Relationships
- **Student → Enrollments**: One-to-Many (student can have multiple enrollments)
- **Program → Enrollments**: One-to-Many (program can have multiple enrolled students)
- **Student ↔ Program**: Many-to-Many (through enrollments table)

## Error Handling

### Validation Errors
- **Invalid Student ID**: Return 400 with "Student not found" message
- **Invalid Course ID**: Return 400 with "Course not found" message  
- **Duplicate Enrollment**: Return 409 with "Student already enrolled" message
- **Database Constraint Violations**: Return 500 with generic error message

### Database Errors
- **Foreign Key Violations**: Handle gracefully with appropriate error messages
- **Connection Issues**: Implement retry logic and proper error responses
- **Transaction Failures**: Ensure rollback and consistent state

## Testing Strategy

### Database Testing
- Verify table creation and constraints
- Test foreign key relationships and cascade behavior
- Validate unique constraint enforcement

### API Testing  
- Test enrollment creation through /programs route
- Verify error handling for invalid data
- Test duplicate enrollment prevention

### Integration Testing
- End-to-end enrollment flow testing
- Database transaction integrity testing
- Error scenario validation