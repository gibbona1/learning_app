# learning_app

TODOs:
- [ ] CRUD, API endpoints and React Components
    - [ ] birdCalls 
        - [x] get all
        - [x] search by id
        - [x] get specific (level, class)
        - [ ] Get mnemonics, work on formatting and how best to display
        - [ ] Open database of bird images (possible hint)
        - [ ] mnemonic, scientific name, other metadata and info fields
        - [ ] birdCall page (locked/unlocked level etc, link to lesson, similar, search by metadata)
        - [ ] popout modal for each birdcall
        - [ ] synonyms, different localities and variants
        - [ ] don't double up level ups/downs in same session
    - [x] users 
        - [x] get all
        - [x] search by id
        - [x] get specific (username, email)
        - [x] update (e.g. level)
        - [x] delete 
        - [x] level up
        - [x] levelData field to append level started dates
    - [x] userLevel 
        - [x] get all
        - [x] search by id
        - [x] get specific (level number)
    - [x] item
        - [x] get all
        - [x] search by id
        - [x] get specific (userId, birdCallId, level)
        - [x] create (all items for new level for user)
        - [x] level up
        - [x] update (level, reviewdate etc) 
            - [x] do if lesson/review complete
        - [x] delete
            - [x] remake lesson if deleted/reset
        - [x] count how many due for review now, in next hour, next 24 hours.
    - [x] itemLevel
        - [x] get all
        - [x] get by id
        - [x] get specific (num, name)
    - [x] lesson 
        - [x] in UI, [display audio, spectrogram, metadata]
        - [x] make for all current level items when levelup
        - [x] move item from level 0 to 1 when done and delete lesson
        - [x] create, get all, get by id, delete
        - [x] make lesson page
        - [x] lesson unlock
        - [x] recreate if item reset
        - [x] don't create if pair already exists
    - [ ] reviewSession (combines all reviews ready for review)
        - [x] UI [display audio, spectrogram, metadata]
        - [x] text box for answer
        - [x] disable next review button until answered
        - [x] prev review, disable if first etc
        - [ ] multiple choice (hint)
        - [x] create new review whether correct or incorrect with associated times etc.
        - [ ] only do at end of session (pick small block size e.g. 10)
        - [ ] spectrogram, audio, scientific name could be could be different testing grounds, like reading + meaning in WK
        - [ ] stats for session (temporary or store)
    - [ ] ungradedSession (select some items to review, no change to item level/activity)
        - [ ] pass items to reviewSession page
    - [ ] classroom (connects teacher and students)
        - [ ] Lesson/course creator (teacher, admin) probably just permissions based
        - [x] Assign students to teacher
        - [x] Add classroom ID to user in create and addLearnerToClass
        - [ ] Teacher view (correct/incorrect items)
        - [ ] group stats
        - [ ] class tests (create, push/assign, store results)
    - [ ] general components
        - [x] Navigation tabs/buttons
        - [x] Connect to AWS to load sounds
        - [x] make sure user can't go over max level, same with item. need to have way to make date blank
        - [ ] Modularize common scripts
        - [ ] Modern styling
        - [x] carry User ID through session
        - [x] login/logout functionality
    - [ ] error handling
        - [ ] users with no lessons, items with empty activity, etc
        - [x] don't levelup if lesson exists for that item
    - [x] Activity/history field of Item
        - [x] name: [started/lesson-complete, level-up/correct level-down/incorrect, complete, reset], date.
        - [x] calculate stats
        - [x] plot levelups/downs, lessons completed
    - [x] Helper document with example API calls
    - [ ] faker for creating users, lessons, progress etc
        - [ ] need to make a random array of activity with levelups, downs, resets and iteravely call API, check actual item level against expected level
    - [ ] tokenized (maybe JWT) api calls for security

- [ ] Stats:
    - [x] upcoming reviews by hour next 24 hours
    - [x] show activity (last 24 hours, average per hour in lifetime)
        - [x] review count past 24 hours
    - [x] overall num attempts, num correct/incorrect, % correct
    - [ ] when different review types, accuracy by type
    - [x] critical items (pick those with accuracy below a certain threshold)
    - [x] Level progression timing
    - [x] projections for finishing level
    - [ ] error handling e.g. with empty activity
    - [x] start date, time spent on app
    - [x] streak/consistency (current, longest)
    - [ ] retention metric(s)
    - [x] last year activity (like GitHub contribution map)
    - [x] num items at max level
    - [ ] coverage of irish birds, bto pipeline, xenocanto etc (charts by level)
    - [ ] current level, level progress

- [ ] Testing
    - [ ] https://enzymejs.github.io/enzyme/
    - [ ] Backend (Node.js/Express API)
        - [ ] Unit Tests:
            - [ ] Use Jest for testing individual functions and logic.
            - [ ] Create mocks and stubs for external services and databases to isolate unit tests.
        - [ ] Route/Integration Tests:
            - [ ] Use Supertest with Jest to test your Express routes.
            - [ ] Write tests to make HTTP requests to your API endpoints and assert the responses.
        - [ ] Database Seed Scripts:
            - [ ] Create scripts to seed your database with dummy data before tests.
            - [ ] Write cleanup scripts to remove test data after testing.
        - [ ] Mocking and Stubs:
            - [ ] Utilize Jest to mock external modules and services.
            - [ ] Create stubs for database interactions to avoid hitting the actual database in tests.
        - [ ] Code Coverage:
            - [ ] Use Istanbul (nyc) with Jest to generate code coverage reports.
            - [ ] Aim for high code coverage while ensuring tests are meaningful.
    - [ ] Frontend Testing (React Components)
        - [ ] Unit and Component Tests:
            - [ ] Use Jest and React Testing Library to test individual components.
            - [ ] Test component rendering and user interactions.
        - [ ] Mocking Hooks and Contexts:
            - [ ] Mock custom hooks and context providers if necessary to isolate components for testing.
        - [ ] Snapshot Testing:
            - [ ] Optionally use Jest's snapshot testing to ensure UI does not change unexpectedly.
    - [ ] End-to-End Testing
        - [ ] Cypress or Puppeteer:
            - [ ] Set up Cypress or Puppeteer for end-to-end testing.
            - [ ] Write tests that simulate real user interactions from the frontend through to the backend.
    - [ ] Continuous Integration and Continuous Deployment (CI/CD)
        - [ ] Setup CI/CD Pipeline:
            - [ ] Use tools like GitHub Actions, GitLab CI/CD, or CircleCI.
            - [ ] Configure the pipeline to run tests on every push or pull request.
            - [ ] Automate deployment on successful builds/tests to staging or production environments.

- [ ] AI Components:
    - [ ] RAG (Retrieval Augmented Generation) application - building LLM skills
    - [ ] noise addition/reduction
    - [ ] class prediction as hint/second opinion
    - [ ] mnemonic image generation
    - [ ] clustering to identify audibly/visually similar
