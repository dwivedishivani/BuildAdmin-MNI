# Implementation Plan: MNI Internal Members App — Timeline & Content Management

## Executive Summary & System Philosophy

MNI (Mission for Networking & Integrity) is a private, curated business community. The Home screen functions as an **admin-controlled business communication, bulletin, and opportunity-sharing timeline**.

### Core Non-Negotiables
1. **Admin Exclusive Timeline Publishing**: Members **cannot** publish directly to the timeline under any circumstances. Only authorized MNI administrators create, approve, schedule, edit, archive, and publish posts.
2. **Member Requirement Submissions**: Members can submit business requirements, requests for vendors, opportunities, offers, and announcements through a structured submission workflow. These enter the admin queue with status `Pending Approval`. Members can track status, see reviewer notes, and revise if changes are requested.
3. **Flexible Content Architecture**: Posts support three formats without empty placeholders or rigid card heights:
   - **Image-based posts**: Prominently displayed creative with optional title/caption, tagged network member, and `Expand Image` modal.
   - **Text-based posts**: Clear typography, opportunity category badge, full readable description, and NO empty image region.
   - **Image + Text posts**: Combined creative and editorial text.
4. **Rich Post Actions**:
   - **Info**: Opens a modal with the complete profile of the tagged network member and their business (avatar initials, name, membership tenure, business sector, city, verified badge, bio, and associated bulletin reference).
   - **Request**: Opens a contact request modal with a custom note/agenda textarea before recording a contact request into `My Requests`.
   - **Expand Image**: Available exclusively on posts with image creatives, opening full-resolution lightbox viewer.
5. **Top Promotional Ad Carousel**:
   - Curated 2–3 sponsored announcement cards at the top of the Home feed with automatic 4-second rotation, touch swipe navigation, dot indicators, and modal details.
6. **Integrated Navigation & MNI Tabs**:
   - **Home (Timeline)**: Header with MNI branding, member greeting, notification bell, ad carousel, filter chips, and rich timeline feed.
   - **Requests (Track & Follow-up)**: Contact requests track status (`Pending`, `Contact Received`, `Follow-up Required`, `Outcome Recorded`) and include the structured business outcome questionnaire.
   - **Refer & Earn**: Member referral submission form and rewards breakdown.
   - **Profile**: Member account information, membership badge, member ID, and sign-in status.
   - **Admin Management Studio**: In-app workspace for administrators to review member submissions, approve/reject/request changes, compose new posts (with live mobile preview), and manage banner ads.

---

## Visual Design & Design System Standards

Adhering strictly to the MNI Design System tokens extracted from the style guide:

### Color Tokens
- **MNI Blue**: `#215CE5` (Primary brand accent, main CTA buttons, active tab indicators, focus rings)
- **MNI Deep Navy**: `#102C60` (App hero panels, member identity headers, high-contrast dark cards)
- **MNI Ink**: `#12233E` (Primary typography, display titles, heavy text)
- **MNI Background**: `#F3F6F8` / `#F8FAFC` (Soft neutral canvas background)
- **MNI Pale Surface**: `#EAF0FC` (Secondary action buttons, subtle pill badges, active states)
- **MNI Muted**: `#687B92` (Subtitles, metadata, timestamps, input placeholders)
- **MNI White**: `#FFFFFF` (Card surfaces, modals, dialog sheets, primary text on navy)
- **MNI Green**: `#167C60` (Verified member badges, `Contact received` status pills)
- **MNI Amber / Warning**: `#D97706` (`Pending Approval`, `Changes Requested` alerts)

### Typography & Spacing Hierarchy
- **Font**: Inter / system geometric sans-serif
- **Scale**: Display 34px, Screen Title 28px, Section Heading 18px, Body 14px, Labels & Actions 13px, Caption & Metadata 11px
- **Spacing Rhythm**: 4px, 8px, 12px, 16px, 20px, 24px, 32px; Screen gutter 20px, Card inset 16px, Section gap 24px
- **Corner Radii**: Buttons & Inputs 12px, Post artwork 16px, Content cards 20px, Feature panels 24px

---

## Backend & Data Modeling (Payload CMS)

We will configure durable Payload collections with strict role-based access rules:

### 1. `Members` Collection (`src/collections/Members.ts`)
Represents registered MNI network members:
- `fullName` (text, required)
- `email` (email, required, unique)
- `phone` (text, required)
- `city` (text, required)
- `memberId` (text, required, e.g., "MNI-002184")
- `memberSince` (text, e.g., "October 2024")
- `businessName` (text, required)
- `businessCategory` (text, required, e.g., "Brand & Design Partnership", "Commercial Print & Packaging")
- `bio` (textarea, required)
- `isVerified` (checkbox, default true)
- `avatarInitials` (text, e.g., "SD", "AM", "RS")

