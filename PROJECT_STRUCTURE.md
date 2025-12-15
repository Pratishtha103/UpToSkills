# UpToSkills Project Structure

This document outlines the folder structure of the UpToSkills project.

├───.gitignore
├───components.json
├───config-overrides.js
├───debug_enrollment.js
├───eslint.config.js
├───package-lock.json
├───package.json
├───postcss.config.js
├───README.md
├───tailwind.config.js
├───.git\
├───backend\
│   ├───addCandidateIdToInterviews.js
│   ├───addColumn.js
│   ├───db.js
│   ├───package-lock.json
│   ├───package.json
│   ├───server.js
│   ├───test-db.js
│   ├───config\
│   │   └───database.js
│   ├───controllers\
│   │   ├───companies.controller.js
│   │   ├───companyProfiles.controller.js
│   │   ├───coursesController.js
│   │   ├───enrollment.controller.js
│   │   ├───form.controller.js
│   │   ├───notifications.controller.js
│   │   ├───programs.controller.js
│   │   ├───skillBadges.controller.js
│   │   ├───stats.controller.js
│   │   └───students.controller.js
│   ├───middleware\
│   │   ├───auth.js
│   │   └───upload.js
│   ├───node_modules\
│   ├───routes\
│   │   ├───addproject.js
│   │   ├───assignedPrograms.js
│   │   ├───auth.js
│   │   ├───companies.route.js
│   │   ├───companyProfiles.route.js
│   │   ├───courses.route.js
│   │   ├───debugRoutes.js
│   │   ├───enrollmentRoutes.js
│   │   ├───enrollments.js
│   │   ├───forgotPassword.js
│   │   ├───formRoutes.js
│   │   ├───interviews.js
│   │   ├───mentor_projects.js
│   │   ├───mentorReviews.js
│   │   ├───mentors.js
│   │   ├───notifications.js
│   │   ├───projects.js
│   │   ├───searchcompanies.js
│   │   ├───searchproject.js
│   │   ├───searchStudents.js
│   │   ├───skillBadges.js
│   │   ├───stats.js
│   │   ├───studentProjects.js
│   │   ├───students.js
│   │   ├───testEnrollment.js
│   │   ├───testimonials.js
│   │   └───userProfile.js
│   ├───scripts\
│   │   ├───backfillCandidateId.js
│   │   ├───initDB.js
│   │   └───scripts.js
│   ├───uploads\
│   └───utils\
│       ├───ensureAdminBootstrap.js
│       ├───ensureNotificationsTable.js
│       ├───ensureProgramAssignmentsTable.js
│       └───notificationService.js
├───build\
├───node_modules\
├───public\
│   ├───contact-illustration.png
│   ├───favicon.png
│   ├───image3.png
│   ├───index.html
│   └───uptoskills_logo.png
└───src\
    ├───App.css
    ├───App.jsx
    ├───index.css
    ├───index.js
    ├───assets\
    │   ├───bgc.jpeg
    │   ├───boy2.png
    │   ├───buisness.jpeg
    │   ├───community2.png
    │   ├───darkLogo.jpg
    │   ├───her0Section.jpeg
    │   ├───hero.jpg
    │   ├───login-new.jpg
    │   ├───loginnew.jpg
    │   ├───logo.png
    │   └───mentor_illustration.png
    ├───components\
    │   ├───AboutPage\
    │   │   ├───AboutSection.jsx
    │   │   ├───Footer.jsx
    │   │   ├───Header.jsx
    │   │   ├───HeroSection.jsx
    │   │   ├───ProgramsSection.jsx
    │   │   └───Testimonials.jsx
    │   ├───AdminPanelDashboard\
    │   │   ├───AdminNavbar.jsx
    │   │   ├───AdminNotifications.jsx
    │   │   ├───AdminSidebar.jsx
    │   │   ├───Analytics.jsx
    │   │   ├───AssignedPrograms.jsx
    │   │   ├───Card.jsx
    │   │   ├───CompaniesTable.jsx
    │   │   ├───Company.jsx
    │   │   ├───CoursesTable.jsx
    │   │   ├───DashboardMain.jsx
    │   │   ├───MentorReview.jsx
    │   │   ├───Mentors.jsx
    │   │   ├───MentorsTable.jsx
    │   │   ├───Programs.jsx
    │   │   ├───ProgramsAdmin.jsx
    │   │   ├───Project.jsx
    │   │   ├───Students.jsx
    │   │   ├───StudentsTable.jsx
    │   │   └───Testimonials.jsx
    │   ├───Company_Dashboard\
    │   │   ├───ui\
    │   │   │   ├───accordion.jsx
    │   │   │   ├───alert-dialog.jsx
    │   │   │   ├───alert.jsx
    │   │   │   ├───aspect-ratio.jsx
    │   │   │   ├───avatar.jsx
    │   │   │   ├───badge.jsx
    │   │   │   ├───breadcrumb.jsx
    │   │   │   ├───button.jsx
    │   │   │   ├───calendar.jsx
    │   │   │   ├───card.jsx
    │   │   │   ├───carousel.jsx
    │   │   │   ├───chart.jsx
    │   │   │   ├───checkbox.jsx
    │   │   │   ├───collapsible.jsx
    │   │   │   ├───command.jsx
    │   │   │   ├───context-menu.jsx
    │   │   │   ├───dialog.jsx
    │   │   │   ├───drawer.jsx
    │   │   │   ├───dropdown-menu.jsx
    │   │   │   ├───form.jsx
    │   │   │   ├───hover-card.jsx
    │   │   │   ├───input-otp.jsx
    │   │   │   ├───input.jsx
    │   │   │   ├───label.jsx
    │   │   │   ├───menubar.jsx
    │   │   │   ├───navigation-menu.jsx
    │   │   │   ├───pagination.jsx
    │   │   │   ├───popover.jsx
    │   │   │   ├───progress.jsx
    │   │   │   ├───radio-group.jsx
    │   │   │   ├───resizable.jsx
    │   │   │   ├───scroll-area.jsx
    │   │   │   ├───select.jsx
    │   │   │   ├───separator.jsx
    │   │   │   ├───sheet.jsx
    │   │   │   ├───sidebar.jsx
    │   │   │   ├───skeleton.jsx
    │   │   │   ├───slider.jsx
    │   │   │   ├───sonner.jsx
    │   │   │   ├───switch.jsx
    │   │   │   ├───table.jsx
    │   │   │   ├───tabs.jsx
    │   │   │   ├───textarea.jsx
    │   │   │   ├───toast.jsx
    │   │   │   ├───toaster.jsx
    │   │   │   ├───toggle-group.jsx
    │   │   │   ├───toggle.jsx
    │   │   │   ├───tooltip.jsx
    │   │   │   └───use-toast.js
    │   │   ├───3DHiringAnimation.jsx
    │   │   ├───AboutCompanyPage.jsx
    │   │   ├───CompanyNotificationsPage.jsx
    │   │   ├───companyProfilePage.jsx
    │   │   ├───ContactModal.jsx
    │   │   ├───EditProfile.jsx
    │   │   ├───InterviewGallery.jsx
    │   │   ├───InterviewsSection.jsx
    │   │   ├───Navbar.jsx
    │   │   ├───SearchFilters.jsx
    │   │   ├───SearchStudents.jsx
    │   │   ├───Sidebar.jsx
    │   │   ├───StatCard.jsx
    │   │   ├───StudentCard.jsx
    │   │   └───StudentProfileModal.jsx
    │   ├───Contact_Page\
    │   │   ├───Chatbot.jsx
    │   │   ├───Contact.jsx
    │   │   ├───Faq.jsx
    │   │   ├───Footer.jsx
    │   │   ├───Header.jsx
    │   │   └───InputField.jsx
    │   ├───MentorDashboard\
    │   │   ├───components\
    │   │   │   ├───SkillBadges\
    │   │   │   │   ├───SkillBadgeForm.css
    │   │   │   │   └───SkillBadgeForm.jsx
    │   │   │   ├───DashboardCard.jsx
    │   │   │   ├───DomainsOfInterest.jsx
    │   │   │   ├───Footer.jsx
    │   │   │   ├───Header.jsx
    │   │   │   ├───MentorDashboardLayout.jsx
    │   │   │   ├───MentorEditProfilePage.jsx
    │   │   │   ├───MentorProfilePage.jsx
    │   │   │   ├───NotificationsPanel.jsx
    │   │   │   ├───Sidebar.jsx
    │   │   │   ├───StudentProfileForm.jsx
    │   │   │   └───Welcome.jsx
    │   │   └───pages\
    │   │       ├───NotificationsPage\
    │   │       │   ├───NotificationPage.css
    │   │       │   └───NotificationsPage.jsx
    │   │       ├───AboutUs.jsx
    │   │       ├───AssignedPrograms.jsx
    │   │       ├───Feedback.jsx
    │   │       ├───MentorDashboardPage.jsx
    │   │       ├───MentorTracking.jsx
    │   │       ├───MultiStudent.jsx
    │   │       ├───OpenSourceContributions.jsx
    │   │       └───ProjectsProgress.jsx
    │   ├───Notifications\
    │   │   ├───NotificationCenter.jsx
    │   │   └───NotificationDrawer.jsx
    │   ├───Programs\
    │   │   ├───Cloudcompute.jsx
    │   │   ├───CoursesList.jsx
    │   │   ├───Cybersecurity.jsx
    │   │   ├───Datascience.jsx
    │   │   ├───Loading.css
    │   │   ├───Thankyou.jsx
    │   │   └───Webdev.jsx
    │   ├───Project_Showcase\
    │   │   ├───Footer.jsx
    │   │   ├───ProjectCard.jsx
    │   │   ├───ProjectModal.jsx
    │   │   ├───ProjectShowcase.jsx
    │   │   └───Sidebar.jsx
    │   ├───Student_Dashboard\
    │   │   ├───dashboard\
    │   │   │   ├───AboutUs.jsx
    │   │   │   ├───AssignmentsSection.jsx
    │   │   │   ├───BottomProfileMessages.jsx
    │   │   │   ├───CalendarWidget.jsx
    │   │   │   ├───ChartSection.jsx
    │   │   │   ├───Dashboard_Project.jsx
    │   │   │   ├───Footer.jsx
    │   │   │   ├───Header.jsx
    │   │   │   ├───MyCourses.jsx
    │   │   │   ├───MyPrograms.jsx
    │   │   │   ├───NoticeBoard.jsx
    │   │   │   ├───Sidebar.jsx
    │   │   │   ├───StatsGrid.jsx
    │   │   │   └───WelcomeSection.jsx
    │   │   ├───EditProfile\
    │   │   │   ├───BasicInformation.jsx
    │   │   │   ├───ContactInformation.jsx
    │   │   │   ├───DomainsOfInterest.jsx
    │   │   │   ├───EditProfilePage.jsx
    │   │   │   ├───FormActions.jsx
    │   │   │   ├───FormContent.jsx
    │   │   │   ├───FormHeader.jsx
    │   │   │   ├───ProfessionalDetails.jsx
    │   │   │   ├───Resume.jsx
    │   │   │   ├───Skills.jsx
    │   │   │   └───StudentProfileForm.jsx
    │   │   ├───myProjects\
    │   │   │   ├───AddProject.jsx
    │   │   │   ├───MyProjects.jsx
    │   │   │   └───ProjectSubmissionForm.jsx
    │   │   ├───NotificationsPage\
    │   │   │   ├───NotificationPage.css
    │   │   │   └───NotificationsPage.jsx
    │   │   ├───Skilledpage\
    │   │   │   ├───AchievementCard.jsx
    │   │   │   └───StudentSkillBadgesPage.jsx
    │   │   ├───student_dashboard.css
    │   │   └───UserProfilePage.jsx
    │   └───ProtectedRoute.jsx
    ├───context\
    │   └───ThemeContext.jsx
    ├───hooks\
    │   ├───use-mobile.jsx
    │   ├───use-toast.js
    │   ├───useRealtimeNotifications.js
    │   └───useSubmitContactForm.js
    ├───lib\
    │   └───utils.js
    └───pages\
        ├───AdminPanel.jsx
        ├───ContactPage.jsx
        ├───ForgotPassword.jsx
        ├───Index.jsx
        ├───Landing.jsx
        ├───Login.jsx
        ├───MentorDashboardRoutes.jsx
        ├───NotFound.jsx
        ├───ProgramsPage.jsx
        ├───ProjectShowcasePage.jsx
        ├───Register.jsx
        ├───Student_Dashboard.jsx
        └───Unauthorized.jsx

