import React from "react";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import TagList from "./TagList"
import "./Tags.css"
const Tags= ()=>{
    const tagsList=[
        {
            id:1,
            tagName:"Html",
            tagDesc:"HTML (HyperText Markup Language) is the markup language for creating web pages and other information to be displayed in a web browser."
        },
        {
            id:2,
            tagName:"javascript",
            tagDesc:"For questions about programming in ECMAScript (JavaScript/JS) and its different dialects/implementations (except for ActionScript)"
        },
        {
            id:3,
            tagName:"python",
            tagDesc:"Python is a multi-paradigm, dynamically typed, multi-purpose programming language. It is designed to be quick to learn, understand, and"
        },
        {
            id:4,
            tagName:"java",
            tagDesc:"Java is a high-level object-oriented programming language. Use this tag when you're having problems using or understanding the language itself. "
        },
        {
            id:5,
            tagName:"C#",
            tagDesc:"C# is a high-level, statically typed, multi-paradigm programming language developed by Microsoft. C# code usually targets"
        },
        {
            id:6,
            tagName:"jQuery",
            tagDesc:"jQuery is a JavaScript library. Consider also adding the JavaScript tag. jQuery is a popular cross-browser JavaScript library that facilitates Document Objects"
        },
        {
            id:7,
            tagName:"C++",
            tagDesc:"C++ is a general-purpose programming language. Initially, it was designed as an extension to C and has a similar syntax, but it is now a"
        }
    ]
    return(
        <div className="home-container-1">
           <LeftSidebar></LeftSidebar>
           <div className="home-container-2">
           <h1 className="tag-h1">Tags</h1>

               <p className="tag-p">A tag is a keyword or label that categorizes your question with other, similar questions. Using the right tags makes it easier for others to find and answer your question.</p>  
               <div className="tags-list-container">
                 {
                    tagsList.map((tag) =>(
                     <TagList tag={tag} key={tagsList.id}/>
                 ))
                 }
               </div>      
           </div>
        </div>
    )
}

export default Tags