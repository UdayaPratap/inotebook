const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");

//ROUTE 1 : Get all notes of logged in user: GET "/api/notes/fetchallnotes". Login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    //fetch notes of current user
    const notes = await Note.find({ user: req.user.id });
    //send to user
    res.json(notes);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error...");
  }
});
//ROUTE 2 : Add note of logged in user: POST "/api/notes/addnote". Login required
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
        //extract data from req body
      const { title, description, tag } = req.body;
      //if there are errors, return errors and bad request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      //create new note
      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      //save new note to db
      const savedNote = await note.save();
      //send saved note to user
      res.json(savedNote);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal server error...");
    }
  }
);

//ROUTE 3 : Update note of logged in user: PUT "/api/notes/updatenote". Login required
router.put( "/updatenote/:id", fetchuser, async (req, res) => {
    const{title, description, tag}= req.body;
    //create newNote
    const newNote={};
    if(title){ newNote.title=title; }
    if(description){ newNote.description=description; }
    if(tag){ newNote.tag=tag; }

    //Find note to be update and update it
    try{
    let note= await Note.findById(req.params.id);
    if(!note){ res.status(404).send("Not found")}; 
    //id of user accessing and user of note mismatch
    if(note.user.toString() !==req.user.id){
      return res.status(401).send("Not allowed");
    }
    note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true});
    res.json({note});
  }catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error...");
  }


  });

  //ROUTE 4 : Delete note of logged in user: DELETE "/api/notes/deletenote". Login required
router.delete( "/deletenote/:id", fetchuser, async (req, res) => {
  
  //Find note to be deleted and delete it
  try
 { let note= await Note.findById(req.params.id);
  if(!note){ res.status(404).send("Not found")}; 
  //id of user accessing and user of note mismatch
  if(note.user.toString() !==req.user.id){
    return res.status(401).send("Not allowed");
  }
  note = await Note.findByIdAndDelete(req.params.id);
  res.json({ "Success" : "Note deleted.", "note": note});}
  catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error...");
  }


});
module.exports = router;
