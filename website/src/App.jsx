import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Main, DeleteAccount, GuideLines, Policy, Terms } from './screens';

const redirect = () => {
    const url = window.location.href;
    const afterHash = url.split('#/')[1];
    if(afterHash!==undefined){
        if(afterHash==='terms'){
            document.getElementById('term-bt').click();
        }if(afterHash==='privacy-policy'){
            document.getElementById('privacy-policy-bt').click();
        }if(afterHash==='community-guidelines'){
            document.getElementById('community-guidelines-bt').click();
        }if(afterHash==='delete-account'){
            document.getElementById('delete-account-bt').click();
        }
    }
};

function App() {

    React.useEffect(() => {
        console.log('Welcome to Wytty console, hehe','\n','You can hack us here 😆');
        redirect();
    }, []);

  return (

        <div className="App">
            <Router>
                <Routes>
                    <Route path="/" element={<Main/>}/>
                    <Route path="/community-guidelines" element={<GuideLines/>}/>
                    <Route path="/privacy-policy" element={<Policy/>}/>
                    <Route path="/terms" element={<Terms/>}/>
                    <Route path="/delete-account" element={<DeleteAccount/>}/>
                </Routes>
            </Router>
        </div>

    );

}

export default App;