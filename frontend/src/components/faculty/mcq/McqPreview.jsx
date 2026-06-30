import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// import Sidebar from "../../components/layout/Sidebar";
// import Navbar from "../../components/layout/Navbar";

// import { getMcqById } from "../../services/mcq.service";

export default function McqPreview(){

    const {id}=useParams();

    const [mcq,setMcq]=useState(null);

    useEffect(()=>{

        load();

    },[]);

    const load=async()=>{

        const data=await getMcqById(id);

        setMcq(data);

    }

    if(!mcq) return <h2>Loading...</h2>

    return(

<div style={{display:"flex"}}>

{/* <Sidebar/> */}

<div style={{flex:1}}>

{/* <Navbar/> */}

<div style={{padding:"35px"}}>

<h1>{mcq.title}</h1>

<h3>{mcq.Subject.name}</h3>

{

mcq.mcq_questions.map((q,index)=>(

<div
key={q.id}
style={{
background:"#fff",
padding:"20px",
marginBottom:"20px",
borderRadius:"18px"
}}
>

<h3>

Q{index+1}. {q.question}

</h3>

<p>A. {q.options.A}</p>

<p>B. {q.options.B}</p>

<p>C. {q.options.C}</p>

<p>D. {q.options.D}</p>

<p>

<b>Answer:</b> {q.correct_answer}

</p>

<p>

<b>Explanation:</b>

{q.explanation}

</p>

</div>

))

}

</div>

</div>

</div>

    )

}