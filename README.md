# learning_app

TODOs:
- [ ] remaining models
    - [x] count how many items due for review now, in next hour, next 24 hours.
    - [ ] reviewSession (combines all reviews ready for review)
        - [x] UI [display audio, spectrogram, metadata]
        - [ ] text box for answer
        - [ ] disable next review button until answered
        - [x] prev review, disable if first etc
        - [ ] multiple choice
        - [ ] create new review whether correct or incorrect with associated times etc.
    - [ ] ungradedSession (select some items to review, no change to items)
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
    - [x] item
        - [x] get all
        - [x] search by id
        - [x] get specific (userId, birdCallId, level)
        - [x] create (all items for new level for user)
        - [x] level up
        - [x] update (level, reviewdate etc) 
            - [x] do if if lesson/review complete
        - [x] delete
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
- [ ] modularize common scripts
- [ ] get Birdcall mnemonics
- [ ] open database of bird images (possible hint)
- [ ] navigation tabs/buttons
- [ ] modern styling
- [ ] Testing scripts
    - [ ] each api call
    - [ ] aws connect
- [x] Connect to AWS to load sounds
- [x] lesson unlock
- [ ] Review scheduler
- [ ] Level progression timing
- [ ] lesson creator (teacher, admin) probably just permissions based
- [ ] Assign students to teacher (classroom model perhaps)
