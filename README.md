# learning_app

TODOs:
- [ ] remaining models
    - [ ] item should have no next review date until lesson complete
    - [ ] count how many items due for review now, in next hour, next 24 hours.
    - [ ] reviewSession (combines all reviews ready for review)
    - [ ] ungradedSession (select some items to review)
    - [ ] review (created date, review date, birdCallId)
        - [ ] create new review whether correct or incorrect with associated times etc.
    - [ ] projections
- [ ] All CRUD and api endpoints
    - [x] birdCalls 
        - [x] get all
        - [x] search by id
        - [x] get specific (level, class)
    - [x] users 
        - [x] get all
        - [x] search by id
        - [x] get specific (username, email)
        - [x] update (e.g. level)
        - [x] delete 
        - [x] level up
    - [x] userLevel 
        - [x] get all
        - [x] search by id
        - [x] get specific (level number)
    - [ ] item
        - [x] get all
        - [x] search by id
        - [x] get specific (userId, birdCallId, level)
        - [x] create (all items for new level for user)
        - [x] update (level, reviewdate etc) 
            - [ ] do if if lesson/review complete
        - [x] delete
    - [x] itemLevel
        - [x] get all
        - [x] get by id
        - [x] get specific (num, name)
    - [ ] lesson 
        - [ ] in UI, [display audio, spectrogram, metadata]
        - [x] make for all current level items when levelup
        - [x] move item from level 0 to 1 when done and delete lesson
        - [x] create, get all, get by id, delete
    

- [ ] Testing scripts
- [ ] Connect to AWS to load sounds
- [x] lesson unlock
- [ ] Review scheduler
- [ ] Level progression timing
- [ ] lesson creator (teacher, admin)
- [ ] Assign students to teacher