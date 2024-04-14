import React,{useState} from 'react';
import {GoogleGenerativeAI} from "@google/generative-ai";
import './AIwithtext.css';
const AIwithtext=()=>{
    const genAI=new GoogleGenerativeAI('YOUR_API_KEY');
    const[search,setSearch]=useState('');
    const [breakfastResponse, setBreakfastResponse] = useState('');
    const [lunchResponse, setLunchResponse] = useState('');
    const [dinnerResponse, setDinnerResponse] = useState('');
    const[loading,setLoading]=useState('');
    async function airun(prompt,setResponse){
        setLoading(true);
        setResponse('');
        const model =genAI.getGenerativeModel({model:"gemini-pro"});
        const result= await model.generateContent(prompt);
        const response = await result.response;
        const text=response.text();
        setResponse(text);
        setLoading(false);
    }

    const handleChangeSearch=(e)=>{
        setSearch(e.target.value);
    }
    const handleClick=()=>{
        const promptBreakfast = `Provide a random breakfast recipe containing ${search} ingredients. The recipe should have the following format: Title, cooking duration, ingredients, steps to cook`;
        const promptLunch = `Provide a random lunch recipe containing ${search} ingredients. The recipe should have the following format: Title, cooking duration, ingredients, steps to cook`;
        const promptDinner = `Provide a random dinner recipe containing ${search} ingredients. The recipe should have the following format: Title, cooking duration, ingredients, steps to cook`;
        airun(promptBreakfast, setBreakfastResponse);
        airun(promptLunch, setLunchResponse);
        airun(promptDinner, setDinnerResponse);
    }

    const formatRecipeResponse = (response) => {
        const boldWords = ['Cooking Duration:', 'Ingredients:', 'Steps to Cook:', 'Title:'];

        // Split the response by line breaks
        const lines = response.split('\n');
    
        // Extract and bold the title separately
        const title = lines.shift(); // Remove and store the first line (title)
        const boldTitle = `<strong>${title}</strong>`; // Make the title bold
    
        // Map each remaining line
        const formattedLines = lines.map((line, index) => {
            // Remove the '**' characters from each line and make specified words bold
            boldWords.forEach((word) => {
                line = line.replace(`**${word}**`, `<strong>${word}</strong>`); 
            });
            return line;
        });
    
        // Construct the final formatted response with bold title and lines
        return (
            <>
                <p dangerouslySetInnerHTML={{ __html: boldTitle }} /> 
                {formattedLines.map((line, index) => (
                    <p key={index} dangerouslySetInnerHTML={{ __html: line }} /> 
                ))}
            </>
        );
    }
    
    

    return (
        <div>
        <div style={{ backgroundColor:'rgb(248,241,174)'}} >
            <div class='heading'>
                <p>AI RECIPE GENERATOR</p>

            </div>
            
            <h2>-Made By Sasha Madkaikar</h2>
            <div  style={{ display: 'flex' }}>
                <input class='inp' placeholder='Enter ingredients to get recipies' onChange={(e) => handleChangeSearch(e)} />
                <button  onClick={() => handleClick()}>Search</button>
            </div>
        </div>
            {loading ?
                <p style={{ margin: '30px 0', textAlign: 'center' }}>Loading ...</p>
                :
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{ margin: '0 10px' }}>
                        <h2>Breakfast Recipe:</h2>
                        {breakfastResponse && formatRecipeResponse(breakfastResponse)}
                    </div>
                    <hr />
                    <div style={{ margin: '0 10px' }}>
                        <h2>Lunch Recipe:</h2>
                        {lunchResponse && formatRecipeResponse(lunchResponse)}
                    </div>
                    <hr />
                    <div style={{ margin: '0 10px' }}>
                        <h2>Dinner Recipe:</h2>
                        {dinnerResponse && formatRecipeResponse(dinnerResponse)}
                    </div>
                </div>
            }
        </div>
    );
}

export default AIwithtext;