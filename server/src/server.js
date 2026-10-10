const express = require("express");
const app=express();

const PORT=5000;

app.get("/",(req,res) =>{
    res.send("Movie Booking API is running");

});

app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`);
})

app.get("/api/health",(req,res)=>{
    res.json(
        {
            status:"OK",
            message:"Movie Booking API is healthy"
        }
    );
});