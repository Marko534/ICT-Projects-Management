# Change Request

## **Change Request 1**

**Change Request ID:** CR-001  
**Date:** 2025-05-04  
**Requested By:** Marko Ilioski  
**Priority:** Medium  

### **Description Of Change:**

Add a feature for students to bookmark or save specific flashcards for later review.  

### **Reason For Change:**

Enhances student usability by allowing them to focus on challenging material and revisit it efficiently.  

### **Impact On Current System:**

- Requires a new database field to track bookmarked flashcards per user.  
- UI updates to include a "Bookmark" button on flashcards.  

### **Updated Functional Requirement:**

**New Requirement:**  
13. The system shall allow students to bookmark flashcards for later review, with a dedicated view to access all bookmarked flashcards.  

---

## **Change Request 2**

**Change Request ID:** CR-002  
**Date:** 2025-05-04  
**Requested By:** Marko Ilioski  
**Priority:** High  

### **Description Of Change:**

Add a time limit option for quizzes created by teachers.  

### **Reason For Change:**

Simulates exam conditions and improves assessment flexibility for teachers.  

### **Impact On Current System:**

- Quiz creation UI must include a time limit setting (e.g., minutes/seconds).  
- Backend logic to enforce time limits and auto-submit quizzes.  

### **Updated Functional Requirement:**

**New Requirement:**  
14. The system shall allow teachers to set a time limit for quizzes, after which the quiz auto-submits with answers provided up to that point.  

---

## **Change Request 3**

**Change Request ID:** CR-003  
**Date:** 2025-05-04  
**Requested By:** Marko Ilioski  
**Priority:** Low  

### **Description Of Change:**

Add a "dark mode" toggle for user accessibility.  

### **Reason For Change:**

Improves accessibility and reduces eye strain for users.  

### **Impact On Current System:**

- Frontend theme logic to switch between light/dark modes.  
- User preference storage in the database.  

### **Updated Functional Requirement:**

**New Requirement:**  
15. The system shall provide a dark mode option, with user preferences saved across sessions.  