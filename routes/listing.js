const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const ExpressError = require("../utils/ExpressError");
const { listingSchema } = require("../schema.js");
const Listing= require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing,} = require("../middleware.js")
const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const {storage} = require("../cloud_config.js");
const upload = multer({ storage });



   router
    .route("/")
    .get( wrapAsync(listingController.index))
    .post(
    isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.createRoute)
    )
    
    // new route
    router.get("/new" , isLoggedIn, listingController.newRoute);

    router.route("/:id")
    .put(
      upload.single('listing[image]'),
      validateListing,isLoggedIn,isOwner,
  wrapAsync(listingController.updateRoute)
  )
  .delete( isLoggedIn,isOwner,listingController.deleteRoute)
  .get(wrapAsync(listingController.showRoute));
  
  // Edit Route
    router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync( listingController.editRoute)
  );

// // index route
// router.get("/" , wrapAsync(listingController.index)
// );



//create route

// router.post("/",
//      validateListing,isLoggedIn,isOwner,
//      wrapAsync(listingController.createRoute)
  
//   );

   //Update Route
// router.put("/:id",validateListing,isLoggedIn,isOwner,
// wrapAsync(listingController.updateRoute)
//   );
  
  //Delete Route
//   router.delete("/:id", isLoggedIn,isOwner,listingController.deleteRoute);

  
  //show route
//   router.get("/:id" ,wrapAsync(listingController.showRoute));

module.exports = router ;


