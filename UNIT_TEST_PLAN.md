# AgriPadi System - Unit Test Plan

**Project:** AgriPadi - Agricultural Knowledge Management System
**Document Type:** Unit Testing Plan
**Version:** 1.0
**Date:** 2026-01-06
**Prepared By:** System Documentation Team

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Testing Framework & Tools](#2-testing-framework--tools)
3. [Unit Test Structure](#3-unit-test-structure)
4. [Authentication Module Tests](#4-authentication-module-tests)
5. [User Management Module Tests](#5-user-management-module-tests)
6. [Learning Material Module Tests](#6-learning-material-module-tests)
7. [Announcement Module Tests](#7-announcement-module-tests)
8. [Forum Module Tests](#8-forum-module-tests)
9. [Report Module Tests](#9-report-module-tests)
10. [Feedback Module Tests](#10-feedback-module-tests)
11. [Virtual Tour Module Tests](#11-virtual-tour-module-tests)
12. [Email Notification Module Tests](#12-email-notification-module-tests)
13. [Model Tests](#13-model-tests)
14. [Middleware Tests](#14-middleware-tests)
15. [Helper & Utility Tests](#15-helper--utility-tests)
16. [Test Coverage Goals](#16-test-coverage-goals)
17. [Test Execution Plan](#17-test-execution-plan)

---

## 1. Introduction

### 1.1 Purpose
This document outlines the unit testing strategy for the AgriPadi system. Unit tests verify individual components (methods, classes) in isolation to ensure they function correctly.

### 1.2 Scope
Unit tests will cover:
- Controller methods
- Model methods and relationships
- Middleware logic
- Mailable classes
- Request validation
- Helper functions
- Service classes

### 1.3 Testing Principles
- **Isolation**: Each test should be independent
- **Fast Execution**: Unit tests should run quickly
- **Repeatability**: Tests should produce same results every run
- **Clear Assertions**: Each test should have clear pass/fail criteria
- **Meaningful Names**: Test names should describe what they test

---

## 2. Testing Framework & Tools

### 2.1 Primary Framework
- **Pest PHP**: Primary testing framework (already configured)
- **PHPUnit**: Underlying test runner
- **Laravel Testing Tools**: Built-in testing helpers

### 2.2 Testing Database
- **SQLite in-memory database**: Fast, isolated test database
- **Database Migrations**: Run before each test suite
- **Database Transactions**: Rollback after each test

### 2.3 Additional Tools
- **Faker**: Generate test data
- **Mockery**: Mock external dependencies
- **Laravel Sanctum**: API authentication testing

### 2.4 Test File Location
```
tests/
├── Unit/
│   ├── Controllers/
│   ├── Models/
│   ├── Middleware/
│   ├── Mail/
│   └── Helpers/
└── Feature/
    ├── Auth/
    ├── Admin/
    └── Farmer/
```

---

## 3. Unit Test Structure

### 3.1 Test Naming Convention
```php
// Format: test_<method_name>_<condition>_<expected_result>
test_store_with_valid_data_creates_learning_material()
test_store_with_invalid_file_returns_validation_error()
test_destroy_with_nonexistent_id_returns_404()
```

### 3.2 Test Anatomy
```php
// Arrange - Set up test data and conditions
$user = User::factory()->create(['role' => 1]);

// Act - Execute the method being tested
$response = $this->actingAs($user)->post('/admin/learning-materials', $data);

// Assert - Verify the expected outcome
expect($response->status())->toBe(201);
expect(LearningMaterial::count())->toBe(1);
```

### 3.3 Database Setup
```php
uses(RefreshDatabase::class);
uses(WithFaker::class);
```

---

## 4. Authentication Module Tests

### Test File: `tests/Unit/Auth/AuthenticationTest.php`

#### 4.1 Registration Tests
```php
✓ test_registration_with_valid_data_creates_user()
✓ test_registration_with_duplicate_email_fails()
✓ test_registration_sets_default_farmer_role()
✓ test_registration_hashes_password()
✓ test_registration_sends_verification_email()
✓ test_registration_with_invalid_email_fails()
✓ test_registration_with_short_password_fails()
✓ test_registration_with_missing_name_fails()
```

**Key Assertions:**
- User record created in database
- Password is hashed (not plaintext)
- Role defaults to 2 (farmer)
- Verification email queued
- Validation errors returned for invalid data

#### 4.2 Login Tests
```php
✓ test_login_with_valid_credentials_authenticates_user()
✓ test_login_with_invalid_email_fails()
✓ test_login_with_wrong_password_fails()
✓ test_login_with_unverified_email_allowed()
✓ test_login_creates_session()
✓ test_login_rate_limiting_blocks_after_5_attempts()
```

**Key Assertions:**
- User authenticated successfully
- Session created
- Rate limiting enforced
- Invalid credentials rejected

#### 4.3 Email Verification Tests
```php
✓ test_email_verification_with_valid_link_verifies_user()
✓ test_email_verification_with_invalid_hash_fails()
✓ test_email_verification_fires_verified_event()
✓ test_resend_verification_sends_new_email()
```

#### 4.4 Password Reset Tests
```php
✓ test_password_reset_request_sends_email()
✓ test_password_reset_with_valid_token_updates_password()
✓ test_password_reset_with_invalid_token_fails()
✓ test_password_reset_with_expired_token_fails()
✓ test_password_reset_hashes_new_password()
```

#### 4.5 Two-Factor Authentication Tests
```php
✓ test_enable_2fa_generates_secret()
✓ test_enable_2fa_generates_recovery_codes()
✓ test_confirm_2fa_with_valid_code_enables_2fa()
✓ test_confirm_2fa_with_invalid_code_fails()
✓ test_disable_2fa_removes_secret()
✓ test_2fa_challenge_with_valid_code_authenticates()
✓ test_2fa_challenge_with_recovery_code_authenticates()
```

---

## 5. User Management Module Tests

### Test File: `tests/Unit/Admin/UserManagementTest.php`

#### 5.1 Create User Tests (Admin)
```php
✓ test_admin_can_create_user_with_valid_data()
✓ test_admin_can_create_user_with_farmer_role()
✓ test_admin_can_create_user_with_admin_role()
✓ test_admin_cannot_create_user_with_duplicate_email()
✓ test_admin_cannot_create_user_with_invalid_role()
✓ test_created_user_has_hashed_password()
```

**Key Assertions:**
- User created with correct role
- Password hashed
- Duplicate email rejected
- Invalid role rejected

#### 5.2 Update User Tests (Admin)
```php
✓ test_admin_can_update_user_name()
✓ test_admin_can_update_user_email()
✓ test_admin_can_update_user_role()
✓ test_admin_can_update_user_password()
✓ test_admin_cannot_update_own_role()
✓ test_admin_cannot_update_user_with_duplicate_email()
✓ test_update_user_with_empty_password_keeps_old_password()
```

#### 5.3 Delete User Tests (Admin)
```php
✓ test_admin_can_delete_user()
✓ test_admin_cannot_delete_self()
✓ test_delete_user_cascades_related_records()
✓ test_delete_nonexistent_user_returns_404()
```

#### 5.4 Authorization Tests
```php
✓ test_farmer_cannot_access_user_management()
✓ test_unauthenticated_user_redirected_to_login()
✓ test_admin_can_access_user_management()
```

---

## 6. Learning Material Module Tests

### Test File: `tests/Unit/Admin/LearningMaterialTest.php`

#### 6.1 Create Learning Material Tests
```php
✓ test_admin_can_create_pdf_learning_material()
✓ test_admin_can_create_video_learning_material()
✓ test_admin_can_create_material_with_thumbnail()
✓ test_admin_can_create_material_without_thumbnail()
✓ test_create_material_stores_pdf_file()
✓ test_create_material_validates_pdf_file_type()
✓ test_create_material_validates_pdf_file_size()
✓ test_create_material_validates_video_url()
✓ test_create_material_requires_title()
✓ test_create_material_requires_category()
✓ test_create_material_requires_type()
```

**Key Assertions:**
- Material created with correct type
- Files stored in correct location
- Validation rules enforced
- Database record created

#### 6.2 Update Learning Material Tests
```php
✓ test_admin_can_update_material_title()
✓ test_admin_can_update_material_description()
✓ test_admin_can_update_material_category()
✓ test_admin_can_replace_pdf_file()
✓ test_admin_can_replace_thumbnail()
✓ test_update_material_deletes_old_file_when_replaced()
✓ test_update_material_keeps_file_if_not_replaced()
```

#### 6.3 Delete Learning Material Tests
```php
✓ test_admin_can_delete_material()
✓ test_delete_material_removes_pdf_file()
✓ test_delete_material_removes_thumbnail()
✓ test_delete_material_removes_database_record()
✓ test_delete_nonexistent_material_returns_404()
```

#### 6.4 View Learning Material Tests (Farmer)
```php
✓ test_farmer_can_view_all_materials()
✓ test_farmer_can_view_single_material()
✓ test_farmer_can_download_pdf()
✓ test_farmer_cannot_create_material()
✓ test_farmer_cannot_update_material()
✓ test_farmer_cannot_delete_material()
```

---

## 7. Announcement Module Tests

### Test File: `tests/Unit/Admin/AnnouncementTest.php`

#### 7.1 Create Announcement Tests
```php
✓ test_admin_can_create_announcement()
✓ test_admin_can_create_announcement_with_image()
✓ test_admin_can_create_announcement_with_category()
✓ test_create_announcement_with_publish_now_true_sets_published_at()
✓ test_create_announcement_with_publish_now_false_keeps_null()
✓ test_create_announcement_with_publish_now_sends_email()
✓ test_create_announcement_validates_required_fields()
✓ test_create_announcement_validates_image_type()
✓ test_create_announcement_validates_image_size()
```

**Key Assertions:**
- Announcement created
- Published status set correctly
- Email sent when published
- Image stored correctly
- Validation enforced

#### 7.2 Update Announcement Tests
```php
✓ test_admin_can_update_announcement_title()
✓ test_admin_can_update_announcement_content()
✓ test_admin_can_update_announcement_category()
✓ test_admin_can_replace_announcement_image()
✓ test_update_announcement_deletes_old_image()
```

#### 7.3 Toggle Publish Tests
```php
✓ test_admin_can_toggle_announcement_to_published()
✓ test_admin_can_toggle_announcement_to_unpublished()
✓ test_toggle_to_published_sends_email()
✓ test_toggle_to_unpublished_does_not_send_email()
✓ test_toggle_sets_published_at_timestamp()
```

#### 7.4 Delete Announcement Tests
```php
✓ test_admin_can_delete_announcement()
✓ test_delete_announcement_removes_image()
✓ test_delete_announcement_removes_database_record()
```

#### 7.5 View Announcement Tests (Farmer)
```php
✓ test_farmer_can_view_published_announcements()
✓ test_farmer_cannot_view_unpublished_announcements()
✓ test_farmer_can_view_single_announcement()
```

---

## 8. Forum Module Tests

### Test File: `tests/Unit/Forum/ForumTest.php`

#### 8.1 Create Forum Post Tests
```php
✓ test_farmer_can_create_forum_post()
✓ test_farmer_can_create_post_with_image()
✓ test_farmer_can_create_post_with_category()
✓ test_create_post_sets_status_to_pending()
✓ test_create_post_validates_required_fields()
✓ test_create_post_validates_image_size()
✓ test_create_post_rate_limiting_works()
```

**Key Assertions:**
- Post created with pending status
- Image stored
- Validation enforced
- Rate limiting applied

#### 8.2 Approve/Reject Forum Tests (Admin)
```php
✓ test_admin_can_approve_forum_post()
✓ test_admin_can_reject_forum_post()
✓ test_approve_sets_status_to_approved()
✓ test_approve_sets_approved_at_timestamp()
✓ test_approve_sets_approved_by_admin_id()
✓ test_reject_sets_status_to_rejected()
✓ test_reject_saves_rejection_reason()
```

#### 8.3 Forum Comment Tests
```php
✓ test_user_can_comment_on_approved_forum()
✓ test_user_cannot_comment_on_pending_forum()
✓ test_user_cannot_comment_on_rejected_forum()
✓ test_comment_validates_content_required()
✓ test_comment_can_include_image()
```

#### 8.4 Forum Like Tests
```php
✓ test_user_can_like_forum_post()
✓ test_user_can_unlike_forum_post()
✓ test_like_increments_likes_count()
✓ test_unlike_decrements_likes_count()
✓ test_user_cannot_like_same_post_twice()
```

#### 8.5 Delete Forum Tests
```php
✓ test_user_can_delete_own_forum_post()
✓ test_user_cannot_delete_others_forum_post()
✓ test_admin_can_delete_any_forum_post()
✓ test_delete_forum_cascades_comments()
✓ test_delete_forum_cascades_likes()
```

---

## 9. Report Module Tests

### Test File: `tests/Unit/Farmer/ReportTest.php`

#### 9.1 Create Report Tests
```php
✓ test_farmer_can_create_report()
✓ test_farmer_can_create_report_with_image()
✓ test_farmer_can_create_report_with_pdf()
✓ test_create_report_validates_required_fields()
✓ test_create_report_validates_image_size()
✓ test_create_report_validates_pdf_size()
✓ test_create_report_validates_pdf_type()
✓ test_create_report_rate_limiting_works()
✓ test_create_report_sets_default_status_pending()
```

**Key Assertions:**
- Report created with pending status
- Files uploaded and stored
- Validation enforced
- Rate limiting applied

#### 9.2 Update Report Tests
```php
✓ test_farmer_can_update_own_report()
✓ test_farmer_cannot_update_others_report()
✓ test_farmer_can_replace_report_image()
✓ test_farmer_can_replace_report_pdf()
✓ test_update_report_deletes_old_files()
```

#### 9.3 Delete Report Tests
```php
✓ test_farmer_can_delete_own_report()
✓ test_farmer_cannot_delete_others_report()
✓ test_delete_report_removes_files()
✓ test_delete_report_removes_database_record()
```

#### 9.4 Admin Response Tests
```php
✓ test_admin_can_add_response_to_report()
✓ test_admin_can_update_report_status()
✓ test_admin_response_validates_required_fields()
✓ test_admin_response_sets_status_to_under_review()
✓ test_admin_response_sets_status_to_resolved()
```

---

## 10. Feedback Module Tests

### Test File: `tests/Unit/Farmer/FeedbackTest.php`

#### 10.1 Create Feedback Tests
```php
✓ test_farmer_can_submit_feedback()
✓ test_farmer_can_submit_feedback_with_rating()
✓ test_farmer_can_submit_feedback_with_feature()
✓ test_feedback_validates_required_fields()
✓ test_feedback_validates_rating_range()
✓ test_feedback_validates_type_enum()
✓ test_feedback_rate_limiting_works()
✓ test_feedback_auto_categorizes_based_on_rating()
```

**Key Assertions:**
- Feedback created
- Rating validated (1-5)
- Type auto-set based on rating
- Rate limiting enforced

#### 10.2 Admin Notes Tests
```php
✓ test_admin_can_add_notes_to_feedback()
✓ test_admin_notes_sends_email_to_user()
✓ test_admin_notes_marks_feedback_as_read()
✓ test_admin_notes_validates_required_field()
```

---

## 11. Virtual Tour Module Tests

### Test File: `tests/Unit/Admin/VirtualTourTest.php`

#### 11.1 Create Virtual Tour Tests
```php
✓ test_admin_can_create_virtual_tour()
✓ test_admin_can_create_tour_with_thumbnail()
✓ test_create_tour_validates_required_fields()
✓ test_create_tour_validates_url_format()
✓ test_create_tour_validates_tour_type()
✓ test_create_tour_validates_thumbnail_size()
```

#### 11.2 Update Virtual Tour Tests
```php
✓ test_admin_can_update_tour_details()
✓ test_admin_can_update_tour_url()
✓ test_admin_can_replace_thumbnail()
✓ test_update_tour_deletes_old_thumbnail()
```

#### 11.3 Delete Virtual Tour Tests
```php
✓ test_admin_can_delete_virtual_tour()
✓ test_delete_tour_removes_thumbnail()
✓ test_delete_tour_removes_database_record()
```

---

## 12. Email Notification Module Tests

### Test File: `tests/Unit/Mail/EmailNotificationTest.php`

#### 12.1 Announcement Email Tests
```php
✓ test_new_announcement_email_is_sent_to_verified_farmers()
✓ test_new_announcement_email_not_sent_to_unverified_farmers()
✓ test_new_announcement_email_not_sent_to_admin()
✓ test_announcement_email_contains_correct_subject()
✓ test_announcement_email_contains_title()
✓ test_announcement_email_contains_content()
✓ test_announcement_email_contains_category()
✓ test_announcement_email_embeds_logo()
✓ test_announcement_email_embeds_image()
✓ test_announcement_email_contains_dashboard_link()
```

**Key Assertions:**
- Email sent to correct recipients
- Email content correct
- Images embedded as base64
- Links point to correct URLs

#### 12.2 Feedback Response Email Tests
```php
✓ test_feedback_response_email_sent_when_admin_adds_notes()
✓ test_feedback_response_email_contains_user_name()
✓ test_feedback_response_email_contains_original_feedback()
✓ test_feedback_response_email_contains_admin_notes()
✓ test_feedback_response_email_contains_rating_stars()
✓ test_feedback_response_email_contains_feature()
✓ test_feedback_response_email_not_sent_if_no_email()
```

#### 12.3 Email Mailable Tests
```php
✓ test_new_announcement_mailable_builds_correctly()
✓ test_new_announcement_mailable_has_correct_view()
✓ test_new_announcement_mailable_has_correct_subject()
✓ test_feedback_response_mailable_builds_correctly()
✓ test_feedback_response_mailable_has_correct_view()
✓ test_feedback_response_mailable_has_correct_subject()
```

---

## 13. Model Tests

### 13.1 User Model Tests
**File:** `tests/Unit/Models/UserTest.php`

```php
✓ test_user_has_fillable_attributes()
✓ test_user_hides_password_in_json()
✓ test_user_hides_remember_token_in_json()
✓ test_user_casts_email_verified_at_to_datetime()
✓ test_user_has_forums_relationship()
✓ test_user_has_comments_relationship()
✓ test_user_has_reports_relationship()
✓ test_user_has_feedback_relationship()
✓ test_user_is_admin_returns_true_for_admin()
✓ test_user_is_admin_returns_false_for_farmer()
✓ test_user_is_farmer_returns_true_for_farmer()
✓ test_user_is_farmer_returns_false_for_admin()
```

### 13.2 Learning Material Model Tests
**File:** `tests/Unit/Models/LearningMaterialTest.php`

```php
✓ test_learning_material_has_fillable_attributes()
✓ test_learning_material_casts_created_at_to_datetime()
✓ test_learning_material_is_pdf_returns_true_for_pdf()
✓ test_learning_material_is_video_returns_true_for_video()
✓ test_learning_material_file_url_returns_correct_path()
✓ test_learning_material_thumbnail_url_returns_correct_path()
```

### 13.3 Announcement Model Tests
**File:** `tests/Unit/Models/AnnouncementTest.php`

```php
✓ test_announcement_has_fillable_attributes()
✓ test_announcement_casts_published_at_to_datetime()
✓ test_announcement_is_published_returns_true_when_published()
✓ test_announcement_is_published_returns_false_when_draft()
✓ test_announcement_scope_published_filters_correctly()
✓ test_announcement_image_url_returns_correct_path()
```

### 13.4 Forum Model Tests
**File:** `tests/Unit/Models/ForumTest.php`

```php
✓ test_forum_has_fillable_attributes()
✓ test_forum_belongs_to_user()
✓ test_forum_has_many_comments()
✓ test_forum_has_many_likes()
✓ test_forum_is_approved_returns_true_when_approved()
✓ test_forum_is_pending_returns_true_when_pending()
✓ test_forum_is_rejected_returns_true_when_rejected()
✓ test_forum_scope_approved_filters_correctly()
✓ test_forum_scope_pending_filters_correctly()
✓ test_forum_likes_count_attribute_works()
```

### 13.5 Report Model Tests
**File:** `tests/Unit/Models/ReportTest.php`

```php
✓ test_report_has_fillable_attributes()
✓ test_report_belongs_to_user()
✓ test_report_is_pending_returns_true_when_pending()
✓ test_report_is_under_review_returns_true_when_under_review()
✓ test_report_is_resolved_returns_true_when_resolved()
✓ test_report_scope_by_status_filters_correctly()
```

### 13.6 Feedback Model Tests
**File:** `tests/Unit/Models/FeedbackTest.php`

```php
✓ test_feedback_has_fillable_attributes()
✓ test_feedback_belongs_to_user()
✓ test_feedback_casts_is_read_to_boolean()
✓ test_feedback_is_positive_returns_true_for_positive_type()
✓ test_feedback_is_improvement_returns_true_for_improvement_type()
✓ test_feedback_scope_unread_filters_correctly()
```

---

## 14. Middleware Tests

### Test File: `tests/Unit/Middleware/MiddlewareTest.php`

#### 14.1 Role Middleware Tests
```php
✓ test_admin_middleware_allows_admin_users()
✓ test_admin_middleware_blocks_farmer_users()
✓ test_admin_middleware_redirects_unauthenticated_users()
✓ test_farmer_middleware_allows_farmer_users()
✓ test_farmer_middleware_allows_admin_users()
✓ test_farmer_middleware_blocks_unauthenticated_users()
```

#### 14.2 Verified Middleware Tests
```php
✓ test_verified_middleware_allows_verified_users()
✓ test_verified_middleware_redirects_unverified_users()
```

#### 14.3 Throttle Middleware Tests
```php
✓ test_throttle_middleware_allows_requests_within_limit()
✓ test_throttle_middleware_blocks_requests_over_limit()
✓ test_throttle_middleware_resets_after_time_window()
```

---

## 15. Helper & Utility Tests

### Test File: `tests/Unit/Helpers/HelperTest.php`

```php
✓ test_file_upload_helper_stores_file_correctly()
✓ test_file_upload_helper_generates_unique_filename()
✓ test_file_delete_helper_removes_file()
✓ test_image_resize_helper_maintains_aspect_ratio()
✓ test_format_date_helper_formats_correctly()
```

---

## 16. Test Coverage Goals

### 16.1 Coverage Targets

| Component | Target Coverage | Priority |
|-----------|----------------|----------|
| Controllers | 90% | High |
| Models | 95% | High |
| Middleware | 100% | Critical |
| Mailables | 90% | High |
| Helpers | 85% | Medium |
| Requests (Validation) | 95% | High |

### 16.2 Critical Paths
- Authentication flow: **100% coverage required**
- Authorization checks: **100% coverage required**
- File upload/delete: **95% coverage required**
- Email sending: **90% coverage required**

---

## 17. Test Execution Plan

### 17.1 Running Tests

#### Run All Unit Tests
```bash
php artisan test --testsuite=Unit
```

#### Run Specific Test File
```bash
php artisan test tests/Unit/Auth/AuthenticationTest.php
```

#### Run Tests with Coverage
```bash
php artisan test --coverage --min=80
```

#### Run Parallel Tests (Fast)
```bash
php artisan test --parallel
```

### 17.2 CI/CD Integration

**GitHub Actions Workflow:**
```yaml
name: Unit Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: 8.2
      - name: Install Dependencies
        run: composer install
      - name: Run Unit Tests
        run: php artisan test --testsuite=Unit
      - name: Generate Coverage Report
        run: php artisan test --coverage --min=80
```

### 17.3 Test Execution Order

1. **Phase 1: Models** - Test models first as foundation
2. **Phase 2: Middleware** - Test authorization/authentication
3. **Phase 3: Controllers** - Test business logic
4. **Phase 4: Mailables** - Test email functionality
5. **Phase 5: Helpers** - Test utility functions

### 17.4 Pre-Commit Hooks

**Setup PHPUnit Pre-Commit:**
```bash
# .git/hooks/pre-commit
#!/bin/sh
php artisan test --testsuite=Unit
if [ $? -ne 0 ]; then
    echo "Unit tests failed. Commit aborted."
    exit 1
fi
```

---

## 18. Test Data Management

### 18.1 Factories

**User Factory:**
```php
User::factory()->create(['role' => 1]); // Admin
User::factory()->create(['role' => 2]); // Farmer
User::factory()->verified()->create(); // Verified email
```

**Learning Material Factory:**
```php
LearningMaterial::factory()->pdf()->create();
LearningMaterial::factory()->video()->create();
LearningMaterial::factory()->withThumbnail()->create();
```

**Announcement Factory:**
```php
Announcement::factory()->published()->create();
Announcement::factory()->draft()->create();
Announcement::factory()->withImage()->create();
```

**Forum Factory:**
```php
Forum::factory()->approved()->create();
Forum::factory()->pending()->create();
Forum::factory()->rejected()->create();
```

### 18.2 Seeders for Testing
```php
// TestDatabaseSeeder.php
- Admin user (admin@gmail.com / 123456789)
- 10 Farmer users
- 20 Learning materials (mix of PDF and video)
- 15 Announcements
- 30 Forum posts
- 50 Comments
- 10 Reports
- 20 Feedback entries
```

---

## 19. Mocking & Stubbing

### 19.1 File Storage Mock
```php
Storage::fake('public');
// Test file upload
$file = UploadedFile::fake()->image('test.jpg');
// Assert file was stored
Storage::disk('public')->assertExists('path/to/file.jpg');
```

### 19.2 Mail Mock
```php
Mail::fake();
// Trigger email
// Assert email was sent
Mail::assertSent(NewAnnouncementMail::class);
Mail::assertQueued(FeedbackResponseMail::class);
```

### 19.3 Event Mock
```php
Event::fake();
// Trigger event
// Assert event was dispatched
Event::assertDispatched(Verified::class);
```

### 19.4 Queue Mock
```php
Queue::fake();
// Queue job
// Assert job was queued
Queue::assertPushed(SendEmailJob::class);
```

---

## 20. Test Maintenance

### 20.1 Regular Review
- Review and update tests monthly
- Remove obsolete tests
- Add tests for new features
- Refactor duplicate test code

### 20.2 Test Refactoring
- Extract common setup to helper methods
- Use traits for shared test logic
- Keep tests DRY (Don't Repeat Yourself)

### 20.3 Documentation
- Document complex test scenarios
- Add comments for non-obvious assertions
- Maintain this test plan document

---

## Appendix A: Test Statistics Summary

### Expected Test Count

| Module | Unit Tests | Coverage Target |
|--------|-----------|-----------------|
| Authentication | 35 | 100% |
| User Management | 25 | 95% |
| Learning Materials | 30 | 90% |
| Announcements | 25 | 90% |
| Forums | 40 | 90% |
| Reports | 25 | 90% |
| Feedback | 20 | 90% |
| Virtual Tours | 15 | 85% |
| Email Notifications | 25 | 95% |
| Models | 60 | 95% |
| Middleware | 15 | 100% |
| Helpers | 10 | 85% |
| **TOTAL** | **325** | **92%** |

---

## Appendix B: Common Testing Patterns

### Pattern 1: Test CRUD Operations
```php
test_can_create_resource()
test_can_read_resource()
test_can_update_resource()
test_can_delete_resource()
test_validation_rules_enforced()
```

### Pattern 2: Test Authorization
```php
test_authenticated_user_can_access()
test_unauthenticated_user_cannot_access()
test_admin_can_access()
test_farmer_cannot_access()
test_user_can_access_own_resource()
test_user_cannot_access_others_resource()
```

### Pattern 3: Test Validation
```php
test_validates_required_fields()
test_validates_field_format()
test_validates_field_length()
test_validates_unique_constraint()
test_validates_file_type()
test_validates_file_size()
```

---

**End of Unit Test Plan**

**Next Steps:**
1. Set up test database configuration
2. Create factory classes
3. Write tests following this plan
4. Run tests and achieve coverage goals
5. Integrate into CI/CD pipeline
