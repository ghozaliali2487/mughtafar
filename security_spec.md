# Security Specification - Mughtafar App

## 1. Data Invariants
- Only authenticated admins can write data.
- Public can read all data (members, articles, quotes, etc.).
- Admin identity is verified via email `ghozaliali2487@gmail.com`.
- Every document ID must be valid.

## 2. The "Dirty Dozen" Payloads
1. **Unauthenticated Write**: Attempt to add a member without being logged in. (Expected: Denied)
2. **Non-Admin Write**: Authenticated as a non-admin user trying to post an article. (Expected: Denied)
3. **Identity Spoofing**: Admin trying to change their own role or other system fields. (N/A here as we check email directly).
4. **Massive ID Injection**: Attempt to create a document with a 2MB string as ID. (Expected: Denied by `isValidId`)
5. **Schema Violation**: Article without a title. (Expected: Denied by `isValidArtikel`)
6. **Type Poisoning**: Sending an integer for a member's name. (Expected: Denied by `isValidAnggota`)
7. **Resource Exhaustion**: Sending 10MB of data in a quote. (Expected: Denied by size checks)
8. **Broken Relational Integrity**: Creating a photo with a non-existent albumId (N/A check here as the rule doesn't enforce existence yet, but will check auth).
9. **Field Injection**: Adding `isVerified: true` to a member document when only public fields are allowed. (Expected: Denied by `affectedKeys` check on update)
10. **Immutable Field Change**: Trying to change `createdAt`. (Expected: Denied)
11. **Client-Side Query Bypass**: Attempting to list all settings if it were private. (Expected: Works for public as intended, but restricted write).
12. **Malicious Date String**: Sending "not a date" as article date.

## 3. Test Runner
A `firestore.rules.test.ts` would be used to verify these.
