import axios from "axios";

const API =
"http://localhost:8000/api/subjects";

export const getSubjects =
async()=>{

    const token =
    localStorage.getItem("token");

    const res =
    await axios.get(API,{

        headers:{
            Authorization:
            `Bearer ${token}`
        }

    });

    return res.data;

};