### 2. `Posts` Collection (`src/collections/Posts.ts`)
The admin-published timeline items:
- `title` (text, required)
- `postType` (select: `image_only`, `text_only`, `image_text`, required)
- `category` (select: `Opportunity`, `Requirement`, `Announcement`, `Promotion`, `Member Spotlight`, `Community Meetup`)
- `content` (textarea, required for text-only and image_text)
- `image` (upload relation to `media`, optional for text-only)
- `taggedMember` (relationship to `members`, optional)
- `publishedAt` (date)
- `isPublished` (checkbox, default true)
- `isArchived` (checkbox, default false)
- `displayOrder` (number, default 0)
- `badgeText` (text, e.g., "BUILT BY MEMBERS", "OPPORTUNITY", "MNI MEETUPS / NOVEMBER")

### 3. `Submissions` Collection (`src/collections/Submissions.ts`)
Member-submitted business requirements and proposals:
- `submittedBy` (relationship to `members`, required)
- `title` (text, required)
- `category` (select: `Business Requirement`, `Vendor / Supplier Needed`, `Business Opportunity`, `Offer / Announcement`)
- `description` (textarea, required)
- `supportingImage` (upload relation to `media`, optional)
- `status` (select: `pending`, `changes_requested`, `approved`, `rejected`, `published`, default `pending`)
- `adminFeedback` (textarea, optional)
- `associatedPost` (relationship to `posts`, optional)

### 4. `ContactRequests` Collection (`src/collections/ContactRequests.ts`)
Member requests for contact details initiated via post `Request` action:
- `requestedBy` (relationship to `members`, required)
- `post` (relationship to `posts`, required)
- `targetMember` (relationship to `members`, required)
- `agendaNote` (textarea, optional, entered by member during request)
- `status` (select: `pending`, `contact_received`, `followup_required`, `outcome_recorded`, default `pending`)
- `followUp` (group:
  - `calledContact` (boolean)
  - `conversationTookPlace` (boolean)
  - `businessGenerated` (boolean)
  - `gaveBusiness` (boolean)
  - `remarks` (textarea)
  - `recordedAt` (date)
)

### 5. `Banners` Collection (`src/collections/Banners.ts`)
The 2–3 Home top promotional carousel banners:
- `title` (text, required)
- `subtitle` (text, required)
- `category` (text, e.g., "SPONSORED", "COMMUNITY MEETUP", "FEATURED PARTNER")
- `image` (upload relation to `media`, required)
- `actionLabel` (text, default "Learn more")
- `actionLink` (text)
- `isActive` (checkbox, default true)
- `sortOrder` (number, default 0)

---

## Application Architecture & Component Hierarchy

```
src/
├── app/
│   └── (frontend)/
│       ├── layout.tsx                # MNI global font, meta, viewport, Tailwind setup
│       ├── page.tsx                  # Home timeline, Ad Carousel, Feed, Modal orchestrator
│       ├── requests/
│       │   └── page.tsx              # Requests & Contact Tracking with outcome form
│       ├── refer/
│       │   └── page.tsx              # Refer & Earn screen with rewards tracker
│       ├── profile/
│       │   └── page.tsx              # Member Profile and sign-in switcher
│       ├── admin/
│       │   └── page.tsx              # Admin Timeline Publishing & Submission Review Studio
│       └── submit/
│           └── page.tsx              # Member Requirement Submission screen
├── components/
│   ├── layout/
│   │   ├── AppHeader.tsx             # MNI / MEMBERS logo mark, status, notification bell
│   │   ├── BottomNav.tsx             # Fixed mobile tab bar: Home, Requests, Refer & Earn, Profile
│   │   └── RoleSwitcher.tsx          # Floating toggle: Member View (Shivani) vs Admin View
│   ├── timeline/
│   │   ├── AdCarousel.tsx            # 2-3 banner auto-rotating sponsored carousel
│   │   ├── TimelineCard.tsx          # Dynamic rendering for image, text, and hybrid posts
│   │   ├── PostActions.tsx           # Info, Request, Expand Image button group
│   │   └── FilterChips.tsx           # All, Opportunities, Requirements, Announcements
│   ├── modals/
│   │   ├── MemberInfoModal.tsx       # Full intro of tagged candidate & business in dialog
│   │   ├── ContactRequestModal.tsx   # Request modal with custom requirements / agenda textarea
│   │   ├── ImageViewerModal.tsx      # Fullscreen image lightbox modal
│   │   └── SubmissionModal.tsx       # Quick submit requirement modal
│   └── admin/
│       ├── SubmissionReviewQueue.tsx # Approve, Reject, Request Changes with member feedback
│       ├── PostComposer.tsx          # Text-only, Image-only, Image+Text composer with mobile preview
│       └── BannerManager.tsx         # Manage the 2-3 top banner advertisements
├── lib/
│   ├── payload.ts                    # Payload query client utilities
│   └── seed-data.ts                  # High-fidelity realistic initial datasets
└── collections/
    ├── Members.ts
    ├── Posts.ts
    ├── Submissions.ts
    ├── ContactRequests.ts
    └── Banners.ts
```

