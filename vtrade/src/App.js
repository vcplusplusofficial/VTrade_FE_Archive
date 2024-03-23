import "./App.css";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./Components/Navbar";
import Login from "./Components/Login";
import Register from "./Components/Register";
import ForgotPasswordConfirm from "./Components/ForgotPassword/ForgotPasswordConfirm";
import ForgotPasswordEmail from "./Components/ForgotPassword/ForgotPasswordEmail";
import NotFound from "./Components/NotFound";
import apiClient from "./Services/apiClient";
import HomePage from "./Components/HomePage";
import ProductPage from "./Components/ProductPage";
import Loader from "./Components/Loader";
import Dashboard from "./Components/Dashboard";
import Breadcrumbs from "./Components/Breadcrumbs";
import CategoryPage from "./Components/CategoryPage";
import PostListing from "./Components/PostListing";

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      const { data, error } = await apiClient.fetchUserFromToken();

      if (data) {
        setUser(data.user);
      }
      if (error) {
        setError(error);
      }
      setIsLoading(false);
    };

    setIsLoading(true);
    const token = localStorage.getItem("vtrade_token");
    if (token) {
      apiClient.setToken(token);
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  return (
    <div>
      <BrowserRouter>
        <Navbar
          user={user}
          setUser={setUser}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          Loader={Loader}
        />
        <Breadcrumbs />
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                user={user}
                setUser={setUser}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                Loader={Loader}
              />
            }
          />
          <Route
            path="/Dashboard"
            element={
              <Dashboard
                user={user}
                setUser={setUser}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                Loader={Loader}
              />
            }
          />
          <Route
            path="/Login"
            element={
              <Login
                user={user}
                setUser={setUser}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                Loader={Loader}
              />
            }
          />
          <Route
            path="/Register"
            element={
              <Register
                user={user}
                setUser={setUser}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                Loader={Loader}
              />
            }
          />
          <Route
            path="/passwordemail"
            element={
              <ForgotPasswordEmail
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                Loader={Loader}
              />
            }
          />
          <Route path="/passwordconfirm" element={<ForgotPasswordConfirm />} />
          <Route
            path="/Product/:category"
            element={
              <ProductPage
                user={user}
                setUser={setUser}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                Loader={Loader}
              />
            }
          />

          <Route path="/*" element={<NotFound />} />
          <Route
            path="/:category"
            element={
              <CategoryPage
                user={user}
                setUser={setUser}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                Loader={Loader}
              />
            }
          />
          <Route
            path="/Post"
            element={
              <PostListing
                user={user}
                setUser={setUser}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                Loader={Loader}
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
