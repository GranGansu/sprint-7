import React from 'react';
import ReactDOM from 'react-dom/client';
import Bienvenida from './links/Bienvenida'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './index.css';
import App from './links/App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Router>
        <div>
            <nav>
                <ul>
                    <li><Link to='/'>Home</Link></li>
                    <li><Link to='/presupuesto'>Presupuesto</Link></li>
                </ul>
            </nav>
            <Routes>
                <Route exact path='/presupuesto' element={<App />}></Route>
                <Route exact path='/' element={<Bienvenida />}></Route>
            </Routes>

        </div>
    </Router>
);