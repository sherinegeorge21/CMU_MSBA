// --------------------------
// Section 1
//-- Question # 1
//-- --------------------------
db = db.getSiblingDB("sample_geospatial");

db.shipwrecks.aggregate([
{$match: { latdec : {$gt: 66.5}}},
{$count: "Numberofshipwrecks"}
])

//-- --------------------------
//-- Question #2
//-- --------------------------
db.getCollection("shipwrecks").find(
    { "history": "Loaded with explosives" },
    {
        "_id": 1,
        "chart": 1,
        "depth": 1,
        "history": 1,
        "watlev": 1,
        "coordinates": 1
    }
)

//-- --------------------------
//-- Question #3
//-- --------------------------
db.getCollection("shipwrecks").aggregate([
    {
        $match: {
            "feature_type": "Wrecks - Visible",
            "watlev": "covers and uncovers",
            "latdec": { $gte: 45.0, $lte: 60.0 }
        }
    },
    {
        $project: {
            "Wreck Coordinates": "$coordinates",
            "Wreck Status": "$feature_type",
            "Water Level": "$watlev"
        }
    }
])

//-- --------------------------
//   Section 2
//-- Question #4
//-- --------------------------
db = db.getSiblingDB("sample_airbnb");

db.listingsAndReviews.aggregate([
    {
        $match: {
            "address.market": "Sydney",
            "address.suburb": "Bondi Beach",
            "bedrooms": { $gte: 2 },
            "amenities": { $all: ["Kitchen", "Air conditioning"] }
        }
    },
    {
        $count: "Matches found"
    }
])


//-- --------------------------
//-- Question #5
//-- --------------------------

db.listingsAndReviews.aggregate([
    {
        $match: {
            "address.suburb": "Bondi Beach",
            "address.market": "Sydney"
        }
    },
    {
        $sort: {
            "price": -1
        }
    },
    {
        $limit: 3
    },
    {
        $project: {"_id":0,
            "Listing URL": "$listing_url",
            "Listing name": "$name",
            "Nightly price": "$price",
            "Suburb": "$address.suburb",
            "Airbnb market": "$address.market"
        }
    }
])

//-- --------------------------
//-- Question #6
//-- --------------------------

db.listingsAndReviews.aggregate([
    {
        $match: {
            "address.market": { $in: ["Oahu", "Kauai", "Maui", "The Big Island"] }
        }
    },
    {
        $group: {
            _id: "$address.market",
            "Number Of Listings": { $count: {} },
            "Lowest nightly listing price": { $min: "$price" },
            "Average nightly listing price": { $avg: "$price" },
            "Highest nightly listing price": { $max: "$price" }
        }
    },
    {
        $sort: {
            "Number Of Listings": -1
        }
    },
    {
        $project: {
            "Hawaiian Market": "$_id",
            "Number Of Listings": 1,
            "Lowest nightly listing price": 1,
            "Average nightly listing price": 1,
            "Highest nightly listing price": 1,
            _id: 0
        }
    }
])

//-- --------------------------
//-- Question #7
//-- --------------------------
db.listingsAndReviews.aggregate([
    {
        $match: {
            "address.market": { $in: ["New York", "Istanbul", "Barcelona", "Hong Kong", "Porto", "Sydney"] },
            "bedrooms": 1,
            "room_type": "Entire home/apt",
            "amenities": { $all: ["Wifi", "Kitchen", "Coffee maker"] },
            "review_scores.review_scores_rating": { $gte: 95 }
        }
    },
    {
        $group: {
            _id: "$address.market",
            "City": { $first: "$address.market" },
            "Number Of Listings": { $count: {} },
            "Average nightly price": { $avg: "$price" }
        }
    },
    {
        $sort: {
            "Number Of Listings": 1
        }
    },
    {
        $project: {
            "City": "$_id",
            "Number Of Listings": 1,
            "Average nightly price": {$round:["$Average nightly price",2]},
            _id: 0
        }
    }
])
//-- --------------------------
//   Section 3
//-- Question #8
//-- --------------------------
db = db.getSiblingDB("sample_mflix");

db.theaters.aggregate([
        { $unwind: "$location.address.zipcode" 
        }
   ,{ $group: 
       { _id: "$location.address.zipcode",
               "Zip": { $first: "$location.address.zipcode" }, 
                "TotalTheaters": {$count:{}} } }
   ,{ 
       $project: { "_id": 0, "Zip": 1, "TotalTheaters": 1 } 
       },
       {$sort:{"TotalTheaters":-1}}
   ,{ 
       $match: { "TotalTheaters": { $gte: 5 } 
       } 
       }
])

//-- --------------------------
//-- Question #9
//-- --------------------------
db.movies.aggregate([
         { $unwind: "$directors" },
         {
             $match:
             {"year": {$gte :2003, $lte : 2013},
                "directors":{ $in: [
                "Martin Scorsese", 
                "Christopher Nolan",
                "Tim Burton", 
                "Spike Lee",     
                "Lucy Walker", 
                "Peter Jackson", 
                "Susanne Bier", 
                "Sang-soo Hong",
                "Robert Rodriguez"]
                } }} ,
        { 
            $group:{"_id" :"$directors",
            "Director" : { $first: "$directors"},
         "TotalFilmsDirected":{$count:{}
         } } },
         {
             $project: { "_id" : 0}
             },
         {$sort: {"TotalFilmsDirected" : -1}}
         ])

//-- --------------------------
//-- Question #10
//-- --------------------------

db.movies.aggregate([     
        {$match:
            {"year": {$gte :2008, $lte : 2016},
            "genres" : "Comedy"}
            },
        { $unwind: "$cast" },  
        {$group:{
        "_id": "$cast",
        "Actor" : { $first: "$cast"},    
        "NumberOfComediesReleased":{$count:{}},
        "AverageIMDBRating" :{$avg: "$imdb.rating"} 
        }},
        { $match: 
            { "NumberOfComediesReleased": { $gt: 10 } 
            } }, 
        {$project: 
            { "_id" : 0}
            },
        {$sort: 
            {"AverageIMDBRating" : -1}
            }
            ])