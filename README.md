A RESTful Api  that provides structured geographical data of Nigeria including States, Capital, Local Government Area(LGA) and Communities.

Tech Stack
.Nodejs
.Expressjs
.MongoDB

create a .env file in the directory
.PORT=3000
.MONGO_URI=your mongodb connecting string
.JWT_SECRET=

API Endpointd
Get all state
GET/api/geo/states

Search State, LGA or Community
GET/api/geo/search?name=imo
