import React from 'react';
import './App.css';


import AceEditor from "react-ace";
import  "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-c_cpp";
import Button from '@mui/material/Button';
import axios from "axios";

import { useState } from 'react';

function App() {
	const [code,setCode] = useState(null);
	const [mode,setMode] = useState("java");
	const [input,setInput] = useState("");
	const [output,setOutput] = useState("");
	const [err,setErr] = useState(null);
	const [language,setLanguage] = useState({
		language:'java',
		version:'15.0.2'
	})
	const setCredentials = (e) => {
		const name = e.target.value;
		if(name==="java")
		{
			setLanguage(
				{
					language: "java",
    				version: "15.0.2",
				}
			)
			setMode("java");
		}
		else if(name==="python")
		{
			setLanguage({
				language: "python",
    			version: "3.10.0",
			});
			setMode("python")
		}
		else if(name==="cpp")
		{
			setLanguage({
				language: "c++",
    			version: "10.2.0",
			})
			setMode("c_cpp");
		}
	}
	const onChange = (e)=>{
		setCode(e);
	}
	const handle_input = (e)=>{
		setInput(e.target.value);
	}
	const submit = ()=>{
		if(code===null||code==="")
		{
			alert("editor cannot be empty");
		}
		else{


		const post_data = {
			language:language.language,
			version:language.version,
			files : [
				{
					content:code,
				},
			],
			stdin:input
		}
		axios.post('https://emkc.org/api/v2/piston/execute',post_data,{
			headers:{
				'Content-type':'application/json'
			}
		}).then((data)=>{
			const err = data.data.run.stderr;
			if(err)
			{
				setOutput(err);
				setErr(true);
			}
			else{
				setOutput(data.data.run.stdout);
				setErr(false);
			}
		}).catch((err)=>{
			alert("software is currently down");
		})
	}
	}
	/*Editor stylings */
	const output_stying = {
		color : err? 'red':'white'
	}

  return (
    <div className="App">
        <div className="left">
            <div className="editor">
				
			<AceEditor
				style={{height:'80vh',width:'90%'}}
				theme = {'dracula'}
				mode={mode}
				onChange={onChange}
				name="UNIQUE_ID_OF_DIV"
				editorProps={{ $blockScrolling: false }}
				setOptions={{
					showPrintMargin: false,
					enableBasicAutocompletion: true,
					enableLiveAutocompletion: true,
					enableSnippets: true,
					fontSize: "1.2rem"
				}}
			/>

            </div>
            <div className="services">
				<Button onClick={submit} >Run</Button>
            </div>
        </div>
        <div className="right">
				<select onChange={setCredentials} name="" id="">
					<option value="java">Java</option>
					<option value="python">python</option>
					<option value="cpp">cpp</option>
				</select>
            <div className="input_feild">
				<h1>Input</h1>
				<textarea onChange={handle_input} value={input} name="" cols="30" rows="10" placeholder="Enter your input here" >

				</textarea>
            </div>
            <div className="output_feild">
				<h1>Output</h1>
				<textarea style={output_stying} value={output} name="" cols="30" rows="10" placeholder="Enter your input here" >
					
				</textarea>
            </div>
        </div>
    </div>
  );
}

export default App;
