# STDISCM S12 - Enrollment System Demo

**Team Members**  
- DIMAGIBA, Rafael  
- GARCIA, Aurelio  
- PARK, Sehyun  
- SILLONA, Eugene  

---

## Demo Video Timestamp

- `0:00 ~ 05:23` → Application Demo  
- `05:23 ~ 10:38` → MVC Pattern and JWT Authentication in Code

---

## Project Setup Instructions

### Folder Relocation

Ensure that the `P4-VM` folder is placed inside your Virtual Machine environment.

### Requirements

- Local MySQL database instance running on port `3306`
- Credentials:
  - **Username:** `root`
  - **Password:** `root`
- Existing database schema: `enrollment`

### Manual Data Seeding

Populate your database manually with the following:

#### Users Table
- Input at least one **student** account
- Input at least one **faculty** account

#### Courses Table
- Manually input the list of available courses

---

## Application Architecture

### `backend/`  
Handles:
- JWT-based login authentication
- Viewing and enrolling in courses
- Viewing grades

### `grade-service/`  
Handles:
- Uploading of student grades

---

## How to Run

1. On your **Virtual Machine**, open the following folders:
   - `backend/`
   - `grade-service/`

2. Run `run.bat` inside each folder to start the services.

3. From your **main PC**, open the `P4-PC` folder.

4. Start the frontend app by launching `index.html`.

5. Input your login credentials on the login page and proceed to use the app.

---

## Notes

- Ensure that your local database is running before launching the services.
- Git LFS is used for large assets (e.g., demo videos). Make sure to install Git LFS if cloning the repo.