---

## User Flows & Edge Cases

### 1. Home Feed & Ad Carousel
- **Ad Carousel**: Displays 2–3 banners with a 4-second auto-timer. User touch-drag or click on dot indicators smoothly slides between banners. Pauses on hover/press.
- **Dynamic Post Rendering**:
  - Image posts render high-aspect promotional creatives (16px border-radius, clean overlay tags, no empty card padding).
  - Text posts render crisp typography, category pill, and clear hierarchy with NO image container.
  - Image + Text posts render the creative banner above readable copy.

### 2. Post Actions & Interactive Dialogs
- **Info Button**:
  - Clicking `Info` opens `MemberInfoModal`.
  - Shows tagged candidate's avatar initials, verified badge, full name, business name, category, location, and comprehensive bio.
  - Includes a direct "Request [Name]'s Contact" CTA inside the modal.
- **Request Button**:
  - Clicking `Request` opens `ContactRequestModal`.
  - As requested: *"when user is requesting a contact only dialogue will be open which will ask in a text area if user wants to add anything or wants to add any requirements or agenda"*.
  - Member can add an optional agenda note or specific requirement.
  - Submitting saves the request to Payload and immediately transitions the post's CTA to "Requested" with a green checkmark confirmation.
  - The request is immediately listed in the member's `Requests` tab.
- **Expand Image Button**:
  - Visible **only** on posts with images.
  - Opens `ImageViewerModal` with high-resolution image, dark backdrop, zoom capability, and dismiss button. Text-only posts completely omit this button.

### 3. Requirement Submission & Admin Review Workflow
- **Member Submission**:
  - Member navigates to Submit Requirement (`Send it to MNI. Not to the timeline.`).
  - Inputs requirement title, category, full description, and optional supporting image.
  - Explanatory card informs member: *"Only MNI Admin can create and publish timeline posts. Submissions are reviewed before publication."*
  - On submission, status is set to `Pending Approval`.
- **Admin Review Queue**:
  - Admin views all pending submissions.
  - Admin can:
    - **Approve & Publish**: Converts submission into a published timeline post with optional editorial editing of title/copy.
    - **Request Changes**: Provides specific feedback to the member.
    - **Reject**: Archives submission with feedback.
- **Member Status Tracking**:
  - Member sees submission badge (`Pending Approval`, `Changes Requested`, `Published`).
  - If changes requested, member can edit and resubmit.

### 4. Contact Follow-up & Business Outcome Form
- Members track pending vs received contacts in the `Requests` tab.
- When contacts are marked received, an `Add follow-up` button opens the structured outcome questionnaire:
  - Did you call the contact? (Yes / No)
  - Did a conversation take place? (Yes / No)
  - Was business generated? (Yes / No)
  - Did you give business? (Gave business / Did not give business)
  - Remarks / notes.
- Saving updates the request record and marks it as `Business outcome recorded`.

---

## Verification Strategy & Acceptance Criteria

1. **Bootstrap & Build**:
   - `figma make verify-bootstrap` passes without error.
   - Next.js and Payload compile cleanly without TypeScript errors.
2. **Permission Boundary**:
   - Members cannot publish directly to the timeline; client-side and server-side boundaries enforce approval.
3. **Carousel & Timeline**:
   - Carousel rotates through 2–3 banners with indicators and touch support.
   - Timeline displays text-only, image-only, and image+text cards with proper hierarchy.
   - Text posts have no blank image box; Expand Image is hidden on text posts.
4. **Modals & Dialogs**:
   - Clicking `Info` opens candidate introduction and business modal.
   - Clicking `Request` opens agenda/requirements textarea dialog.
   - Submitting contact request logs into `ContactRequests` and appears in the Requests tab.
   - `Expand Image` opens full-screen image modal.
5. **Admin Workflow**:
   - Reviewing pending submission allows Approve, Reject, or Request Changes.
   - Publishing an approved submission or composing a new post immediately renders it on the live timeline.
   - Admins can manage the top 2–3 promotional banners.
