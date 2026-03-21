# Plan Brief

Build a retryable import pipeline for CSV customer uploads.

Requirements:

- The web app accepts a CSV upload from an admin page.
- Upload should store the raw file, enqueue background processing, and return quickly.
- The importer validates each row and writes valid customers to the database.
- Invalid rows should be collected into a failure report without stopping the full import.
- Duplicate imports should not create duplicate customers.
- Admins need a status page that shows queued, running, succeeded, or failed.
- We need a clear test plan before implementation.
