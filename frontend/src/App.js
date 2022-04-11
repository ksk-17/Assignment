import { useEffect, useState } from 'react';
import './bootstrap.min.css'
import './App.css';
import {Button, Form} from 'react-bootstrap';
import axios from 'axios';
import {MdAddCircleOutline, MdDeleteOutline, MdOutlineContentCopy, MdOutlineImage, MdOutlineMenu} from "react-icons/md";

function App() {

  const [questions, setQuestions] = useState([]);
  const [title, setTitle] = useState("");
  const [options, setOptions] = useState([""]);
  const [required, setRequired] = useState(false);
  const [add, setAdd] = useState(false);

  const fetchQuestions=async()=>{
    try{
      const {data}= await axios.get('/api/questions');
      setQuestions(data);
    }
    catch(error){
      console.log("Error occured in fetching data");
    }
  }

  const handleSubmit=async()=>{
    try{
      const config={
        headers:{
          "Content-Type":"application/json"
        }
      };

      const data={
        "title":title,
        "docs":JSON.stringify(options),
        "required":required
      };


      await axios.post('/api/questions',data,config);

      setTitle("");
      setOptions([""]);
      setRequired(false);
      setAdd(false);
    }
    catch(error){
      console.log("Error occured in creating new Question");
    }
  }

  const handleDelete=async(id)=>{
    try{
      await axios.delete(`api/question/${id}`);
    }
    catch(error){
      console.log("Error occured in deleting the Question");
    }
  }

  const handleSwitch=()=>{
    setRequired(!required);
  }

  const handleAdd=()=>{
    setAdd(true);
  }

  const handleCancel=()=>{
    setAdd(false);
  }

  const handleClear=()=>{
    setTitle("");
    setOptions([""]);
    setRequired(false);
  }


  useEffect(() => {
    fetchQuestions();
  }, [questions])


  return (
    <div className="App">
      <h2>Screening Questions</h2>
      <p>Narrow down your candidates</p>
      <div className="body">
        <div className="form">
          {questions.map((question,index)=>(
            <Form className="question p-2">
              <p>Q{index+1}. {question.title}</p>
                <Button variant="outline-danger" onClick={()=>{
                  handleDelete(question.id)
                }}>Delete</Button>
              {eval(question.docs).map((option,index1)=>(
                <div>
                  <Form.Check type='radio' id={index1} name={index} value={option} label={option} />
                </div>
              ))}
            </Form>
          ))}
          { add &&
            <Form className="addQuestionForm">
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Add question</Form.Label>
                  <Form.Control type="text" placeholder="question" value={title} onChange={(e)=>setTitle(e.target.value)}/>
                </Form.Group>
                {options.map((option,index)=>(
                  <div className="option">
                    <Form.Check type='radio' className="optionCheck" value={option}/>
                    <Form.Control className="optionInput" type="text" placeholder={`Option ${index+1}`} name="addOption" value={option} onChange={(e)=>{
                      const newOptions=options;
                      newOptions[index]=e.target.value;
                      setOptions(newOptions);
                    }}/>
                  </div>
                ))}
                <Form.Check className="Check" type='radio' id="addOptionButton" label="Add Option" onClick={()=>{
                  const newOptions=[...options,""];
                  setOptions(newOptions);
                }} defaultChecked/>
                <hr />
                <div className="addOptionFormFooter">
                  <MdOutlineContentCopy size={20} className="m-1"/>
                  <MdDeleteOutline size={20} className="m-1 mr-1" onClick={handleClear}/>
                  <Form.Check className="Check" type='switch' label="Required Field" onChange={handleSwitch}/>
                </div>
            </Form>}
          </div>
          <div className="menuOptions">
            <MdAddCircleOutline size={20} className="m-1" onClick={handleAdd}/>
            <MdOutlineMenu size={20} className="m-1"/>
            <MdOutlineImage size={20} className="m-1"/>
          </div>
          <div className="buttons">
            <Button variant="outline-primary" onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleSubmit}>Save</Button>
          </div>
      </div>
    </div>
  );
}

export default App;
