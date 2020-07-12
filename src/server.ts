import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';



(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  app.get( "/filteredimage/", async ( req, res ) => {
    
    // get the image_url from the request query
    const { image_url } = req.query;
  
    // Check if image_url is sent with the request and respone with 400 if not
    if (!image_url) {
      res.status(400).send('image_url is required')
      return
    }

    // Filter the file and save it to local storage
    const filteredFile = await filterImageFromURL(image_url);
     
    // Send the filtered file in the response
    res.sendFile(filteredFile);

    // Delete the filtered file from local storage after sending the file
    res.on('finish', () => deleteLocalFiles([filteredFile]));
  } );
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
