import { useState } from "react";
import NoteContext from "./NoteContext";

const NoteState = (props)=>{
    const host="http://localhost:5000"
    const notesInitial=[]
      const [notes, setNotes] = useState(notesInitial);

      
      //GET ALL NOTES
      const getNotes=async ()=>{
        //API CALL
        const response = await fetch(`${host}/api/notes/fetchallnotes`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjQ1ODhjMzBiODVhY2RlZDgzMTkyNDY1In0sImlhdCI6MTY4MzUyNDY4Mn0.rszOtIWCkKKEWE73e2716KaFIeHl_Tx-OM-zByrYgOU"

          },
        });
        const json=await response.json();
        console.log(json);
        setNotes(json);
      };


      //ADD NOTE
      const addNote=async (title, description, tag)=>{
        //API CALL
        const response = await fetch(`${host}/api/notes/addnote`, {
          method: "POST",
          headers: {
            "Accept": "*/*",
            "Content-Type": "application/json",
            "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjQ1ODhjMzBiODVhY2RlZDgzMTkyNDY1In0sImlhdCI6MTY4MzUyNDY4Mn0.rszOtIWCkKKEWE73e2716KaFIeHl_Tx-OM-zByrYgOU"

          },
          body: JSON.stringify({title, description, tag}),
        });

        //Logic client side add
        console.log("adding new note");
        const note={
          "_id": "645ca687fde048d46361f8c29",
          "user": "64588c30b85acded83192465",
          "title": title,
          "description": description ,
          "tag": tag,
          "date": "2023-05-11T08:25:43.365Z",
          "__v": 0
        };
        setNotes(notes.concat(note));
      };
      
      
      //DELETE NOTE
      const deleteNote=async (id)=>{
        //API CALL
        const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjQ1ODhjMzBiODVhY2RlZDgzMTkyNDY1In0sImlhdCI6MTY4MzUyNDY4Mn0.rszOtIWCkKKEWE73e2716KaFIeHl_Tx-OM-zByrYgOU"

          }
        });
        const json=response.json(); 
        console.log(json);
        //logic
        console.log("Deleting note with id"+id);
        const newNotes=notes.filter((note)=>{ return note._id!==id})
        setNotes(newNotes);
      };
     
      
      //EDIT NOTE
      const editNote=async (id, title, description, tag)=>{
        //API CALL
        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjQ1ODhjMzBiODVhY2RlZDgzMTkyNDY1In0sImlhdCI6MTY4MzUyNDY4Mn0.rszOtIWCkKKEWE73e2716KaFIeHl_Tx-OM-zByrYgOU"

          },
          body: JSON.stringify({title, description, tag}),
        });
        const json=response.json();  
      
      //logic for updating client side note
        for( let index=0; index<notes.length; index++){
          const element=notes[index];
          if(element._id===id){
            element.title=title;
            element.tag=tag;
            element.description=description;
          }
        }

      };
        return (
            <NoteContext.Provider value={{notes, addNote, deleteNote, editNote, getNotes}}>
                {props.children}
            </NoteContext.Provider>
        )
}

export default NoteState;