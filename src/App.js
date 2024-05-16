import './App.css';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import Navbar from './layout/Navbar';
import Home from './pages/Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {Modal} from 'react-bootstrap/Modal';
import AddNonprofit from './nonprofits/AddNonprofit';
import EditNonprofit from './nonprofits/EditNonprofit';
import Foundations from './foundations';
import AddFoundation from './foundations/AddFoundation';
import EditFoundation from './foundations/EditFoundation';
import Emailtemplates from './emailtemplates';
import EditEmailtemplate from './emailtemplates/EditEmailtemplate';
import AddEmailtemplate from './emailtemplates/AddEmailtemplate';
import Emails from './emails';
import ViewEmail from './emails/ViewEmail';
import Grants from './grants';

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar/>

        <Routes>
          <Route exact path="/" element={<Home/>} />
          <Route exact path="/addnonprofit" element={<AddNonprofit/>} />
          <Route exact path="/editnonprofit/:id" element={<EditNonprofit/>} />

          <Route exact path="/foundations" element={<Foundations/>} />
          <Route exact path="/addfoundation" element={<AddFoundation/>} />
          <Route exact path="/editfoundation/:id" element={<EditFoundation/>} />

          <Route exact path="/email-templates" element={<Emailtemplates/>} />
          <Route exact path="/add-email-templates" element={<AddEmailtemplate/>} />
          <Route exact path="/edit-email-templates/:id" element={<EditEmailtemplate/>} />

          <Route exact path="/emails" element={<Emails/>} />
          <Route exact path="/emails/:id" element={<ViewEmail/>} />

          <Route exact path="/grants" element={<Grants/>} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;
