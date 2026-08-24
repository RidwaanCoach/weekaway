WEEKAWAY - DEMO SETUP
=====================

South Africa's marketplace for resort weeks (working name WeekAway).
This is the v1 demo build - all data is sample data.

WHAT YOU NEED
-------------
Node.js 20 or newer installed (free, https://nodejs.org - download the LTS version).
Nothing else. No database server or other tools needed.

HOW TO RUN IT
-------------
1. Unzip this folder anywhere.
2. Open a terminal / command prompt in the weekaway folder
   (in Windows Explorer: right-click inside the folder > "Open in Terminal").
3. Run:  npm install        (one-time, takes a minute or two)
4. Run:  npm run dev
5. Open  http://localhost:3000  in your browser.

DEMO LOGINS
-----------
Admin:          admin@weekaway.co.za    / admin123
Approved agent: sharon@coastalweeks.co.za  / agent123
Approved agent: pieter@bushveldbreaks.co.za / agent123
Pending agent:  thabo@sunseeker.co.za   / agent123

THE 30-SECOND DEMO STORY
------------------------
1. Log in as Thabo -> blocked with "Application under review".
2. Log in as admin -> approve the SunSeeker application.
3. Log in as Thabo again -> full agent portal unlocked.
That approval gate is the trust promise of the whole business.

Also try: search weeks on the home page, open Club Mykonos and note the
same week listed by two agents at different prices (price transparency),
send an enquiry on any listing, then log in as that agent to reply to it.

RESETTING THE DEMO
------------------
Anything you change (approvals, listings, enquiries, signups) is saved.
To restore the original demo state: log in as admin and click
"Reset demo data" on the admin overview page.

The included database (prisma/dev.db) already contains the demo data,
so it works straight after npm install. If the database ever gets into
a bad state, run:  npx tsx prisma/seed.ts
