# respite 🛫
## About
Respite is a flight routing algorithm designed for application to single airlines or otherwise larger, aggregate travel sites. I am undertaking this project to teach myself more about algorithms and time/space complexity.

<img src="https://github.com/skylerspaeth/respite/blob/master/docs/about.png" width="60%">

## Setup
### Database Seeding
In a read-only configuration, this project could work off a directory of JSON files... but that makes things significantly harder to scale. Respite instead uses mongoDB for database functionality and Mongoose for ODM. An identical structure must be present in your database for the code to be ran as expected.

To begin, setup a mongoDB database called `respiteDB`:
```
MongoDB/
├── <other databases>/
│   └── <for example admin, config, local>
└── respiteDB/
    └── operations/
        ├── { "fcode":"BAW", "fnum":"190", ..... }
        └── <other flight docs>
```
Ensure it is setup with the same structure shown in the screenshot below:
![Screenshot](docs/mongoShell.png)
Each of the entries in the `db.operations` collection should be a regularly scheduled flight that is operated by the carrier.

The easiest way to add flights to the database would be to use `src/generate-flight.ts`. You must first complie this in to Node-interpretable JavaScript by running `tsc`. The resulting program expects a number as a system argument specifying how many round-trip flight pairs to generate. Executing the command `node generate-flight.js 2` would generate 2 random, round-trip flights (resulting in 4 new documents) and add them to the database's collection `operations` even if it did not yet exist.
### Algorithm Interaction
These docs will come shortly.

## Project scope
This project is intended to find the most effective flight itineraries with regard to time, transfers, and comfort (class). As the purpose of this algorithm is strictly educational, pricing and more advanced filters are currently out of its scope, but may come later.
