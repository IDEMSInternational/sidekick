# Privacy Policy for Sidekick Extension

This Privacy Policy describes how the Sidekick Extension accesses, uses, stores, and protects Google user data. The Sidekick Extension helps users build structured applications within the Open-App-Builder by allowing synchronization and formatting between Google Docs and Sheets.

---

## 1. Google User Data Access

The Sidekick Extension requests the following Google API scopes:

- `https://www.googleapis.com/auth/script.container.ui` – To display the extension’s UI components in the Google Docs sidebar.
- `https://www.googleapis.com/auth/spreadsheets` – To create and update Google Sheets for structuring and syncing data.
- `https://www.googleapis.com/auth/documents.currentonly` – To read and update the currently open Google Doc in the user’s session only.
- `https://www.googleapis.com/auth/drive.readonly` – To read file metadata (e.g. images, video, audio) that users reference in templates, and display thumbnails or previews where applicable.

These permissions are only requested with the user’s explicit consent, and are limited to supporting the app’s core functionality.

---

## 2. Use of Google User Data

The Sidekick Extension uses Google user data exclusively to provide and enhance its features:

- Create and structure Google Sheets using data from Google Docs.
- Synchronize content between Google Docs and Sheets.
- Preview referenced files (images/audio/video) from Drive using read-only access.
- Display UI elements to guide users within the document interface.

**No data is shared with third parties or used for advertising, analytics, or tracking.**

---

## 3. Storage of Google User Data

The extension **does not store or transmit** any Google user data to external servers.

All data remains within the user’s own Google Workspace account (Google Docs, Sheets, and Drive). The app only acts as a conduit — transforming or syncing data **within** the user’s environment.

---

## 4. Data Protection and Security

To ensure user privacy and data security, the Sidekick Extension follows these practices:

- **OAuth 2.0 Authorization** – Access is granted securely using Google’s OAuth 2.0 protocol.
- **Least Privilege Principle** – Only the minimal set of permissions is requested.
- **Scoped Document Access** – For Docs, only the currently open document is accessed (`documents.currentonly`).
- **No External Servers** – No user data is transmitted outside Google’s environment.
- **Drive Read-Only** – Access to Drive is strictly read-only for verifying file metadata and displaying thumbnails.
- **No Human Access** – Developers and administrators do not access user data.
- **No Analytics or Tracking** – The extension does not collect usage data, personal information, or behavior analytics.

---

## 5. Compliance with Google API Services User Data Policy

The Sidekick Extension fully complies with the [Google API Services User Data Policy](https://developers.google.com/terms/api-services-user-data-policy), including the **Limited Use** requirements:

- User data is used only to provide and improve user-facing features.
- Data is never transferred to third parties.
- No data is used for advertising, marketing, or profiling.

---

## 6. Changes and Consent

By using the Sidekick Extension, you agree to this Privacy Policy. If this policy changes, updates will be posted on our website. Continued use of the extension implies acceptance of the revised terms.
