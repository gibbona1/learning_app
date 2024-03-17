# learning_app

TODOs:
- [ ] remaining models
    - [ ] reviewSession (combines all reviews ready for review)
    - [ ] review (created date, review date, birdCallId)
        - [ ] create new review whether correct or incorrect with associated times etc.
    - [ ] itemLevel (e.g. 1-10, names (e.g. apprentice1 up to burned), time to next when on this level)
- [ ] All CRUD and api endpoints
    - [x] birdCalls 
        - [x] get all
        - [x] search by id
        - [x] get specific (level, class)
    - [x] users 
        - [x] get all
        - [x] search by id
        - [x] get specific (username, email)
    - [ ] userLevel 
        - [ ] get all
        - [ ] get specific (level number)
    - [ ] progress
        - [ ] get all
        - [ ] get specific (userId, birdCallId, level)
- [ ] Testing scripts
- [ ] Connect to AWS to load sounds
- [ ] lesson unlock
- [ ] Review scheduler
- [ ] Level progression timing
- [ ] lesson creator (teacher, admin)
- [ ] Assign students to teacher