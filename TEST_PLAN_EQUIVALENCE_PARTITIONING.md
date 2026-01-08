# AGRIPADI SYSTEM - TEST PLAN
## Equivalence Partitioning Test Design

**Project:** Agripadi - Agricultural Knowledge Management System
**Document Version:** 1.1
**Date:** 2026-01-06
**Prepared By:** System Documentation Team

---

## Table of Contents
1. [Introduction](#1-introduction)
2. [Test Strategy](#2-test-strategy)
3. [Authentication & Authorization Module](#3-authentication--authorization-module)
4. [User Management Module](#4-user-management-module)
5. [Admin Content Management Module](#5-admin-content-management-module)
6. [Farmer Features Module](#6-farmer-features-module)
7. [Email Notification System Module](#7-email-notification-system-module)
8. [Settings Module](#8-settings-module)
9. [Security & Middleware Module](#9-security--middleware-module)
10. [Test Data Requirements](#10-test-data-requirements)
11. [Test Environment Setup](#11-test-environment-setup)

---

## 1. Introduction

### 1.1 Purpose
This document outlines the test plan for the Agripadi system using Equivalence Partitioning (EP) technique. Equivalence Partitioning divides input data into valid and invalid partitions to ensure comprehensive test coverage while minimizing redundant test cases.

### 1.2 Scope
This test plan covers:
- Authentication and authorization
- User management (Admin and Farmer roles)
- Content management (Learning materials, Announcements, Virtual Tours)
- Community features (Forums, Comments, Likes)
- Reporting system
- Feedback system
- Email notification system
- User settings and preferences

### 1.3 System Overview
**Agripadi** is a web-based agricultural knowledge management system with two user roles:
- **Admin (role = 1):** Full system access, content management, moderation, email notifications management
- **Farmer (role = 2):** Limited access, content consumption, community participation, receives email notifications

---

## 2. Test Strategy

### 2.1 Equivalence Partitioning Approach
For each input field, we identify:
- **Valid Equivalence Classes:** Input values that should be accepted
- **Invalid Equivalence Classes:** Input values that should be rejected
- **Boundary Values:** Edge cases at partition boundaries

### 2.2 Test Case Structure
Each test case includes:
- **Test ID:** Unique identifier
- **Module:** Feature being tested
- **Input Class:** Equivalence partition
- **Test Data:** Sample input
- **Expected Result:** Expected system behavior
- **Priority:** High/Medium/Low

---

## 3. Authentication & Authorization Module

### 3.1 User Registration

#### 3.1.1 Name Field

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| REG-N-01 | Valid | Name with 1-255 characters | "John Doe" | Registration successful | High |
| REG-N-02 | Valid | Name with special characters | "María José O'Connor" | Registration successful | Medium |
| REG-N-03 | Valid | Name exactly 255 characters | "A" × 255 | Registration successful | Low |
| REG-N-04 | Invalid | Empty name | "" | Error: "The name field is required." | High |
| REG-N-05 | Invalid | Name > 255 characters | "A" × 256 | Error: "The name field must not be greater than 255 characters." | Medium |
| REG-N-06 | Invalid | Null value | null | Error: "The name field is required." | High |
| REG-N-07 | Boundary | Name with 1 character | "A" | Registration successful | Low |

#### 3.1.2 Email Field

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| REG-E-01 | Valid | Valid email format | "user@example.com" | Registration successful | High |
| REG-E-02 | Valid | Email with subdomain | "user@mail.example.com" | Registration successful | Medium |
| REG-E-03 | Valid | Email with + sign | "user+test@example.com" | Registration successful | Low |
| REG-E-04 | Valid | Email with numbers | "user123@example.com" | Registration successful | Medium |
| REG-E-05 | Invalid | Empty email | "" | Error: "The email field is required." | High |
| REG-E-06 | Invalid | Invalid email format | "notanemail" | Error: "The email field must be a valid email address." | High |
| REG-E-07 | Invalid | Email without @ | "userexample.com" | Error: "The email field must be a valid email address." | High |
| REG-E-08 | Invalid | Email without domain | "user@" | Error: "The email field must be a valid email address." | High |
| REG-E-09 | Invalid | Duplicate email | "admin@gmail.com" (existing) | Error: "The email has already been taken." | High |
| REG-E-10 | Invalid | Email > 255 characters | "a" × 246 + "@example.com" | Error: "The email field must not be greater than 255 characters." | Low |
| REG-E-11 | Invalid | Email with spaces | "user name@example.com" | Error: "The email field must be a valid email address." | Medium |
| REG-E-12 | Valid | Uppercase email | "USER@EXAMPLE.COM" | Registration successful (converted to lowercase) | Medium |

#### 3.1.3 Password Field

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| REG-P-01 | Valid | Password 8-255 characters | "password123" | Registration successful | High |
| REG-P-02 | Valid | Password with special chars | "P@ssw0rd!" | Registration successful | Medium |
| REG-P-03 | Valid | Password exactly 8 characters | "Pass1234" | Registration successful | High |
| REG-P-04 | Valid | Password with spaces | "my password 123" | Registration successful | Low |
| REG-P-05 | Invalid | Empty password | "" | Error: "The password field is required." | High |
| REG-P-06 | Invalid | Password < 8 characters | "Pass123" | Error: "The password field must be at least 8 characters." | High |
| REG-P-07 | Invalid | Password confirmation mismatch | password: "password123", confirmation: "different" | Error: "The password field confirmation does not match." | High |
| REG-P-08 | Boundary | Password exactly 7 characters | "Pass123" | Error: "The password field must be at least 8 characters." | Medium |

#### 3.1.4 Role Assignment

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| REG-R-01 | Valid | Default role assignment | No role specified | User created with role = 0 (farmer) | High |
| REG-R-02 | Valid | System behavior | Check database after registration | role column = 0, email_verified_at = null | High |

---

### 3.2 User Login

#### 3.2.1 Email Field

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| LOG-E-01 | Valid | Registered email | "admin@gmail.com" | Proceed to password validation | High |
| LOG-E-02 | Invalid | Unregistered email | "nonexistent@example.com" | Error: "These credentials do not match our records." | High |
| LOG-E-03 | Invalid | Empty email | "" | Error: "The email field is required." | High |
| LOG-E-04 | Invalid | Invalid email format | "notanemail" | Error: "The email field must be a valid email address." | High |

#### 3.2.2 Password Field

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| LOG-P-01 | Valid | Correct password | "123456789" (for admin@gmail.com) | Login successful, redirect to dashboard | High |
| LOG-P-02 | Invalid | Incorrect password | "wrongpassword" | Error: "These credentials do not match our records." | High |
| LOG-P-03 | Invalid | Empty password | "" | Error: "The password field is required." | High |

#### 3.2.3 Rate Limiting

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| LOG-RL-01 | Valid | 1-5 failed attempts within 1 minute | Failed login attempts: 1-5 | Allow attempts | High |
| LOG-RL-02 | Invalid | > 5 failed attempts within 1 minute | Failed login attempts: 6+ | Error: "Too many login attempts. Please try again later." | High |
| LOG-RL-03 | Valid | Attempts after rate limit timeout | Wait > 1 minute, try again | Rate limit reset, login allowed | Medium |

#### 3.2.4 Role-Based Redirection

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| LOG-RD-01 | Valid | Admin login (role = 1) | admin@gmail.com | Redirect to /admin/dashboard | High |
| LOG-RD-02 | Valid | Farmer login (role = 0) | farmer@gmail.com | Redirect to /farmer/dashboard | High |

#### 3.2.5 Two-Factor Authentication

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| LOG-2FA-01 | Valid | User with 2FA enabled | Login with 2FA user | Redirect to 2FA challenge page | High |
| LOG-2FA-02 | Valid | User without 2FA | Login with regular user | Direct redirect to dashboard | High |
| LOG-2FA-03 | Valid | Valid 2FA code | 6-digit code from authenticator | 2FA verification successful | High |
| LOG-2FA-04 | Invalid | Invalid 2FA code | "000000" | Error: "The provided two factor authentication code was invalid." | High |
| LOG-2FA-05 | Valid | Recovery code usage | Valid recovery code | 2FA verification successful | Medium |

---

### 3.3 Email Verification

#### 3.3.1 Verification Link

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| EMVR-01 | Valid | Valid verification link | /email/verify/{valid_user_id}/{valid_hash} | Email verified, redirect to dashboard | High |
| EMVR-02 | Invalid | Invalid hash | /email/verify/{user_id}/{invalid_hash} | Error: Verification link invalid | High |
| EMVR-03 | Invalid | Invalid user ID | /email/verify/{invalid_id}/{hash} | Error: Verification link invalid | High |
| EMVR-04 | Invalid | Already verified user | Click link again | Redirect to dashboard without re-firing event | Medium |

#### 3.3.2 Resend Verification Email

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| EMVR-RS-01 | Valid | Unverified user | Click "Resend Verification Email" | Email sent, success message shown | High |
| EMVR-RS-02 | Invalid | Already verified user | Click "Resend Verification Email" | No email sent, redirect to dashboard | Medium |

---

### 3.4 Password Reset

#### 3.4.1 Request Password Reset

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| PWRS-RQ-01 | Valid | Registered email | "user@example.com" | Password reset email sent | High |
| PWRS-RQ-02 | Invalid | Unregistered email | "nonexistent@example.com" | Email sent (security: don't reveal if email exists) | High |
| PWRS-RQ-03 | Invalid | Empty email | "" | Error: "The email field is required." | High |
| PWRS-RQ-04 | Invalid | Invalid email format | "notanemail" | Error: "The email field must be a valid email address." | High |

#### 3.4.2 Reset Password with Token

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| PWRS-RT-01 | Valid | Valid token + valid password | token: valid, password: "newpass123", confirmation: "newpass123" | Password reset successful | High |
| PWRS-RT-02 | Invalid | Invalid token | token: invalid/expired | Error: "This password reset token is invalid." | High |
| PWRS-RT-03 | Invalid | Password < 8 characters | token: valid, password: "short" | Error: "The password field must be at least 8 characters." | High |
| PWRS-RT-04 | Invalid | Password confirmation mismatch | password: "password123", confirmation: "different" | Error: "The password field confirmation does not match." | High |

---

### 3.5 Two-Factor Authentication Setup

#### 3.5.1 Enable 2FA

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| 2FA-EN-01 | Valid | Enable with password confirmation | Correct current password | QR code generated, recovery codes shown | High |
| 2FA-EN-02 | Invalid | Enable without password confirmation | No password or incorrect | Error: Password confirmation required | High |
| 2FA-EN-03 | Valid | Confirm 2FA code | Valid 6-digit code from authenticator | 2FA confirmed and enabled | High |
| 2FA-EN-04 | Invalid | Invalid confirmation code | "000000" | Error: "The provided two factor authentication code was invalid." | High |

#### 3.5.2 Disable 2FA

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| 2FA-DS-01 | Valid | Disable 2FA | Click disable button | 2FA removed from account | High |
| 2FA-DS-02 | Valid | Regenerate recovery codes | Click regenerate | New recovery codes generated | Medium |

---

## 4. User Management Module

### 4.1 Create User (Admin)

#### 4.1.1 Name Field

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| USR-C-N-01 | Valid | Name 1-255 characters | "John Farmer" | User created successfully | High |
| USR-C-N-02 | Invalid | Empty name | "" | Error: "The name field is required." | High |
| USR-C-N-03 | Invalid | Name > 255 characters | "A" × 256 | Error: "The name field must not be greater than 255 characters." | Medium |

#### 4.1.2 Email Field

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| USR-C-E-01 | Valid | Unique valid email | "newuser@example.com" | User created successfully | High |
| USR-C-E-02 | Invalid | Duplicate email | "admin@gmail.com" | Error: "The email has already been taken." | High |
| USR-C-E-03 | Invalid | Invalid email format | "notanemail" | Error: "The email field must be a valid email address." | High |
| USR-C-E-04 | Invalid | Empty email | "" | Error: "The email field is required." | High |

#### 4.1.3 Password Field

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| USR-C-P-01 | Valid | Password >= 8 characters | "password123" | User created successfully | High |
| USR-C-P-02 | Invalid | Empty password | "" | Error: "The password field is required." | High |
| USR-C-P-03 | Invalid | Password < 8 characters | "Pass123" | Error: "The password field must be at least 8 characters." | High |

#### 4.1.4 Role Field

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| USR-C-R-01 | Valid | Role = 0 (Farmer) | role: 0 | User created with farmer role | High |
| USR-C-R-02 | Valid | Role = 1 (Admin) | role: 1 | User created with admin role | High |
| USR-C-R-03 | Valid | Role = "farmer" (string) | role: "farmer" | Converted to 0, user created | Medium |
| USR-C-R-04 | Valid | Role = "admin" (string) | role: "admin" | Converted to 1, user created | Medium |
| USR-C-R-05 | Invalid | Role not in [0, 1, 'admin', 'farmer'] | role: 2 | Error: "The selected role is invalid." | High |
| USR-C-R-06 | Invalid | Empty role | "" | Error: "The role field is required." | High |

#### 4.1.5 Location Field

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| USR-C-L-01 | Valid | Location 1-255 characters | "Kuala Lumpur, Malaysia" | User created successfully | Medium |
| USR-C-L-02 | Valid | Empty location (nullable) | "" | User created with null location | Medium |
| USR-C-L-03 | Invalid | Location > 255 characters | "A" × 256 | Error: "The location field must not be greater than 255 characters." | Low |

---

### 4.2 Update User (Admin)

#### 4.2.1 Email Update

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| USR-U-E-01 | Valid | Unique new email | "newemail@example.com" | User updated, email changed | High |
| USR-U-E-02 | Valid | Same email (no change) | Current user email | User updated, email unchanged | Medium |
| USR-U-E-03 | Invalid | Duplicate email (another user) | Another user's email | Error: "The email has already been taken." | High |

#### 4.2.2 Password Update

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| USR-U-P-01 | Valid | New password >= 8 characters | "newpassword123" | User updated, password changed | High |
| USR-U-P-02 | Valid | Empty password (no change) | "" | User updated, password unchanged | High |
| USR-U-P-03 | Invalid | New password < 8 characters | "short" | Error: "The password field must be at least 8 characters." | High |

#### 4.2.3 Self-Update Restrictions

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| USR-U-SR-01 | Invalid | Admin updating own role | Change own role from 1 to 0 | Error: "You cannot update your own role." | High |
| USR-U-SR-02 | Valid | Admin updating other user role | Change another user's role | User updated successfully | High |

---

### 4.3 Delete User (Admin)

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| USR-D-01 | Valid | Delete another user | user_id: different from admin | User deleted, related data cascade deleted | High |
| USR-D-02 | Invalid | Delete self | user_id: admin's own id | Error: "You cannot delete your own account." | High |
| USR-D-03 | Invalid | Delete non-existent user | user_id: 99999 | Error: 404 Not Found | Medium |

---

## 5. Admin Content Management Module

### 5.1 Learning Material Management

#### 5.1.1 Create Learning Material - Common Fields

**Title Field:**

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| LRN-C-T-01 | Valid | Title 1-255 characters | "Introduction to Rice Farming" | Material created successfully | High |
| LRN-C-T-02 | Invalid | Empty title | "" | Error: "The title field is required." | High |
| LRN-C-T-03 | Invalid | Title > 255 characters | "A" × 256 | Error: "The title field must not be greater than 255 characters." | Medium |

**Description Field:**

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| LRN-C-D-01 | Valid | Description with text | "This material covers..." | Material created successfully | Medium |
| LRN-C-D-02 | Valid | Empty description (nullable) | "" | Material created with null description | Medium |

**Type Field:**

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| LRN-C-TY-01 | Valid | Type = "pdf" | type: "pdf" | Material created as PDF type | High |
| LRN-C-TY-02 | Valid | Type = "video" | type: "video" | Material created as video type | High |
| LRN-C-TY-03 | Invalid | Type not in ['pdf', 'video'] | type: "audio" | Error: "The selected type is invalid." | High |
| LRN-C-TY-04 | Invalid | Empty type | "" | Error: "The type field is required." | High |

**Category Field:**

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| LRN-C-C-01 | Valid | Category 1-255 characters | "Rice Farming" | Material created successfully | High |
| LRN-C-C-02 | Invalid | Empty category | "" | Error: "The category field is required." | High |
| LRN-C-C-03 | Invalid | Category > 255 characters | "A" × 256 | Error: "The category field must not be greater than 255 characters." | Low |

#### 5.1.2 Create Learning Material - PDF Type

**File Field (when type = pdf):**

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| LRN-PDF-F-01 | Valid | PDF file <= 50MB | sample.pdf (10MB) | PDF uploaded successfully | High |
| LRN-PDF-F-02 | Valid | PDF file exactly 50MB | sample.pdf (50MB) | PDF uploaded successfully | Medium |
| LRN-PDF-F-03 | Invalid | No file when type=pdf | type: "pdf", file: null | Error: "The file field is required when type is pdf." | High |
| LRN-PDF-F-04 | Invalid | Non-PDF file | sample.jpg | Error: "The file field must be a file of type: pdf." | High |
| LRN-PDF-F-05 | Invalid | PDF file > 50MB | sample.pdf (51MB) | Error: "The file field must not be greater than 51200 kilobytes." | Medium |
| LRN-PDF-F-06 | Boundary | PDF file at 49.9MB | sample.pdf (49.9MB) | PDF uploaded successfully | Low |

#### 5.1.3 Create Learning Material - Video Type

**Video URL Field (when type = video):**

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| LRN-VID-U-01 | Valid | Valid YouTube URL | "https://www.youtube.com/watch?v=abc123" | Video material created successfully | High |
| LRN-VID-U-02 | Valid | Valid URL format | "https://vimeo.com/123456" | Video material created successfully | Medium |
| LRN-VID-U-03 | Invalid | No URL when type=video | type: "video", video_url: null | Error: "The video url field is required when type is video." | High |
| LRN-VID-U-04 | Invalid | Invalid URL format | "not-a-url" | Error: "The video url field must be a valid URL." | High |
| LRN-VID-U-05 | Invalid | Empty URL | "" | Error: "The video url field is required when type is video." | High |

#### 5.1.4 Thumbnail Field (Optional)

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| LRN-TH-01 | Valid | Image file <= 2MB | thumbnail.jpg (1MB) | Thumbnail uploaded successfully | Medium |
| LRN-TH-02 | Valid | No thumbnail (nullable) | null | Material created without thumbnail | Medium |
| LRN-TH-03 | Invalid | Non-image file | document.pdf | Error: "The thumbnail field must be an image." | Medium |
| LRN-TH-04 | Invalid | Image > 2MB | thumbnail.jpg (3MB) | Error: "The thumbnail field must not be greater than 2048 kilobytes." | Medium |

### 5.3 Announcement Management

#### 5.3.1 Create Announcement

**Title Field:**

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| ANN-C-T-01 | Valid | Title 1-255 characters | "New Farming Techniques" | Announcement created successfully | High |
| ANN-C-T-02 | Invalid | Empty title | "" | Error: "The title field is required." | High |
| ANN-C-T-03 | Invalid | Title > 255 characters | "A" × 256 | Error: "The title field must not be greater than 255 characters." | Medium |

**Content Field:**

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| ANN-C-C-01 | Valid | Content with text | "We are introducing new..." | Announcement created successfully | High |
| ANN-C-C-02 | Invalid | Empty content | "" | Error: "The content field is required." | High |

**Category Field:**

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| ANN-C-CT-01 | Valid | Category 1-255 characters | "General" | Announcement created successfully | Medium |
| ANN-C-CT-02 | Valid | Empty category (nullable) | "" | Announcement created with null category | Medium |
| ANN-C-CT-03 | Invalid | Category > 255 characters | "A" × 256 | Error: "The category field must not be greater than 255 characters." | Low |

**Image Field:**

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| ANN-C-I-01 | Valid | Image file <= 5MB | image.jpg (3MB) | Image uploaded successfully | Medium |
| ANN-C-I-02 | Valid | No image (nullable) | null | Announcement created without image | Medium |
| ANN-C-I-03 | Invalid | Non-image file | document.pdf | Error: "The image field must be an image." | Medium |
| ANN-C-I-04 | Invalid | Image > 5MB | image.jpg (6MB) | Error: "The image field must not be greater than 5120 kilobytes." | Medium |

**Publish Now Field:**

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| ANN-C-PN-01 | Valid | publish_now = true | true | Announcement published immediately (published_at set) | High |
| ANN-C-PN-02 | Valid | publish_now = false | false | Announcement saved as draft (published_at = null) | High |

---

### 5.4 Virtual Tour Management

#### 5.4.1 Create Virtual Tour

**Title Field:**

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| VT-C-T-01 | Valid | Title 1-255 characters | "Rice Farm Virtual Tour" | Tour created successfully | High |
| VT-C-T-02 | Invalid | Empty title | "" | Error: "The title field is required." | High |
| VT-C-T-03 | Invalid | Title > 255 characters | "A" × 256 | Error: "The title field must not be greater than 255 characters." | Medium |

**Tour URL Field:**

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| VT-C-U-01 | Valid | Valid URL | "https://example.com/tour/123" | Tour created successfully | High |
| VT-C-U-02 | Invalid | Empty tour_url | "" | Error: "The tour url field is required." | High |
| VT-C-U-03 | Invalid | Invalid URL format | "not-a-url" | Error: "The tour url field must be a valid URL." | High |

**Tour Type Field:**

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| VT-C-TT-01 | Valid | Tour type = "iframe" | "iframe" | Tour created as iframe embed | High |
| VT-C-TT-02 | Valid | Tour type = "redirect" | "redirect" | Tour created as redirect link | High |
| VT-C-TT-03 | Invalid | Tour type not in ['iframe', 'redirect'] | "popup" | Error: "The selected tour type is invalid." | High |
| VT-C-TT-04 | Invalid | Empty tour type | "" | Error: "The tour type field is required." | High |

**Thumbnail Field:**

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| VT-C-TH-01 | Valid | Image <= 5MB | thumbnail.jpg (2MB) | Thumbnail uploaded successfully | Medium |
| VT-C-TH-02 | Valid | No thumbnail (nullable) | null | Tour created without thumbnail | Medium |
| VT-C-TH-03 | Invalid | Image > 5MB | thumbnail.jpg (6MB) | Error: "The thumbnail field must not be greater than 5120 kilobytes." | Medium |

---

### 5.5 Report Management (Admin)

#### 5.5.1 Respond to Report

**Admin Response Field:**

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| RPT-R-AR-01 | Valid | Response with text | "We have reviewed your report..." | Response saved successfully | High |
| RPT-R-AR-02 | Invalid | Empty response | "" | Error: "The admin response field is required." | High |

**Status Field:**

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| RPT-R-S-01 | Valid | Status = "pending" | "pending" | Status updated to pending | High |
| RPT-R-S-02 | Valid | Status = "under_review" | "under_review" | Status updated to under_review | High |
| RPT-R-S-03 | Valid | Status = "resolved" | "resolved" | Status updated to resolved | High |
| RPT-R-S-04 | Invalid | Status not in enum | "cancelled" | Error: "The selected status is invalid." | High |
| RPT-R-S-05 | Invalid | Empty status | "" | Error: "The status field is required." | High |

---

### 5.6 Forum Management (Admin)

#### 5.6.1 Approve Forum

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| FRM-A-01 | Valid | Approve pending forum | forum_id: valid, status: pending | Status = approved, approved_at set, approved_by set | High |
| FRM-A-02 | Invalid | Approve non-existent forum | forum_id: 99999 | Error: 404 Not Found | Medium |

#### 5.6.2 Reject Forum

**Rejection Reason Field:**

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| FRM-R-RR-01 | Valid | Rejection with reason | "Contains inappropriate content" | Status = rejected, rejection_reason saved | High |
| FRM-R-RR-02 | Valid | Rejection without reason (nullable) | "" | Status = rejected, rejection_reason = null | Medium |

---

### 5.7 Feedback Management (Admin)

#### 5.7.1 Add Admin Notes

**Admin Notes Field:**

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| FBK-N-01 | Valid | Notes with text | "Follow up with user" | Notes saved, feedback marked as read | High |
| FBK-N-02 | Invalid | Empty notes | "" | Error: "The admin notes field is required." | High |

---

## 6. Farmer Features Module

### 6.1 Quiz Submission (Farmer)

#### 6.1.1 Answers Array

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| QUZ-S-A-01 | Valid | All answers 0-3 | [0, 1, 2, 3, 0] | Quiz submitted, score calculated | High |
| QUZ-S-A-02 | Invalid | Answer < 0 | [0, 1, -1, 2] | Error: "The answers.2 field must be at least 0." | Medium |
| QUZ-S-A-03 | Invalid | Answer > 3 | [0, 1, 4, 2] | Error: "The answers.2 field must not be greater than 3." | Medium |
| QUZ-S-A-04 | Invalid | Empty answers array | [] | Error: "The answers field is required." | High |
| QUZ-S-A-05 | Invalid | Missing answers | Submit with fewer answers than questions | Error: Validation failed | High |

#### 6.1.2 Score Calculation

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| QUZ-S-SC-01 | Valid | All correct answers | 5/5 correct | Score = 100%, passed = true | High |
| QUZ-S-SC-02 | Valid | Some correct answers | 3/5 correct | Score = 60%, passed depends on passing_score | High |
| QUZ-S-SC-03 | Valid | No correct answers | 0/5 correct | Score = 0%, passed = false | Medium |
| QUZ-S-SC-04 | Boundary | Score = passing_score | Score: 70, passing_score: 70 | passed = true | High |
| QUZ-S-SC-05 | Boundary | Score = passing_score - 1 | Score: 69, passing_score: 70 | passed = false | High |

---

### 6.2 Report Submission (Farmer)

#### 6.2.1 Title Field

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| RPT-C-T-01 | Valid | Title 1-255 characters | "Pest Problem in Field 3" | Report created successfully | High |
| RPT-C-T-02 | Invalid | Empty title | "" | Error: "The title field is required." | High |
| RPT-C-T-03 | Invalid | Title > 255 characters | "A" × 256 | Error: "The title field must not be greater than 255 characters." | Medium |

#### 6.2.2 Type Field

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| RPT-C-TY-01 | Valid | Type 1-255 characters | "Pest Control" | Report created successfully | High |
| RPT-C-TY-02 | Invalid | Empty type | "" | Error: "The type field is required." | High |
| RPT-C-TY-03 | Invalid | Type > 255 characters | "A" × 256 | Error: "The type field must not be greater than 255 characters." | Low |

#### 6.2.3 Description Field

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| RPT-C-D-01 | Valid | Description with text | "There are many pests attacking..." | Report created successfully | High |
| RPT-C-D-02 | Invalid | Empty description | "" | Error: "The description field is required." | High |

#### 6.2.4 Location Field

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| RPT-C-L-01 | Valid | Location 1-255 characters | "Field 3, North Section" | Report created successfully | High |
| RPT-C-L-02 | Invalid | Empty location | "" | Error: "The location field is required." | High |
| RPT-C-L-03 | Invalid | Location > 255 characters | "A" × 256 | Error: "The location field must not be greater than 255 characters." | Low |

#### 6.2.5 Image Field

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| RPT-C-I-01 | Valid | Image <= 10MB | image.jpg (5MB) | Image uploaded successfully | Medium |
| RPT-C-I-02 | Valid | No image (nullable) | null | Report created without image | Medium |
| RPT-C-I-03 | Invalid | Non-image file | document.pdf | Error: "The image field must be an image." | Medium |
| RPT-C-I-04 | Invalid | Image > 10MB | image.jpg (11MB) | Error: "The image field must not be greater than 10240 kilobytes." | Medium |

#### 6.2.6 PDF Letter Field

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| RPT-C-PDF-01 | Valid | PDF <= 10MB | letter.pdf (5MB) | PDF uploaded successfully | Medium |
| RPT-C-PDF-02 | Valid | No PDF (nullable) | null | Report created without PDF | Medium |
| RPT-C-PDF-03 | Invalid | Non-PDF file | image.jpg | Error: "The pdf letter field must be a file of type: pdf." | Medium |
| RPT-C-PDF-04 | Invalid | PDF > 10MB | letter.pdf (11MB) | Error: "The pdf letter field must not be greater than 10240 kilobytes." | Medium |

#### 6.2.7 Rate Limiting

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| RPT-RL-01 | Valid | 1-10 reports per minute | 1-10 submissions | Reports created successfully | High |
| RPT-RL-02 | Invalid | > 10 reports per minute | 11+ submissions | Error: "Too many requests." | High |

---

### 6.3 Forum Post (Farmer)

#### 6.3.1 Create Forum Post

**Title Field:**

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| FRM-C-T-01 | Valid | Title 1-255 characters | "Best Practices for Rice Farming" | Forum post created (status: pending) | High |
| FRM-C-T-02 | Invalid | Empty title | "" | Error: "The title field is required." | High |
| FRM-C-T-03 | Invalid | Title > 255 characters | "A" × 256 | Error: "The title field must not be greater than 255 characters." | Medium |

**Content Field:**

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| FRM-C-C-01 | Valid | Content with text | "I would like to share..." | Forum post created successfully | High |
| FRM-C-C-02 | Invalid | Empty content | "" | Error: "The content field is required." | High |

**Category Field:**

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| FRM-C-CT-01 | Valid | Category 1-255 characters | "Rice Farming" | Forum post created successfully | Medium |
| FRM-C-CT-02 | Valid | Empty category (nullable) | "" | Forum post created with null category | Medium |

**Image Field:**

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| FRM-C-I-01 | Valid | Image <= 5MB | image.jpg (3MB) | Image uploaded successfully | Medium |
| FRM-C-I-02 | Valid | No image (nullable) | null | Forum post created without image | Medium |
| FRM-C-I-03 | Invalid | Image > 5MB | image.jpg (6MB) | Error: "The image field must not be greater than 5120 kilobytes." | Medium |

#### 6.3.2 Forum Comment

**Content Field:**

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| FRM-CM-C-01 | Valid | Content with text | "Great advice!" | Comment created successfully | High |
| FRM-CM-C-02 | Invalid | Empty content | "" | Error: "The content field is required." | High |

**Image Field:**

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| FRM-CM-I-01 | Valid | Image <= 5MB | image.jpg (2MB) | Image uploaded successfully | Medium |
| FRM-CM-I-02 | Valid | No image (nullable) | null | Comment created without image | Medium |
| FRM-CM-I-03 | Invalid | Image > 5MB | image.jpg (6MB) | Error: "The image field must not be greater than 5120 kilobytes." | Medium |

#### 6.3.3 Forum Like

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| FRM-L-01 | Valid | First like on forum | forum_id: valid, user hasn't liked | Like created, likes_count incremented | High |
| FRM-L-02 | Valid | Unlike forum | forum_id: valid, user already liked | Like removed, likes_count decremented | High |
| FRM-L-03 | Invalid | Like non-approved forum | forum_id: pending/rejected forum | Error: 403 Forbidden or similar | Medium |

---

### 6.4 Feedback Submission (Farmer)

#### 6.4.1 Type Field

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| FBK-C-T-01 | Valid | Type = "positive" | "positive" | Feedback created as positive | High |
| FBK-C-T-02 | Valid | Type = "improvement" | "improvement" | Feedback created as improvement | High |
| FBK-C-T-03 | Invalid | Type not in enum | "negative" | Error: "The selected type is invalid." | High |
| FBK-C-T-04 | Invalid | Empty type | "" | Error: "The type field is required." | High |

#### 6.4.2 Message Field

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| FBK-C-M-01 | Valid | Message with text | "The system is very helpful!" | Feedback created successfully | High |
| FBK-C-M-02 | Invalid | Empty message | "" | Error: "The message field is required." | High |

#### 6.4.3 Rating Field

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| FBK-C-R-01 | Valid | Rating 1-5 | 4 | Feedback created successfully | High |
| FBK-C-R-02 | Valid | Rating = 1 | 1 | Feedback created (likely categorized as improvement) | Medium |
| FBK-C-R-03 | Valid | Rating = 5 | 5 | Feedback created (categorized as positive) | Medium |
| FBK-C-R-04 | Valid | No rating (nullable) | null | Feedback created without rating | Medium |
| FBK-C-R-05 | Invalid | Rating < 1 | 0 | Error: "The rating field must be at least 1." | Medium |
| FBK-C-R-06 | Invalid | Rating > 5 | 6 | Error: "The rating field must not be greater than 5." | Medium |
| FBK-C-R-07 | Boundary | Rating = 4 (threshold) | 4 | Type auto-set to "positive" | Low |
| FBK-C-R-08 | Boundary | Rating = 3 (below threshold) | 3 | Type auto-set to "improvement" | Low |

#### 6.4.4 Feature Field

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| FBK-C-F-01 | Valid | Feature 1-255 characters | "Learning Materials" | Feedback created successfully | Medium |
| FBK-C-F-02 | Valid | Empty feature (nullable) | "" | Feedback created without feature | Medium |
| FBK-C-F-03 | Invalid | Feature > 255 characters | "A" × 256 | Error: "The feature field must not be greater than 255 characters." | Low |

#### 6.4.5 Rate Limiting

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| FBK-RL-01 | Valid | 1-5 feedback per minute | 1-5 submissions | Feedback created successfully | High |
| FBK-RL-02 | Invalid | > 5 feedback per minute | 6+ submissions | Error: "Too many requests." | High |

---

## 7. Email Notification System Module

### 7.1 Announcement Email Notifications

#### 7.1.1 Trigger Conditions

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| EMAIL-ANN-TR-01 | Valid | Publish new announcement with publish_now=true | Create announcement with publish_now: true | Email sent to all verified farmers | High |
| EMAIL-ANN-TR-02 | Valid | Toggle announcement to published | Unpublished announcement → published | Email sent to all verified farmers | High |
| EMAIL-ANN-TR-03 | Invalid | Save announcement as draft | publish_now: false | No email sent | High |
| EMAIL-ANN-TR-04 | Invalid | Update already published announcement | Edit published announcement | No email sent (not a new publish) | Medium |

#### 7.1.2 Recipient Selection

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| EMAIL-ANN-RC-01 | Valid | Farmer with verified email | role=2, email_verified_at != null | Email received | High |
| EMAIL-ANN-RC-02 | Invalid | Farmer with unverified email | role=2, email_verified_at = null | Email NOT sent | High |
| EMAIL-ANN-RC-03 | Invalid | User with no email | role=2, email = null | Email NOT sent | Medium |
| EMAIL-ANN-RC-04 | Invalid | Admin user | role=1 | Email NOT sent (only farmers receive) | High |
| EMAIL-ANN-RC-05 | Valid | Multiple verified farmers | 10 farmers with verified emails | All 10 receive email | High |

#### 7.1.3 Email Content Validation

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| EMAIL-ANN-CT-01 | Valid | Email contains announcement title | Title: "New Farming Technique" | Subject and body include title | High |
| EMAIL-ANN-CT-02 | Valid | Email contains announcement content | Content: "We are introducing..." | Body includes full content | High |
| EMAIL-ANN-CT-03 | Valid | Email contains announcement category | Category: "General" | Category badge displayed in email | Medium |
| EMAIL-ANN-CT-04 | Valid | Email contains announcement image | Image uploaded | Image embedded as base64 in email | High |
| EMAIL-ANN-CT-05 | Valid | Email contains AgriPadi logo | Logo exists at public/logo1.png | Logo embedded as base64 in header | High |
| EMAIL-ANN-CT-06 | Valid | Email contains dashboard link | Button link | Link points to farmer dashboard | High |
| EMAIL-ANN-CT-07 | Valid | Email without image | No image uploaded | Email renders without image section | Medium |
| EMAIL-ANN-CT-08 | Valid | Email without category | Category = null | Email renders without category badge | Low |

#### 7.1.4 Email Subject Line

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| EMAIL-ANN-SJ-01 | Valid | Subject format | Title: "New Technique" | Subject: "[AgriPadi] Pengumuman Baru: New Technique" | High |
| EMAIL-ANN-SJ-02 | Valid | Subject with special characters | Title: "Teknik Baru & Inovasi" | Subject includes special characters properly | Medium |
| EMAIL-ANN-SJ-03 | Boundary | Subject with long title | Title: 255 characters | Subject truncates or handles gracefully | Low |

#### 7.1.5 Email Template Rendering

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| EMAIL-ANN-TM-01 | Valid | HTML email structure | Standard announcement | Email has proper HTML structure | High |
| EMAIL-ANN-TM-02 | Valid | CSS styling | Standard announcement | Green gradient header, proper formatting | Medium |
| EMAIL-ANN-TM-03 | Valid | Mobile responsive | View on mobile device | Email displays correctly on mobile | Medium |
| EMAIL-ANN-TM-04 | Valid | Line breaks in content | Content with \n characters | Line breaks rendered as <br> tags | Medium |
| EMAIL-ANN-TM-05 | Valid | Published date display | published_at set | Date formatted as "d F Y, g:i A" | Low |

#### 7.1.6 Image Embedding

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| EMAIL-ANN-IMG-01 | Valid | Logo embedding | Logo exists | Logo embedded as data:image/png;base64 | High |
| EMAIL-ANN-IMG-02 | Valid | Announcement image (JPEG) | .jpg file | Image embedded as data:image/jpeg;base64 | High |
| EMAIL-ANN-IMG-03 | Valid | Announcement image (PNG) | .png file | Image embedded as data:image/png;base64 | High |
| EMAIL-ANN-IMG-04 | Invalid | Missing logo file | logo1.png doesn't exist | Email renders without logo | Medium |
| EMAIL-ANN-IMG-05 | Invalid | Missing announcement image | Image file deleted | Email renders without image | Medium |

---

### 7.2 Feedback Response Email Notifications

#### 7.2.1 Trigger Conditions

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| EMAIL-FBK-TR-01 | Valid | Admin adds notes to feedback | Add admin_notes to feedback | Email sent to feedback submitter | High |
| EMAIL-FBK-TR-02 | Valid | Admin updates existing notes | Update admin_notes | Email sent to feedback submitter | Medium |
| EMAIL-FBK-TR-03 | Invalid | Create feedback without notes | Submit feedback | No email sent | High |
| EMAIL-FBK-TR-04 | Invalid | Mark feedback as read without notes | is_read: true, admin_notes: null | No email sent | Medium |

#### 7.2.2 Recipient Validation

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| EMAIL-FBK-RC-01 | Valid | Feedback from user with email | feedback.user.email exists | Email sent to user | High |
| EMAIL-FBK-RC-02 | Invalid | Feedback from user without email | feedback.user.email = null | No email sent, error logged | Medium |
| EMAIL-FBK-RC-03 | Invalid | Orphaned feedback (no user) | feedback.user = null | No email sent, error logged | Medium |

#### 7.2.3 Email Content Validation

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| EMAIL-FBK-CT-01 | Valid | Email contains user name | feedback.user.name: "Ahmad" | Greeting: "Assalamualaikum Ahmad," | High |
| EMAIL-FBK-CT-02 | Valid | Email contains original feedback | message: "System is great!" | Original feedback displayed in gray box | High |
| EMAIL-FBK-CT-03 | Valid | Email contains admin response | admin_notes: "Thank you!" | Admin response displayed in blue box | High |
| EMAIL-FBK-CT-04 | Valid | Email contains rating | rating: 4 | 4 filled stars + 1 empty star displayed | Medium |
| EMAIL-FBK-CT-05 | Valid | Email contains feature | feature: "Learning Materials" | Feature displayed below feedback | Medium |
| EMAIL-FBK-CT-06 | Valid | Email without rating | rating: null | No stars displayed | Medium |
| EMAIL-FBK-CT-07 | Valid | Email without feature | feature: null | No feature section displayed | Low |

#### 7.2.4 Email Subject Line

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| EMAIL-FBK-SJ-01 | Valid | Subject format | Any feedback | Subject: "[AgriPadi] Maklum Balas daripada Pegawai Pertanian" | High |

#### 7.2.5 Email Template Rendering

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| EMAIL-FBK-TM-01 | Valid | HTML email structure | Standard feedback response | Email has proper HTML structure | High |
| EMAIL-FBK-TM-02 | Valid | CSS styling | Standard feedback response | Blue gradient header, proper formatting | Medium |
| EMAIL-FBK-TM-03 | Valid | Mobile responsive | View on mobile device | Email displays correctly on mobile | Medium |
| EMAIL-FBK-TM-04 | Valid | Line breaks in admin notes | Notes with \n characters | Line breaks rendered as <br> tags | Medium |
| EMAIL-FBK-TM-05 | Valid | Rating stars rendering | rating: 1 to 5 | Correct number of filled/empty stars | Medium |

---

### 7.3 Email System Configuration

#### 7.3.1 SMTP Configuration

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| EMAIL-CFG-SM-01 | Valid | Valid SMTP credentials | Correct Mailtrap credentials | Emails sent successfully | High |
| EMAIL-CFG-SM-02 | Invalid | Invalid SMTP username | Wrong username | Email fails, error logged | High |
| EMAIL-CFG-SM-03 | Invalid | Invalid SMTP password | Wrong password | Email fails, error logged | High |
| EMAIL-CFG-SM-04 | Invalid | Invalid SMTP host | Wrong host address | Email fails, error logged | High |
| EMAIL-CFG-SM-05 | Invalid | Invalid SMTP port | Wrong port number | Email fails, error logged | High |

#### 7.3.2 Email From Address

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| EMAIL-CFG-FR-01 | Valid | Valid from address | MAIL_FROM_ADDRESS set | Emails sent from configured address | High |
| EMAIL-CFG-FR-02 | Valid | From name configured | MAIL_FROM_NAME: "AgriPadi" | Emails show "AgriPadi" as sender | Medium |

#### 7.3.3 Error Handling

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| EMAIL-ERR-01 | Valid | Email send failure | SMTP server down | Error logged, operation continues | High |
| EMAIL-ERR-02 | Valid | Invalid recipient email | Malformed email address | Error logged, skip recipient | Medium |
| EMAIL-ERR-03 | Valid | Partial failure (multiple recipients) | 1 of 10 emails fails | Error logged, other 9 sent successfully | High |

---

### 7.4 Email Integration Testing

#### 7.4.1 End-to-End Announcement Flow

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| EMAIL-E2E-AN-01 | Valid | Complete announcement publish flow | Create → Publish → Email | Announcement created, email received by farmers | High |
| EMAIL-E2E-AN-02 | Valid | Toggle publish flow | Create draft → Toggle publish | Email sent when toggled to published | High |
| EMAIL-E2E-AN-03 | Valid | Multiple recipients | 5 verified farmers | All 5 receive email in Mailtrap | High |

#### 7.4.2 End-to-End Feedback Response Flow

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| EMAIL-E2E-FB-01 | Valid | Complete feedback response flow | Submit feedback → Add notes → Email | Feedback submitted, admin adds notes, farmer receives email | High |
| EMAIL-E2E-FB-02 | Valid | Rating included | Feedback with rating 5 | Email shows 5 filled stars | Medium |
| EMAIL-E2E-FB-03 | Valid | Feature included | Feedback for "Forum" feature | Email shows feature name | Medium |

#### 7.4.3 Mailtrap Testing

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| EMAIL-MT-01 | Valid | Announcement email in Mailtrap | Publish announcement | Email appears in Mailtrap inbox | High |
| EMAIL-MT-02 | Valid | Feedback email in Mailtrap | Add feedback notes | Email appears in Mailtrap inbox | High |
| EMAIL-MT-03 | Valid | Email HTML preview | View email in Mailtrap | HTML renders correctly with images | High |
| EMAIL-MT-04 | Valid | Email spam score | Check spam score in Mailtrap | Spam score acceptable (<5) | Medium |

---

## 8. Settings Module

### 8.1 Profile Update

#### 8.1.1 Name Field

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| SET-P-N-01 | Valid | Name 1-255 characters | "Updated Name" | Profile updated successfully | High |
| SET-P-N-02 | Invalid | Empty name | "" | Error: "The name field is required." | High |
| SET-P-N-03 | Invalid | Name > 255 characters | "A" × 256 | Error: "The name field must not be greater than 255 characters." | Medium |

#### 8.1.2 Email Field

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| SET-P-E-01 | Valid | New unique email | "newemail@example.com" | Profile updated, email verification sent | High |
| SET-P-E-02 | Valid | Same email (no change) | Current user email | Profile updated, no verification sent | High |
| SET-P-E-03 | Invalid | Duplicate email (another user) | Another user's email | Error: "The email has already been taken." | High |
| SET-P-E-04 | Invalid | Invalid email format | "notanemail" | Error: "The email field must be a valid email address." | High |
| SET-P-E-05 | Valid | Uppercase email | "USER@EXAMPLE.COM" | Profile updated, email converted to lowercase | Medium |

#### 8.1.3 Location Field

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| SET-P-L-01 | Valid | Location 1-255 characters | "Penang, Malaysia" | Profile updated successfully | Medium |
| SET-P-L-02 | Valid | Empty location (nullable) | "" | Profile updated, location set to null | Medium |
| SET-P-L-03 | Invalid | Location > 255 characters | "A" × 256 | Error: "The location field must not be greater than 255 characters." | Low |

#### 8.1.4 Profile Picture Field

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| SET-P-PP-01 | Valid | Image (jpeg, png, jpg, gif) <= 2MB | profile.jpg (1MB) | Profile picture uploaded successfully | High |
| SET-P-PP-02 | Valid | No profile picture (nullable) | null | Profile updated without picture | Medium |
| SET-P-PP-03 | Invalid | Non-image file | document.pdf | Error: "The profile picture field must be an image." | Medium |
| SET-P-PP-04 | Invalid | Unsupported image format | profile.bmp | Error: "The profile picture field must be a file of type: jpeg, png, jpg, gif." | Medium |
| SET-P-PP-05 | Invalid | Image > 2MB | profile.jpg (3MB) | Error: "The profile picture field must not be greater than 2048 kilobytes." | Medium |
| SET-P-PP-06 | Boundary | Image exactly 2MB | profile.jpg (2MB) | Profile picture uploaded successfully | Low |

---

### 8.2 Password Update

#### 8.2.1 Current Password Field

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| SET-PW-CP-01 | Valid | Correct current password | User's actual password | Proceed to new password validation | High |
| SET-PW-CP-02 | Invalid | Incorrect current password | "wrongpassword" | Error: "The current password is incorrect." | High |
| SET-PW-CP-03 | Invalid | Empty current password | "" | Error: "The current password field is required." | High |

#### 8.2.2 New Password Field

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| SET-PW-NP-01 | Valid | New password >= 8 characters | "newpassword123" | Password updated successfully | High |
| SET-PW-NP-02 | Invalid | New password < 8 characters | "short" | Error: "The password field must be at least 8 characters." | High |
| SET-PW-NP-03 | Invalid | Empty new password | "" | Error: "The password field is required." | High |
| SET-PW-NP-04 | Invalid | Password confirmation mismatch | password: "newpass123", confirmation: "different" | Error: "The password field confirmation does not match." | High |
| SET-PW-NP-05 | Boundary | New password exactly 8 characters | "Pass1234" | Password updated successfully | Medium |

#### 8.2.3 Rate Limiting

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| SET-PW-RL-01 | Valid | 1-6 attempts per minute | 1-6 password update attempts | Updates processed | High |
| SET-PW-RL-02 | Invalid | > 6 attempts per minute | 7+ password update attempts | Error: "Too many requests." | High |

---

### 8.3 Account Deletion

#### 8.3.1 Password Confirmation

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| SET-DEL-P-01 | Valid | Correct password | User's actual password | Account deleted, user logged out | High |
| SET-DEL-P-02 | Invalid | Incorrect password | "wrongpassword" | Error: "The password is incorrect." | High |
| SET-DEL-P-03 | Invalid | Empty password | "" | Error: "The password field is required." | High |

---

## 9. Security & Middleware Module

### 9.1 Authorization

#### 9.1.1 Admin Routes Access

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| AUTH-AR-01 | Valid | Admin user (role = 1) accessing /admin/* | Logged in as admin | Access granted | High |
| AUTH-AR-02 | Invalid | Farmer user (role = 0) accessing /admin/* | Logged in as farmer | Error: 403 Forbidden | High |
| AUTH-AR-03 | Invalid | Unauthenticated user accessing /admin/* | Not logged in | Redirect to login | High |

#### 9.1.2 Farmer Routes Access

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| AUTH-FR-01 | Valid | Farmer user (role = 0) accessing /farmer/* | Logged in as farmer | Access granted | High |
| AUTH-FR-02 | Valid | Admin user (role = 1) accessing /farmer/* | Logged in as admin | Access granted (admins can access farmer routes) | Medium |
| AUTH-FR-03 | Invalid | Unauthenticated user accessing /farmer/* | Not logged in | Redirect to login | High |

#### 9.1.3 Ownership Validation

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| AUTH-OWN-01 | Valid | User updating own report | user_id matches report.user_id | Update successful | High |
| AUTH-OWN-02 | Invalid | User updating another's report | user_id ≠ report.user_id | Error: 403 Forbidden | High |
| AUTH-OWN-03 | Valid | User deleting own forum post | user_id matches forum.user_id | Delete successful | High |
| AUTH-OWN-04 | Invalid | User deleting another's forum post | user_id ≠ forum.user_id | Error: 403 Forbidden | High |
| AUTH-OWN-05 | Valid | User deleting own comment | user_id matches comment.user_id | Delete successful | High |
| AUTH-OWN-06 | Invalid | User deleting another's comment | user_id ≠ comment.user_id | Error: 403 Forbidden | High |

---

### 9.2 CSRF Protection

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| SEC-CSRF-01 | Valid | Request with valid CSRF token | POST/PUT/DELETE with valid token | Request processed | High |
| SEC-CSRF-02 | Invalid | Request without CSRF token | POST/PUT/DELETE without token | Error: 419 Page Expired | High |
| SEC-CSRF-03 | Invalid | Request with invalid CSRF token | POST/PUT/DELETE with wrong token | Error: 419 Page Expired | High |

---

### 9.3 File Upload Security

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| SEC-UP-01 | Valid | Allowed file types | jpeg, png, jpg, gif, pdf (based on context) | File uploaded successfully | High |
| SEC-UP-02 | Invalid | Disallowed file types | .exe, .php, .js files | Error: Invalid file type | High |
| SEC-UP-03 | Invalid | File size exceeds limit | File > max allowed size | Error: File too large | High |
| SEC-UP-04 | Invalid | Malicious filename | "../../../etc/passwd.jpg" | Filename sanitized or rejected | High |

---

### 9.4 SQL Injection Prevention

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| SEC-SQL-01 | Valid | Normal input | "John Doe" | Query executes safely using prepared statements | High |
| SEC-SQL-02 | Invalid | SQL injection attempt | "'; DROP TABLE users; --" | Input escaped/sanitized, no SQL execution | High |
| SEC-SQL-03 | Invalid | SQL injection in search | "' OR '1'='1" | Input escaped, no unauthorized data access | High |

---

### 9.5 XSS Prevention

| Test ID | Partition Type | Equivalence Class | Test Data | Expected Result | Priority |
|---------|---------------|-------------------|-----------|-----------------|----------|
| SEC-XSS-01 | Valid | Normal text input | "Hello World" | Text displayed safely | High |
| SEC-XSS-02 | Invalid | XSS script tag | "<script>alert('XSS')</script>" | Script escaped and displayed as text | High |
| SEC-XSS-03 | Invalid | XSS event handler | "<img src=x onerror=alert('XSS')>" | HTML escaped and displayed safely | High |

---

## 10. Test Data Requirements

### 10.1 User Accounts

| User Type | Email | Password | Role | Purpose |
|-----------|-------|----------|------|---------|
| Admin | admin@gmail.com | 123456789 | 1 | Admin functionality testing |
| Farmer | farmer@gmail.com | 123456789 | 0 | Farmer functionality testing |
| Test User 1 | test1@example.com | password123 | 0 | Registration/login testing |
| Test User 2 | test2@example.com | password123 | 0 | Multi-user interaction testing |

### 10.2 Sample Files

| File Type | Size | Purpose |
|-----------|------|---------|
| Small Image (JPEG) | 500KB | Valid image upload testing |
| Large Image (JPEG) | 3MB | Image size boundary testing |
| Oversized Image | 11MB | Image size limit testing |
| Small PDF | 2MB | Valid PDF upload testing |
| Large PDF | 25MB | PDF size boundary testing |
| Oversized PDF | 60MB | PDF size limit testing |
| Invalid File (.exe) | Any | File type validation testing |

### 10.3 Sample Content

| Content Type | Sample Data |
|--------------|-------------|
| Learning Material | Title: "Introduction to Rice Farming", Category: "Rice Farming", Type: PDF |
| Quiz | Title: "Rice Farming Quiz", Passing Score: 70%, Questions: 5 |
| Announcement | Title: "New Farming Techniques", Content: "We are introducing..." |
| Virtual Tour | Title: "Rice Farm Tour", URL: "https://example.com/tour", Type: iframe |
| Forum Post | Title: "Best Practices", Content: "I would like to share..." |
| Report | Title: "Pest Problem", Type: "Pest Control", Location: "Field 3" |

---

## 11. Test Environment Setup

### 11.1 Prerequisites

1. **Application Environment:**
   - Laravel 11.x
   - PHP 8.2+
   - MySQL/MariaDB or PostgreSQL
   - Node.js 18+ (for frontend)

2. **Database Setup:**
   - Fresh database instance
   - Run migrations: `php artisan migrate:fresh`
   - Seed test data: `php artisan db:seed`

3. **Storage Setup:**
   - Ensure storage directories are writable
   - Create symbolic link: `php artisan storage:link`

4. **Configuration:**
   - Set up `.env` file with test database credentials
   - Configure mail driver for testing (mailtrap/mailhog)
   - Set session driver to 'database' or 'file'

### 11.2 Test Execution Order

1. **Phase 1 - Authentication & Authorization**
   - User Registration
   - User Login
   - Email Verification
   - Password Reset
   - Two-Factor Authentication

2. **Phase 2 - User Management**
   - Create User (Admin)
   - Update User (Admin)
   - Delete User (Admin)

3. **Phase 3 - Admin Content Management**
   - Learning Materials
   - Quizzes
   - Announcements
   - Virtual Tours
   - Report Management
   - Forum Management
   - Feedback Management

4. **Phase 4 - Farmer Features**
   - Report Submission
   - Forum Participation
   - Feedback Submission

5. **Phase 5 - Email Notification System**
   - Announcement Email Notifications
   - Feedback Response Email Notifications
   - Email System Configuration
   - Email Integration Testing

6. **Phase 6 - Settings**
   - Profile Update
   - Password Update
   - Appearance Settings
   - 2FA Settings
   - Account Deletion

7. **Phase 7 - Security Testing**
   - Authorization checks
   - CSRF protection
   - File upload security
   - SQL injection prevention
   - XSS prevention

### 11.3 Automated Testing

The application uses **Pest PHP** for automated testing. Existing test files:

- `tests/Feature/Auth/` - Authentication tests
- `tests/Feature/Settings/` - Settings tests
- `tests/Feature/DashboardTest.php` - Dashboard tests
- `tests/Feature/ExampleTest.php` - Example tests

**Run Tests:**
```bash
php artisan test
```

**Run Specific Test:**
```bash
php artisan test --filter=RegistrationTest
```

---

## 11. Test Metrics and Success Criteria

### 11.1 Test Coverage Goals

| Module | Target Coverage |
|--------|-----------------|
| Authentication & Authorization | 100% |
| User Management | 95% |
| Admin Content Management | 90% |
| Farmer Features | 90% |
| Email Notification System | 95% |
| Settings | 95% |
| Security | 100% |

### 11.2 Success Criteria

- **Pass Rate:** >= 95% of all test cases must pass
- **Critical Bugs:** 0 critical security vulnerabilities
- **Performance:** All API endpoints respond within 2 seconds
- **Validation:** 100% of form validations working correctly
- **Authorization:** 100% of role-based access controls functioning

### 11.3 Defect Severity Levels

| Severity | Description | Example |
|----------|-------------|---------|
| Critical | System crash, data loss, security breach | SQL injection vulnerability |
| High | Major feature not working, incorrect data | Cannot create user, role bypass |
| Medium | Minor feature issue, poor UX | Validation message unclear |
| Low | Cosmetic issue, minor inconvenience | Typo in text, alignment issue |

---

## 12. Test Case Summary

### Total Test Cases by Module

| Module | Valid Cases | Invalid Cases | Boundary Cases | Total |
|--------|-------------|---------------|----------------|-------|
| Authentication & Authorization | 42 | 38 | 12 | 92 |
| User Management | 18 | 12 | 2 | 32 |
| Admin Content Management | 45 | 35 | 8 | 88 |
| Farmer Features | 28 | 22 | 6 | 56 |
| Email Notification System | 38 | 14 | 1 | 53 |
| Settings | 20 | 15 | 4 | 39 |
| Security & Middleware | 15 | 10 | 0 | 25 |
| **TOTAL** | **206** | **146** | **33** | **385** |

---

## Appendix A: Validation Rules Summary

### String Length Validations

| Field | Min Length | Max Length | Required |
|-------|------------|------------|----------|
| Name | 1 | 255 | Yes |
| Email | 1 | 255 | Yes |
| Password | 8 | - | Yes |
| Title (all) | 1 | 255 | Yes |
| Category | 1 | 255 | Varies |
| Location | 1 | 255 | Varies |
| Description | - | - | No |
| Content | 1 | - | Yes |

### File Size Validations

| File Type | Max Size | Allowed Types |
|-----------|----------|---------------|
| Profile Picture | 2MB | jpeg, png, jpg, gif |
| Report Image | 10MB | jpeg, png, jpg, gif |
| Report PDF | 10MB | pdf |
| Forum Image | 5MB | jpeg, png, jpg, gif |
| Comment Image | 5MB | jpeg, png, jpg, gif |
| Announcement Image | 5MB | jpeg, png, jpg, gif |
| Virtual Tour Thumbnail | 5MB | jpeg, png, jpg, gif |
| Learning Material PDF | 50MB | pdf |
| Learning Material Thumbnail | 2MB | image |

### Numeric Range Validations

| Field | Min | Max | Type |
|-------|-----|-----|------|
| Role | 0 | 1 | Integer |
| Passing Score | 0 | 100 | Integer |
| Time Limit | 1 | - | Integer (nullable) |
| Quiz Answer | 0 | 3 | Integer |
| Feedback Rating | 1 | 5 | Integer (nullable) |

---

## Appendix B: Rate Limiting Configuration

| Endpoint | Limit | Time Window |
|----------|-------|-------------|
| Login | 5 attempts | 1 minute |
| Password Update | 6 attempts | 1 minute |
| Report Submission | 10 requests | 1 minute |
| Forum Submission | 10 requests | 1 minute |
| Feedback Submission | 5 requests | 1 minute |

---

## Document Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-25 | System Documentation Team | Initial release |
| 1.1 | 2026-01-06 | System Documentation Team | Added Email Notification System module with 53 test cases. Updated role values (farmer role=2). Removed quiz-related tests. |

---

**End of Test Plan**
